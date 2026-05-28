# Implementation Plan: Goal-Based Routine Generator

**Branch**: `master` | **Date**: 2026-05-26 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-goal-routine-generator/spec.md`

---

## Summary

Static Astro web app delivering four preset goal-based weekly workout routines. Each
routine page lists training days with 5 exercises each. Tapping an exercise opens a card
showing an animated GIF (from ExerciseDB CDN), a muscle diagram (custom inline SVG,
server-side highlighted), form cues, common mistakes, and goal-specific rationale. All
routine and exercise content is manually authored. ExerciseDB data is fetched once at
build time and cached locally — zero runtime API calls.

---

## Technical Context

**Language/Version**: TypeScript (strict mode)
**Primary Dependencies**: Astro 4.x, Tailwind CSS v4, @astrojs/vercel (static adapter), tsx (build script runner — requires user approval per Constitution V before install)
**Storage**: N/A — all data is static files bundled at build time; no DB, no server
**Testing**: None for MVP — DoD is `npm run build` pass + visual verification at 375px
**Target Platform**: Web (static, Vercel CDN), mobile-first (375px+ viewport)
**Project Type**: Static web application (Astro SSG)
**Performance Goals**: Goal → routine page in <10s from homepage; exercise card text always immediately visible; GIF loads progressively via `<img>` with fallback
**Constraints**: 375px+ viewport, 44×44px tap targets, 16px min body font, 500 req/month ExerciseDB free tier (→ build-time fetch only), no backend, no PII
**Scale/Scope**: 4 goals × ~5 days × 5 exercises = ~100 exercise refs; ~900 cached ExerciseDB records

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*
*Reference: `.specify/memory/constitution.md` v1.0.0*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-First | PASS | No backend, no DB, no server functions. ExerciseDB fetched at build time only. All data in `src/data/`. Deploys as Vercel static site. |
| II. Mobile-First | PASS | 375px design-first. 44×44px tap targets required on GoalCard and exercise links. 16px min body font enforced via Tailwind token. No hover-only affordances. |
| III. Content Integrity | PASS | All routine data hardcoded in `src/data/routines/` as TypeScript. Goal-specific rationale required per ExerciseRef. No AI-generated or placeholder content. |
| IV. External Media Isolation | PASS | ExerciseDB isolated in `src/services/exercisedb.ts`. `gifUrl` used as static `<img src>` at runtime. Graceful fallback required. Muscle data (target/secondaryMuscles) sourced from build-time cache — no runtime API call. |
| V. Minimal Changes | PASS | No React, no new testing framework, no premature abstractions. Muscle diagram via custom SVG + server-side class injection — zero new npm deps. |

**No violations. No Complexity Tracking table required.**

---

## Project Structure

### Documentation (this feature)

```
specs/001-goal-routine-generator/
├── plan.md              ← This file
├── research.md          ← Phase 0: ExerciseDB, SVG diagram, testing, scaffold
├── data-model.md        ← Phase 1: entities, relationships, file layout
├── quickstart.md        ← Phase 1: setup, build, deploy
├── contracts/
│   ├── ui-routes.md     ← Phase 1: page routing contract
│   └── component-props.md  ← Phase 1: component TypeScript interfaces
└── tasks.md             ← Phase 2 output (/speckit-tasks — not yet created)
```

### Source Code (repository root)

```
gym-planner/
├── src/
│   ├── types.ts                     ← Shared TypeScript interfaces (Goal, Routine, Exercise, etc.)
│   ├── data/
│   │   ├── routines/
│   │   │   ├── muscle-gain.ts       ← Routine (manually authored)
│   │   │   ├── strength.ts
│   │   │   ├── fat-loss.ts
│   │   │   ├── conditioning.ts
│   │   │   └── index.ts             ← ROUTINES: Record<Goal, Routine>
│   │   └── exercises/
│   │       └── exercises.json       ← Exercise[] cache (build-time fetch, committed)
│   ├── pages/
│   │   ├── index.astro              ← Homepage: goal selector
│   │   ├── routine/
│   │   │   └── [goal].astro         ← Routine page (static paths from ROUTINES keys)
│   │   └── exercise/
│   │       └── [id].astro           ← Exercise card (static paths from all exerciseDbIds)
│   ├── components/
│   │   ├── GoalCard.astro
│   │   ├── RoutineDay.astro
│   │   ├── ExerciseCard.astro
│   │   └── MuscleDiagram.astro
│   ├── services/
│   │   ├── exercisedb.ts            ← ExerciseDB fetch logic (build-time only)
│   │   └── muscle-map.ts            ← ExerciseDB muscle string → SVG element ID mapping
│   ├── assets/
│   │   └── muscle-diagrams/
│   │       ├── front.svg            ← Body diagram front view (MIT-licensed)
│   │       └── back.svg             ← Body diagram back view (MIT-licensed)
│   └── styles/
│       └── global.css               ← Tailwind @theme tokens + muscle highlight classes
├── scripts/
│   └── fetch-exercises.ts           ← Fetches ExerciseDB, writes exercises.json
├── public/                          ← Static assets (favicon, etc.)
├── .env.example                     ← Documents EXERCISEDB_API_KEY
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

**Structure Decision**: Single web application. Astro file-based routing. No monorepo,
no separate backend directory. Data lives in `src/data/` as TypeScript/JSON. Build-time
scripts in `scripts/`. Static assets in `src/assets/`.

**Exercise page scope**: `/exercise/[id].astro` generates static pages only for the
`exerciseDbId` values referenced across all 4 routines (~100 IDs). It does NOT generate
pages for all ~900 entries in `exercises.json`.

**SVG sourcing**: `front.svg` and `back.svg` are downloaded manually from the
`body-highlighter` MIT-licensed GitHub repository (as static files, not as an npm
package). License must be verified before committing. `muscle-map.ts` cannot be authored
until these files are in place and their element IDs are inspected — tasks must sequence
SVG sourcing before the mapping step.

---

## Complexity Tracking

> No constitution violations — table not required.
