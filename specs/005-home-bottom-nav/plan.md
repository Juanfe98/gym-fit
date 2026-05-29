# Implementation Plan: Home Screen + Bottom Navigation (App Shell)

**Branch**: `005-home-bottom-nav` | **Date**: 2026-05-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/005-home-bottom-nav/spec.md`

## Summary

Build the authenticated app shell: a 4-tab bottom navigation bar (Home, Workout, History, Profile) and a Home dashboard screen showing the user's greeting, most recent workout summary, and a "Start Workout" CTA. Includes app-wide auth gate enforcement, user identity display, sign-out action, and a Profile stub screen. The existing `(app)/layout.tsx` is refactored from a Client Component into a Server Component, with a new `AppShell` Client Component wrapping the QueryClientProvider and BottomNav.

---

## Technical Context

**Language/Version**: TypeScript 5.8, React 19, Next.js 15+ (App Router)
**Primary Dependencies**: Tailwind CSS v4 (CSS `@theme`), `@supabase/ssr` + `@supabase/supabase-js`, `@tanstack/react-query` v5, `zustand` v5, `lucide-react`, `next/navigation`
**Storage**: Supabase (Postgres) — read-only for this feature; no new tables
**Testing**: No dedicated test runner configured; validation via `npm run build` + manual 375px visual check
**Target Platform**: Web (mobile-first, 375px primary breakpoint)
**Project Type**: Web application (Next.js App Router, full-stack)
**Performance Goals**: Home screen renders (skeleton resolves) in under 2 seconds on standard mobile connection
**Constraints**: No `'use client'` on layout files; 44×44px min tap targets; 375px no-overflow; auth gate on all `(app)` routes
**Scale/Scope**: Single authenticated user per session; MVP — 4 nav tabs

---

## Constitution Check

*GATE: Must pass before implementation. Re-checked after design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. User-First Architecture | ✅ PASS | No custom server. Session read via `createServerClient`. Sign-out via Supabase client. |
| II. Mobile-First UI | ✅ PASS | 375px primary. 44×44px tap targets spec'd. High-contrast tokens used. Bottom nav pattern. Color-independent active state (icon weight + label weight). |
| III. Content Integrity | ✅ PASS | No exercise library content touched. |
| IV. External Media Isolation | ✅ PASS | No ExerciseDB calls. |
| V. Minimal, Reviewable Changes | ⚠️ NOTE | Layout refactor (`'use client'` → Server Component) is required by this feature to correctly read session server-side and satisfy the constitution rule. This is not scope creep — it IS the feature. No other surrounding refactors. |
| VI. Offline-First Session Tracking | ✅ PASS | No active workout session state touched. Home screen is read-only. |

**Gate violations**: None. Layout refactor is constitution-mandated and feature-scoped.

**Post-design re-check**: ✅ All constraints satisfied. Data model introduces no new tables. `AppShell` Client Component is the minimum necessary `'use client'` boundary.

---

## Project Structure

### Documentation (this feature)

```text
specs/005-home-bottom-nav/
├── plan.md                             # This file
├── research.md                         # Phase 0 — 7 decisions documented
├── data-model.md                       # Phase 1 — consumed data contracts
├── quickstart.md                       # Phase 1 — developer guide
├── contracts/
│   └── app-shell.md                    # Phase 1 — component + module contracts
├── future-scope-home-plan-widget.md    # Deferred: active plan widget
└── tasks.md                            # Phase 2 — /speckit-tasks output
```

### Source Code (repository root)

```text
src/
  app/
    (app)/
      layout.tsx          ← REFACTOR: Server Component — reads session, renders AppShell
      page.tsx            ← NEW: Home screen (replaces root src/app/page.tsx)
      workout/            ← UNCHANGED
      history/            ← UNCHANGED
      profile/
        page.tsx          ← NEW: Profile stub screen
    (auth)/               ← UNCHANGED
    layout.tsx            ← UNCHANGED (root layout, font loading)
    page.tsx              ← DELETE: replaced by (app)/page.tsx

  modules/
    home/
      components/
        AppShell.tsx              ← NEW: Client — QueryClientProvider + layout wrapper
        BottomNav.tsx             ← NEW: Client — 4-tab nav, active state, ARIA
        HomeHeader.tsx            ← NEW: Client — greeting, sign-out action
        RecentWorkoutSection.tsx  ← NEW: Client — TQ states (loading/error/empty/data)
        RecentWorkoutCard.tsx     ← NEW: display-only card component
        RecentWorkoutSkeleton.tsx ← NEW: skeleton loader for card
        StartWorkoutCTA.tsx       ← NEW: "Start Workout" link button to /workout
      hooks/
        use-recent-workout.ts     ← NEW: TanStack Query hook
      types/
        index.ts                  ← NEW: ShellUser type
      index.ts                    ← NEW: barrel export
```

---

## UI/UX Design Note

**ADR**: All tasks involving UI component design or implementation MUST invoke the `/ui-ux-pro-max` skill for visual design decisions (layout, spacing, color application, component structure). This applies to: `BottomNav`, `HomeHeader`, `RecentWorkoutCard`, `RecentWorkoutSkeleton`, `StartWorkoutCTA`, `AppShell` layout structure.

---

## Complexity Tracking

No constitution violations requiring justification. The layout refactor from `'use client'` to Server Component is constitution-mandated (Principle V), not a complexity addition.

---

## Phase 0: Research ✅

See [research.md](./research.md) — 7 decisions resolved:

1. Home route → `/` via `(app)/page.tsx`; delete `src/app/page.tsx`
2. `(app)/layout.tsx` → Server Component; split `AppShell` + `BottomNav` as Client Components
3. Auth gate → middleware primary, layout secondary server-side check
4. Sign-out → client-side `supabase.auth.signOut()` + `router.push('/login')`
5. Recent workout data → dedicated `useRecentWorkout` hook using existing history service
6. User display name → `user.user_metadata?.full_name ?? email prefix ?? 'User'`
7. Profile stub → single `src/app/(app)/profile/page.tsx`, no module directory

---

## Phase 1: Design & Contracts ✅

### Data Model
See [data-model.md](./data-model.md):
- No new Supabase tables
- Consumed entities: `ShellUser` (from auth), `HistorySession` (from workout-history module)

### Interface Contracts
See [contracts/app-shell.md](./contracts/app-shell.md):
- `(app)/layout.tsx` Server Component contract
- `AppShell` Client Component props
- `BottomNav` tab definitions, active state logic, ARIA spec
- `HomeScreen` composition
- `HomeHeader` with sign-out
- `RecentWorkoutSection` state machine (loading / error / empty / data)
- `home` module barrel exports
- `useRecentWorkout` hook — correct signature with `supabase` client via `createClient()` + `WorkoutHistorySummary` return type
- **i18n keys** — 9 new keys for `src/i18n/ui.ts` (both `en` + `es`); 4 existing keys reused

### Developer Quickstart
See [quickstart.md](./quickstart.md):
- How to add a tab
- How to add a home section
- Auth gate verification steps
- Full file map
