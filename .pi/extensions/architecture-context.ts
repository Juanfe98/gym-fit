import * as fs from "node:fs";
import * as path from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

type ContextFile = {
  absolutePath: string;
  relativePath: string;
  mtimeMs: number;
  summary: string;
};

const MAX_TOTAL_CHARS = 14_000;
const MAX_FILE_CHARS = 3_500;

const EXACT_FILES = [
  "CLAUDE.md",
  "AGENTS.md",
  "SYSTEM.md",
  "README.md",
  "docs/architecture.md",
  "docs/README.md",
  "docs/gym_tracker_user_facing_app_spec.md",
];

const SEARCH_ROOTS = ["docs/adr", "specs"];
const IGNORE_DIRS = new Set([".git", "node_modules", ".next", "dist", "build", "coverage"]);

function existsFile(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function walkMarkdownFiles(root: string): string[] {
  const results: string[] = [];

  function walk(dir: string) {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        results.push(fullPath);
      }
    }
  }

  if (existsFile(root)) return [root];
  walk(root);
  return results;
}

function uniquePreservingOrder(values: string[]): string[] {
  const seen = new Set<string>();
  const results: string[] = [];
  for (const value of values) {
    if (seen.has(value)) continue;
    seen.add(value);
    results.push(value);
  }
  return results;
}

function compressMarkdown(raw: string, relativePath: string): string {
  const text = raw.replace(/\r\n/g, "\n").trim();
  if (text.length <= MAX_FILE_CHARS) return text;

  const lines = text.split("\n");
  const selected: string[] = [];
  let inFence = false;
  let takeFollowing = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const heading = /^(#{1,3})\s+(.+)/.exec(trimmed);
    const importantSection = /^#{1,3}\s+(overview|architecture|technical context|constraints|constitution check|project structure|decision|consequences|data model|api|contracts|testing|implementation|summary|current plan)/i.test(trimmed);
    const bullet = /^[-*]\s+/.test(trimmed);
    const numbered = /^\d+\.\s+/.test(trimmed);
    const adrMeta = /^(status|date|decision|context|consequences):/i.test(trimmed);

    if (heading) {
      selected.push(trimmed);
      takeFollowing = importantSection ? 8 : 2;
      continue;
    }

    if (takeFollowing > 0 && trimmed) {
      selected.push(line);
      takeFollowing--;
      continue;
    }

    if ((bullet || numbered || adrMeta) && selected.join("\n").length < MAX_FILE_CHARS) {
      selected.push(line);
    }

    if (selected.join("\n").length >= MAX_FILE_CHARS) break;
  }

  const compressed = selected.join("\n").trim();
  if (compressed.length > 400) {
    return `${compressed.slice(0, MAX_FILE_CHARS)}\n\n[Compressed from ${relativePath}; read the file for full detail.]`;
  }

  return `${text.slice(0, MAX_FILE_CHARS)}\n\n[Truncated from ${relativePath}; read the file for full detail.]`;
}

function discoverFiles(cwd: string): string[] {
  const exact = EXACT_FILES.map((file) => path.join(cwd, file)).filter(existsFile);
  const discovered = SEARCH_ROOTS.flatMap((root) => walkMarkdownFiles(path.join(cwd, root)));

  // Prefer current Speckit plan first when present, then include other plans/ADRs as compressed context.
  const currentPlan = path.join(cwd, "specs/007-exercise-library/plan.md");

  return uniquePreservingOrder([currentPlan, ...exact, ...discovered.sort((a, b) => a.localeCompare(b))].filter(existsFile));
}

