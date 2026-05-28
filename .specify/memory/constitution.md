<!--
SYNC IMPACT REPORT
==================
Version change: [PLACEHOLDER] → 1.0.0
Added sections:
  - Core Principles (5 principles)
  - Architecture & Stack Constraints
  - Definition of Done
  - Governance
Modified principles: N/A (initial ratification)
Removed sections: N/A
Templates requiring updates:
  ✅ plan-template.md — Constitution Check section references Gym Planner constraints
  ✅ spec-template.md — no structural changes required; existing template fits
  ✅ tasks-template.md — no structural changes required
Deferred TODOs: None
-->

# Gym Planner Constitution

## Core Principles

### I. Static-First Architecture (NON-NEGOTIABLE)

The app has no server-side logic beyond static asset delivery. There is no backend, no
database, and no user data storage. Every page is pre-rendered at build time.

- MUST NOT introduce a backend server, database, or server-rendered API routes
- MUST NOT store user data — no cookies, no localStorage for user state, no analytics PII
- All routine data MUST live in TypeScript data files under `src/data/` — not fetched from
  a CMS, database, or owned API
- External services (ExerciseDB) are acceptable ONLY for read-only media fetching at runtime
- MUST deploy as a static site to Vercel (zero server functions for MVP)

**Rationale**: The product's core value is instant availability with zero friction. A backend
adds deployment complexity, cost, and failure modes that undermine the MVP goal.

### II. Mobile-First UI (NON-NEGOTIABLE)

The primary usage context is a gym floor — one hand, portrait orientation, variable lighting.
Every UI decision must pass the gym-floor test first.

- MUST design and test at 375px viewport width before any wider breakpoint
- MUST ensure all interactive elements have a minimum 44×44px tap target
- MUST use a minimum 16px body font size — no zooming required to read content
- MUST NOT rely on hover states for primary interactions (no hover-only affordances)
- GIFs and muscle diagrams MUST render usably at mobile widths without horizontal scroll
- High contrast is preferred — assume variable lighting conditions

**Rationale**: The app is a gym-floor reference tool. A desktop-first approach produces a
product that fails at its primary use case.

### III. Content Integrity

Routine content is manually authored and curated for intermediate-to-advanced users. It is
the primary differentiator of the product and must not be diluted.

- MUST hardcode all routine structures (goals, days, exercises) in `src/data/routines/`
  as TypeScript files — no dynamic generation, no AI-written copy
- Form cues, common mistakes, and rationale text MUST target intermediate-to-advanced
  level — not beginner basics ("keep your back straight")
- Each exercise's "why" copy MUST be goal-specific — the same exercise appearing in two
  different goal routines MUST have different rationale text
- MUST NOT commit placeholder or lorem ipsum content
- Adding or modifying exercise content requires manual review — treat as product copy

**Rationale**: The entire value proposition rests on the quality and specificity of the
content. Generic or auto-generated copy breaks user trust with the target audience.

### IV. External Media Isolation

ExerciseDB (and any future media provider) is a runtime enhancement, not a dependency.
The app MUST function as a complete product without it.

- Exercise cards MUST render all text content (form cues, mistakes, rationale, muscle names)
  without any external API call
- GIFs and muscle diagram data MAY be fetched from ExerciseDB at runtime, but MUST have
  a visible fallback if the fetch fails or times out
- MUST NOT use ExerciseDB data to determine routine structure, exercise selection, or
  any content-layer decision
- ExerciseDB integration MUST be isolated behind `src/services/exercisedb.ts` — no other
  file imports from ExerciseDB directly
- MUST NOT commit API keys or credentials to the repository

**Rationale**: ExerciseDB is a free third-party service with rate limits and no SLA.
Coupling the core UX to it creates an unreliable product. It is a media layer only.

### V. Minimal, Reviewable Changes (NON-NEGOTIABLE)

Each change MUST be the smallest correct implementation of the requirement. No scope creep.

- MUST NOT refactor surrounding code while implementing a feature unless the feature requires it
- MUST NOT add speculative error handling, fallbacks, or validation for impossible states
- MUST NOT add comments explaining WHAT the code does — only WHY when non-obvious
- MUST NOT add features for hypothetical future requirements (YAGNI)
- Three similar lines is better than a premature abstraction
- MUST NOT install new dependencies without explicit user approval — propose first, wait
  for approval, then install

**Rationale**: This is a focused MVP built task-by-task. Over-engineering compounds across
sessions and makes future changes harder to reason about.

## Architecture & Stack Constraints

### Locked Stack

The following are locked and MUST NOT be changed without explicit user instruction:

| Concern      | Tool              | Notes                                        |
|--------------|-------------------|----------------------------------------------|
| Framework    | Astro             | Static output mode, islands for interactivity |
| Styling      | Tailwind CSS v4   | Config via CSS `@theme`, no tailwind.config.ts |
| Language     | TypeScript        | strict mode enabled                          |
| Package Mgr  | npm               | default from Astro scaffold                  |
| Deployment   | Vercel            | static adapter, zero server functions        |
| Media API    | ExerciseDB (free) | runtime only, isolated, replaceable          |

### File & Folder Conventions

```
src/
  data/
    routines/           ← hardcoded TypeScript data files, one per goal
  pages/
    index.astro         ← homepage (goal selector)
    routine/[goal].astro
    exercise/[id].astro
  components/
    GoalCard.astro
    RoutineDay.astro
    ExerciseCard.astro
    MuscleDiagram.astro
  services/
    exercisedb.ts       ← ExerciseDB integration lives here only
  styles/
    global.css          ← Tailwind tokens and global styles
```

- Tailwind tokens MUST be defined in `src/styles/global.css` under `@theme`
- Component filenames MUST be PascalCase `.astro` files
- Routine data files MUST export typed TypeScript objects — no JSON files for content data

### Astro-Specific Rules

- MUST use Astro static output mode (`output: 'static'`) — no SSR adapter
- Client-side interactivity (ExerciseDB fetching, GIF loading state) MUST use Astro islands
  with `client:load` or `client:visible`
- MUST NOT use `client:load` for content that can be static — default to no client directive
- Page routing is file-based — MUST follow `src/pages/` conventions

## Definition of Done

A task is complete when ALL of the following are true:

1. `npm run build` passes with zero TypeScript errors
2. Changed UI is visually verified at 375px viewport width
3. If ExerciseDB integration is touched: fallback state is manually verified
4. No new dependency added without prior user approval
5. No `TODO` or placeholder content committed
6. Diff is minimal — no incidental refactors, cleanups, or unrelated changes

## Governance

- This constitution supersedes all other practices for the Gym Planner project
- It is read by AI agents at the start of every planning and implementation session
- Amendments require: identifying the violated or missing principle, proposing the updated
  rule, bumping the version per semantic versioning, and running `npm run build` after
  any code changes
- All `specs/###-feature/plan.md` Constitution Check sections MUST reference this document
- When a rule here conflicts with a CLAUDE.md instruction, the more specific rule wins;
  flag the conflict if ambiguous

**Version**: 1.0.0 | **Ratified**: 2026-05-26 | **Last Amended**: 2026-05-26
