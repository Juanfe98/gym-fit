# Implementation Plan: Exercise Library

**Branch**: `007-exercise-library` | **Date**: 2026-05-28 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/007-exercise-library/spec.md`

---

## Summary

Build a full-screen Exercise Library accessible from a new bottom nav tab. Users can browse, search, and filter 1500 static exercises, view detail pages with GIFs, muscle diagrams, and coaching content (catalog exercises only), favorite exercises with optimistic Supabase persistence, and add exercises to an active workout session. One new Supabase table (`user_exercise_favorites`). No new npm dependencies.

---

## Technical Context

**Language/Version**: TypeScript 5, Next.js 15 App Router
**Primary Dependencies**: `@supabase/ssr`, `@tanstack/react-query ^5`, `zustand`, `lucide-react`, Tailwind CSS v4
**Storage**: Supabase Postgres — 1 new table `user_exercise_favorites` (RLS); static `exercises.json` (1500 entries, in-memory)
**Testing**: Manual 375px viewport check + `npm run build` per constitution DoD
**Target Platform**: Mobile-first web, 375px primary
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: List first render <1s (static local data, no network); real-time search on keystroke
**Constraints**: No new npm dependencies; no custom backend; ExerciseDB GIF is runtime-optional with fallback
**Scale/Scope**: 1500 static exercises; 1 new Supabase table; ~5 new components; 2 new routes; 1 new nav tab

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I — User-First Architecture | ✅ PASS | Favorites use Supabase with RLS; no custom server |
| II — Mobile-First UI | ✅ PASS | 44px tap targets; 375px-first; bottom nav tab |
| III — Exercise Content Integrity | ✅ PASS | Static catalog untouched; coaching content read-only from existing routine data |
| IV — External Media Isolation | ✅ PASS | ExerciseDB GIF behind `GifPlayer` fallback; no content decisions from ExerciseDB |
| V — Minimal, Reviewable Changes | ✅ PASS | No new deps; `use-exercise-search` move is 1-file relocation + 1-line import update |
| VI — Offline-First Session Tracking | ✅ N/A | Exercise library doesn't touch IndexedDB session state; "Add to session" calls existing store action |

**Post-Design Re-check**: No violations introduced. `user_exercise_favorites` table has full RLS. SVG-to-React conversion is a one-time build-step artifact, not a runtime dependency.

---

## Project Structure

### Documentation (this feature)

```text
specs/007-exercise-library/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── exercises-module.md  ← Phase 1 output
└── tasks.md             ← /speckit-tasks output (not yet created)
```

### Source Code

```text
src/
  app/
    (app)/
      exercises/
        page.tsx                     ← NEW: list screen (Server Component wrapper)
        [id]/
          page.tsx                   ← NEW: detail screen (Server Component wrapper)
  assets/
    muscle-diagrams/
      FrontBodySvg.tsx               ← NEW: front.svg converted to inline React component
      BackBodySvg.tsx                ← NEW: back.svg converted to inline React component
  modules/
    exercises/
      components/
        ExerciseListItem.tsx         ← NEW
        ExerciseFilters.tsx          ← NEW (search + body part + equipment + favorites toggle)
        MuscleDiagram.tsx            ← NEW (React port; uses FrontBodySvg + BackBodySvg + muscle-map.ts)
        GifPlayer.tsx                ← NEW (skeleton while loading; fallback on error)
        CoachingContent.tsx          ← NEW (form cues, mistakes, rationale — rendered only when data exists)
        FavoriteButton.tsx           ← NEW (optimistic heart toggle)
        AddToSessionButton.tsx       ← NEW (hidden when no active session; shows toast on tap)
      hooks/
        use-exercise-search.ts       ← MOVE from src/modules/workout-session/hooks/
        use-favorites.ts             ← NEW (TanStack Query + optimistic mutations)
      services/
        favorites.ts                 ← NEW (Supabase CRUD for user_exercise_favorites)
      utils/
        catalog-coaching.ts          ← NEW (exerciseDbId → CoachingData | null)
      types/
        index.ts                     ← NEW
      index.ts                       ← NEW barrel
    workout-session/
      components/
        ExercisePicker.tsx           ← MODIFY: update import path for use-exercise-search
    home/
      components/
        BottomNav.tsx                ← MODIFY: add Exercises tab (5th tab)
  i18n/
    ui.ts                            ← MODIFY: add 24 new i18n keys (en + es)
supabase/
  migrations/
    003_user_exercise_favorites.sql  ← NEW
```

**Structure Decision**: Single Next.js project. Exercises module follows the same layout as `workout-session` and `workout-history`. Pages are thin Server Component wrappers; logic lives in `src/modules/exercises/`.

---

## Complexity Tracking

No constitution violations — no complexity justification required.