function buildContext(cwd: string): { files: ContextFile[]; prompt: string } {
  const files = discoverFiles(cwd).map((absolutePath) => {
    const relativePath = path.relative(cwd, absolutePath);
    const stat = fs.statSync(absolutePath);
    const raw = fs.readFileSync(absolutePath, "utf8");
    return {
      absolutePath,
      relativePath,
      mtimeMs: stat.mtimeMs,
      summary: compressMarkdown(raw, relativePath),
    };
  });

  const parts: string[] = [];
  let remaining = MAX_TOTAL_CHARS;

  for (const file of files) {
    const block = `### ${file.relativePath}\n${file.summary.trim()}\n`;
    if (block.length > remaining) {
      if (remaining > 800) {
        parts.push(`${block.slice(0, remaining)}\n[Architecture context truncated due to size limit.]`);
      }
      break;
    }
    parts.push(block);
    remaining -= block.length;
  }

  const prompt = parts.join("\n").trim();
  return { files, prompt };
}

export default function architectureContextInjector(pi: ExtensionAPI) {
  let enabled = true;
  let cachedCwd = "";
  let cachedFiles: ContextFile[] = [];
  let cachedPrompt = "";

  function refresh(cwd: string) {
    const result = buildContext(cwd);
    cachedCwd = cwd;
    cachedFiles = result.files;
    cachedPrompt = result.prompt;
  }

  function ensureFresh(cwd: string) {
    if (cwd !== cachedCwd || cachedFiles.length === 0) {
      refresh(cwd);
      return;
    }

    const stale = cachedFiles.some((file) => {
      try {
        return fs.statSync(file.absolutePath).mtimeMs !== file.mtimeMs;
      } catch {
        return true;
      }
    });

    if (stale) refresh(cwd);
  }

  pi.on("session_start", async (_event, ctx) => {
    refresh(ctx.cwd);
    ctx.ui.setStatus("arch-context", `arch: ${cachedFiles.length} files`);
  });

  pi.on("before_agent_start", async (event, ctx) => {
    if (!enabled) return;
    ensureFresh(ctx.cwd);
    if (!cachedPrompt) return;

    return {
      systemPrompt: `${event.systemPrompt}\n\n## Project Architecture Context\n\nUse this repository-specific context when making design, implementation, and review decisions. Treat it as guidance, not as a substitute for reading the source files you modify. If this context conflicts with the user's explicit request, ask or explain the trade-off.\n\n${cachedPrompt}`,
    };
  });

  pi.registerCommand("arch-context", {
    description: "Show, reload, enable, or disable injected project architecture context",
    handler: async (args, ctx) => {
      const command = (args ?? "").trim() || "status";

      if (command === "reload") {
        refresh(ctx.cwd);
        ctx.ui.setStatus("arch-context", `arch: ${cachedFiles.length} files`);
        ctx.ui.notify(`Reloaded architecture context from ${cachedFiles.length} file(s).`, "info");
        return;
      }

      if (command === "off" || command === "disable") {
        enabled = false;
        ctx.ui.setStatus("arch-context", "arch: off");
        ctx.ui.notify("Architecture context injection disabled.", "info");
        return;
      }

      if (command === "on" || command === "enable") {
        enabled = true;
        ensureFresh(ctx.cwd);
        ctx.ui.setStatus("arch-context", `arch: ${cachedFiles.length} files`);
        ctx.ui.notify("Architecture context injection enabled.", "info");
        return;
      }

      ensureFresh(ctx.cwd);

      if (command === "files") {
        ctx.ui.setWidget(
          "arch-context",
          ["Architecture context files:", ...cachedFiles.map((file) => `- ${file.relativePath}`)],
        );
        return;
      }

      if (command === "show") {
        ctx.ui.setWidget("arch-context", cachedPrompt.split("\n"));
        return;
      }

      ctx.ui.notify(
        `Architecture context is ${enabled ? "enabled" : "disabled"}; ${cachedFiles.length} file(s), ${cachedPrompt.length} chars. Use /arch-context files|show|reload|on|off.`,
        "info",
      );
    },
  });

  pi.on("session_shutdown", async (_event, ctx) => {
    ctx.ui.setStatus("arch-context", undefined);
    ctx.ui.setWidget("arch-context", undefined);
  });
}
