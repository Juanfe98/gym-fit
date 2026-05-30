# Implementation Plan: Onboarding Goal Selection

**Branch**: `010-onboarding-goal-selection` | **Date**: 2026-05-29 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/010-onboarding-goal-selection/spec.md`

## Summary

Build the first onboarding data-entry step at `/onboarding/goal`. The page displays Step 1 of 8, asks the user for one primary fitness goal, renders seven accessible selectable cards, disables Continue until a goal is selected, saves the selected `mainGoal` into onboarding state, and routes to `/onboarding/experience`. Implementation uses the existing Next.js App Router, Tailwind token system, Supabase auth metadata for lightweight onboarding state, and no new dependencies.

## Technical Context

**Language/Version**: TypeScript 5.8, Next.js 15 App Router, React 19  
**Primary Dependencies**: `@supabase/ssr`, `@supabase/supabase-js`, Tailwind CSS v4, `lucide-react`  
**Storage**: Supabase Auth user metadata for `mainGoal` / onboarding goal step state; no new database tables  
**Testing**: Manual responsive verification at 320px, 375px, tablet, and desktop widths + keyboard/screen-reader state checks + `npm run build`  
**Target Platform**: Mobile-first responsive web deployed through Next.js/Vercel  
**Project Type**: Web application  
**Performance Goals**: Initial page render should be immediate for a mostly presentational step; save action should show pending feedback and prevent duplicate submissions  
**Constraints**: No new npm dependencies; use existing design tokens; 44px minimum tap targets; no hover-only primary affordances; no custom backend; no Supabase schema migration  
**Scale/Scope**: 1 primary route page, a minimal `/onboarding/experience` placeholder route if absent, onboarding components for shell/progress/grid/card/actions, typed goal constants, one auth metadata update flow

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I — User-First Architecture | ✅ PASS | Uses Next.js App Router and Supabase auth metadata; no custom backend or API layer added |
| II — Mobile-First UI | ✅ PASS | Mobile-first card stack/grid planned; 320px/375px checks; controls use >=44px tap targets |
| III — Exercise Content Integrity | ✅ N/A | Does not modify the exercise catalog |
| IV — External Media Isolation | ✅ N/A | No external media provider usage |
| V — Minimal, Reviewable Changes | ✅ PASS | Adds only the requested route/components/types, a small metadata update flow, and a minimal next-step placeholder only if needed; no dependencies |
| VI — Offline-First Session Tracking | ✅ N/A | Does not touch active workout session tracking |

**Post-Design Re-check**: PASS. Design artifacts preserve the same scope: no new tables, no custom backend, no new dependencies, mobile-first responsive UI, no active-session/offline changes, and only a minimal `/onboarding/experience` placeholder if the route is still absent.

## Project Structure

### Documentation (this feature)

```text
specs/010-onboarding-goal-selection/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── onboarding-goal-ui.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - not created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
  app/
    (app)/
      onboarding/
        goal/
          page.tsx                       # NEW: authenticated app-route page for /onboarding/goal
        experience/
          page.tsx                       # NEW IF ABSENT: minimal authenticated app-route placeholder target for Continue navigation
  modules/
    onboarding/
      components/
        OnboardingShell.tsx              # NEW: shared premium dark onboarding layout
        OnboardingProgress.tsx           # NEW: Step 1 of 8 indicator
        GoalOptionGrid.tsx               # NEW: responsive option grid
        GoalOptionCard.tsx               # NEW: accessible selectable goal card with aria-pressed state
        OnboardingActions.tsx            # NEW: Back/Continue actions with pending/error UI; both blocked while saving
        GoalSelectionForm.tsx            # NEW: client composition for selection + save flow
      services/
        onboarding-state.ts              # NEW: save selected mainGoal to Supabase auth metadata
      types/
        index.ts                         # NEW: goal identifiers and onboarding state types
      index.ts                           # NEW: onboarding module exports
  i18n/
    ui.ts                                # MODIFY if implementation keeps new copy in i18n records
```

**Structure Decision**: Use a dedicated `src/modules/onboarding/` feature module for the new goal-selection components and typed onboarding state, while leaving the existing welcome screen files untouched to avoid incidental refactors. New authenticated onboarding pages live under the existing `src/app/(app)/` route group per the constitution and current authenticated app structure while preserving the public URLs `/onboarding/goal` and `/onboarding/experience`. The goal page remains a Server Component for auth-gated rendering through the `(app)` layout and for reading an existing saved goal from user metadata. `GoalSelectionForm` and action/card components are Client Components because they manage selection state, pending/error state, Supabase browser client access, and client-side routing. Authenticated users may manually revisit this step regardless of skipped/completed onboarding status so they can update `mainGoal`; only unauthenticated users are redirected. If `/onboarding/experience` is absent, add a minimal authenticated placeholder page to satisfy the Continue route contract without implementing the full next module.

## Complexity Tracking

No constitution violations — no complexity justification required.
