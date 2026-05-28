# Research: Goal-Based Routine Generator

**Phase**: 0 — Pre-planning research
**Date**: 2026-05-26
**Spec**: [spec.md](spec.md)

---

## R1: ExerciseDB API Integration

### Decision

Fetch ExerciseDB data at **build time**, not at runtime. Store as a local JSON cache in
`src/data/exercises/exercises.json`. Use `gifUrl` values directly as `<img src>` at
runtime — the CDN does not require authentication.

### Rationale

The free tier allows **500 requests/month** total. Runtime lookups on page load would
exhaust this limit in one day of moderate traffic. A single build-time fetch of the full
dataset (`GET /exercises?limit=1340`) costs 1 request per deploy and eliminates all
runtime rate-limit exposure. The API key stays server-side (Vercel build env var) and is
never shipped to the browser.

### Alternatives Considered

- **Runtime fetch per exercise card**: Rejected — 500 req/month makes this infeasible.
- **Vercel KV cache + runtime proxy**: Rejected — introduces a backend dependency,
  violates Constitution Principle I (Static-First).
- **Client-side fetch with exposed key**: Rejected — security risk and rate-limit risk.

### Implementation Notes

- Endpoint: `GET https://exercisedb.p.rapidapi.com/exercises?limit=1340&offset=0`
- Required headers: `X-RapidAPI-Key`, `X-RapidAPI-Host: exercisedb.p.rapidapi.com`
- Response shape per exercise:
  ```json
  {
    "id": "0001",
    "name": "barbell bench press",
    "gifUrl": "https://v2.exercisedb.io/image/{hash}",
    "bodyPart": "chest",
    "target": "pectorals",
    "secondaryMuscles": ["triceps", "delts"],
    "equipment": "barbell",
    "instructions": ["..."]
  }
  ```
- Build script: `scripts/fetch-exercises.ts` → writes `src/data/exercises/exercises.json`
- Script is **idempotent**: skips fetch if `exercises.json` already exists and is non-empty.
  Run manually only when adding new `exerciseDbId` values to routines. Do NOT hook as npm
  `prebuild` — it would burn quota on every build with no new data.
- `exercises.json` is committed to the repo; CI/CD builds do not need to re-fetch.
- `gifUrl` points to `https://v2.exercisedb.io/image/{hash}` — served without auth,
  safe to use as `<img src>` at runtime
- Match exercises to routine entries by `exerciseDbId` stored in routine data files

### Key Constraint

The ExerciseDB `instructions` field is **not used** — form cues, common mistakes, and
rationale are manually authored per spec (Constitution Principle III).

---

## R2: SVG Muscle Diagram

### Decision

**Custom inline SVG with server-side class injection.** No new npm dependencies. Source
front/back body SVG assets from the MIT-licensed `body-highlighter` GitHub repository as
static files (not as an npm package). Inject Tailwind highlight classes server-side in the
Astro component template.

### Rationale

The exercise card is a read-only display — no interactivity required for the diagram.
Server-side class injection means the diagram renders immediately with highlights, with zero
client-side JS, zero hydration, and zero bundle cost. This satisfies Constitution Principles
I (static-first) and II (mobile-first: instant render on slow gym WiFi).

Requires a ~20-line TypeScript mapping from ExerciseDB muscle name strings (e.g.,
`"pectorals"`, `"lats"`) to SVG element IDs — low effort, fully typesafe.

### Alternatives Considered

- **`react-body-highlighter`**: Rejected — requires React + ReactDOM (~40–50 KB gzipped),
  an Astro island, and client-side hydration. No interactivity benefit justifies this
  overhead. Also requires user approval for 3 new packages.
- **`body-highlighter` vanilla**: Rejected — still mounts the SVG via client-side JS,
  slower first render than SSR approach. Requires approval for 1 new package.
- **Vanilla JS + custom SVG**: Rejected — Option 1 (server-side) is strictly superior:
  same SVG sourcing, same zero-dep result, renders without any client JS.

### Implementation Notes

- SVG source: extract `front.svg` and `back.svg` from `body-highlighter` MIT-licensed
  repo — place in `src/assets/muscle-diagrams/`
- Muscle ID mapping: `src/services/muscle-map.ts` maps ExerciseDB string → SVG element ID
- `MuscleDiagram.astro` receives `primary: string[]` and `secondary: string[]` props,
  inlines both SVGs with CSS classes applied to matched `<path>` elements
- CSS classes: `muscle-primary` (`fill-red-500`) and `muscle-secondary` (`fill-orange-300`)
- Non-matched muscles render with default neutral fill
- No Astro island, no `client:*` directive needed for the diagram itself

---

## R3: Testing Strategy

### Decision

**Defer automated testing for MVP.** The constitution's Definition of Done specifies
`npm run build` passes with zero TS errors + visual verification at 375px. No testing
framework is prescribed.

### Rationale

Adding Vitest or Playwright without constitution precedent violates Principle V (no new
deps without approval, no premature abstractions). The DoD is build-pass + manual visual
check. Test infrastructure can be added as a separate spec if needed.

### Alternatives Considered

- **Vitest for unit tests**: Worth adding for muscle-name mapping and routine data
  validation — flag as a future enhancement, requires user approval first.
- **Playwright for E2E**: Out of scope for MVP.

---

## R4: Astro Scaffold

### Decision

Scaffold with `npm create astro@latest` using the minimal template. Add
`@astrojs/vercel` static adapter and configure Tailwind CSS v4 via PostCSS.
Output mode: `static`.

### Rationale

Constitution locks: Astro, Tailwind CSS v4, TypeScript strict, npm, Vercel static adapter.

### Implementation Notes

- Tailwind CSS v4: uses `@import "tailwindcss"` in CSS, configure tokens via `@theme`
  in `src/styles/global.css` — no `tailwind.config.ts`
- `astro.config.mjs`: `output: 'static'`, uses `@astrojs/vercel` adapter
- `tsconfig.json`: strict mode enabled (Astro scaffold default)
- `.env.example` documents `EXERCISEDB_API_KEY` — actual key in `.env` (gitignored)
- Build sequence: `fetch-exercises.ts` runs before `astro build` (npm `prebuild` hook)
