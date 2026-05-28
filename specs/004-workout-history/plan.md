# Implementation Plan: Workout History

**Branch**: `004-workout-history` | **Date**: 2026-05-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-workout-history/spec.md`

## Summary

Read-only workout history module: paginated/filterable/searchable list of completed sessions
plus a full-detail view per session. Reads from Supabase tables defined in module 003.
Requires migration 002 to add `total_volume` and `pr_count` columns to `workout_sessions`,
plus updates to `SyncSessionPayload` and `finishedSessionToPayload` in the existing
workout-session module to write those values. Post-workout summary screen already exists at
`/workout/summary` and is not touched. This module adds `/history` and
`/history/[sessionId]` routes and the `workout-history` module.

## Technical Context

**Language/Version**: TypeScript (strict mode)
**Primary Dependencies**: Next.js 15+ App Router, TanStack Query v5 (`useInfiniteQuery`
for list, `useQuery` for detail), Zustand (filter state), Tailwind CSS v4, Supabase JS
**Storage**: Supabase Postgres. No new tables. Migration 002 adds `total_volume` and
`pr_count` to `workout_sessions`. No new IndexedDB tables.
**Testing**: `npm run build` (TypeScript) + visual verification at 375px
**Target Platform**: Web, mobile-first (375px primary breakpoint)
**Project Type**: Full-stack web app (Next.js App Router — SSR + Client Components)
**Performance Goals**: History list renders < 1s for 200 sessions; exercise search results
< 300ms after debounce; post-workout summary < 1s after "Finish Workout"
**Constraints**: Offline read via TanStack Query stale cache; no separate offline UI;
no edit/delete of past sessions (detail is read-only)
**Scale/Scope**: Up to ~200 completed sessions per user for MVP; page size = 20 sessions

**Server/Client component boundary**:

| Route / Component | Type | Reason |
|---|---|---|
| `history/page.tsx` | Server Component | Initial fetch server-side via `createClient()` from `lib/supabase/server.ts`; passes data as props |
| `history/[sessionId]/page.tsx` | Server Component | Single session fetch server-side; passes data as props |
| `WorkoutHistoryList.tsx` | `"use client"` | `useInfiniteQuery` + Zustand filter reactivity require client state |
| `WorkoutHistoryCard.tsx` | shared display (no directive) | Pure display; no hooks; imported by Client Component → bundled client-side |
| `WorkoutHistoryDetail.tsx` | shared display (no directive) | Pure display; receives `WorkoutHistoryDetail` as prop from server page; history data is immutable, no refetch needed |
| `HistoryFilters.tsx` | `"use client"` | Controlled inputs + Zustand filter store |
| `ExerciseSetGroup.tsx` | shared display (no directive) | Pure display; imported by `WorkoutHistoryDetail` |
| `HistoryEmptyState.tsx` | shared display (no directive) | Pure display; imported by `WorkoutHistoryList` |

Server pages fetch data and pass it as props to components. `WorkoutHistoryList` receives
`initialData` for the first page so there is no loading flash on first render. Components
with no directive have no server-only APIs and work correctly when bundled client-side.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. User-First Architecture | ✅ PASS | Next.js App Router, Supabase reads via Server Actions/RSC, RLS policies already cover SELECT |
| II. Mobile-First UI | ✅ PASS | All new screens must be designed at 375px first; 44px tap targets enforced |
| III. Exercise Content Integrity | ✅ N/A | No exercise catalog changes |
| IV. External Media Isolation | ✅ N/A | No ExerciseDB usage in history module |
| V. Minimal, Reviewable Changes | ✅ PASS | Read-only module; reuses existing data layer and `PrBadge` component; no new deps |
| VI. Offline-First Session Tracking | ✅ PASS | History reads from TQ stale cache when offline; active session path unchanged |

**Post-design re-check**: All gates pass. No violations. No complexity justification needed.

## Project Structure

### Documentation (this feature)

```text
specs/004-workout-history/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/
│   ├── supabase-queries.ts      # Phase 1 output
│   └── tanstack-query-keys.ts   # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── (app)/
│       ├── layout.tsx                      # existing — add History to nav
│       └── history/
│           ├── page.tsx                    # NEW — history list screen
│           └── [sessionId]/
│               └── page.tsx                # NEW — history detail screen
└── modules/
    ├── workout-session/                    # existing — PrBadge reused in ExerciseSetGroup
    │   └── components/PrBadge.tsx
    └── workout-history/                    # NEW module
        ├── components/
        │   ├── WorkoutHistoryList.tsx       # infinite-scroll list
        │   ├── WorkoutHistoryCard.tsx       # session card (name, date, stats)
        │   ├── WorkoutHistoryDetail.tsx     # full session detail (read-only; NOT derived from SessionSummary)
        │   ├── ExerciseSetGroup.tsx         # exercise + sets; reuses PrBadge; warmup sets visually distinct
        │   ├── HistoryFilters.tsx           # date range + search bar
        │   └── HistoryEmptyState.tsx        # empty state (no sessions / filtered)
        ├── hooks/
        │   ├── use-history-list.ts          # useInfiniteQuery for paginated list
        │   ├── use-history-detail.ts        # useQuery for single session
        │   ├── use-exercise-name-search.ts  # debounced exercise search
        │   └── query-keys.ts               # historyKeys factory
        ├── services/
        │   └── history-supabase.ts          # fetchHistoryList, fetchHistoryDetail, searchSessionsByExercise (SupabaseClient injected via param — works with both server and browser client)
        ├── stores/
        │   └── history-filter-store.ts      # Zustand: dateRange + exerciseSearch
        ├── types/
        │   └── index.ts                     # WorkoutHistorySummary, WorkoutHistoryDetail, etc.
        ├── utils/
        │   └── format-session-name.ts       # derives display name from session data
        └── index.ts                         # public exports
```

**Structure Decision**: Single Next.js project, new `workout-history` feature module
co-located under `src/modules/` following identical layout to `workout-session`.
New routes under `src/app/(app)/history/`. Migration 002 adds two columns. No new npm
dependencies required. Also updates `workout-session` module's `SyncSessionPayload` and
`finishedSessionToPayload` to write `total_volume` + `pr_count`.

**Task sequencing constraint**: Migration 002 + `SyncSessionPayload`/`finishedSessionToPayload`
updates MUST be implemented as the first task. History UI tasks that read `total_volume` and
`pr_count` depend on these columns existing and being written.

**Nav scope**: `(app)/layout.tsx` currently has an empty `<nav>` shell. Building History nav
means building the full bottom tab nav: minimum Workout tab (`/workout`) + History tab
(`/history`). Use Lucide icons (already installed). Active tab via `usePathname()` from
`next/navigation`. Nav component requires `"use client"` for `usePathname`.
