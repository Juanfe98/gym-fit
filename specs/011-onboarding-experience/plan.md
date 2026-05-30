# Implementation Plan: Onboarding Experience Selection

**Branch**: `011-onboarding-experience` | **Date**: 2026-05-29 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/011-onboarding-experience/spec.md`

## Summary

Build the second onboarding data-entry step at `/onboarding/experience`. The page displays Step 2 of 8, asks the user how experienced they are with training, renders three accessible selectable cards (Beginner, Intermediate, Advanced) with descriptions and example bullets, disables Continue until a level is selected, saves `experienceLevel` into the existing `user_fitness_preferences.experience_level` profile preferences row, and routes to `/onboarding/frequency`. Implementation reuses the existing onboarding module patterns from the goal step, the existing dark premium Tailwind token system, the existing Supabase/RLS-backed fitness preferences table, and no new dependencies.

## Technical Context

**Language/Version**: TypeScript 5.8, Next.js 15 App Router, React 19  
**Primary Dependencies**: `@supabase/ssr`, `@supabase/supabase-js`, Tailwind CSS v4, `lucide-react`  
**Storage**: Existing Supabase Postgres table `user_fitness_preferences.experience_level`; no new database tables or migrations  
**Testing**: Manual responsive verification at 320px, 375px, tablet, and desktop widths + keyboard/screen-reader state checks + `npm run build`  
**Target Platform**: Mobile-first responsive web deployed through Next.js/Vercel  
**Project Type**: Web application  
**Performance Goals**: Initial preferences read should show a clear loading state if needed; save action should show pending feedback and prevent duplicate submissions  
**Constraints**: No new npm dependencies; use existing design tokens; 44px minimum tap targets; no hover-only primary affordances; no custom backend; no Supabase schema migration  
**Scale/Scope**: 1 primary route page, a minimal `/onboarding/frequency` placeholder route if absent, onboarding components for experience option grid/card/form, typed experience constants, one Supabase preferences upsert/read flow

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I — User-First Architecture | ✅ PASS | Uses Next.js App Router and the existing Supabase `user_fitness_preferences` table with RLS; no custom backend or API layer added |
| II — Mobile-First UI | ✅ PASS | Mobile-first card stack/grid planned; 320px/375px checks; controls use >=44px tap targets |
| III — Exercise Content Integrity | ✅ N/A | Does not modify the exercise catalog |
| IV — External Media Isolation | ✅ N/A | No external media provider usage |
| V — Minimal, Reviewable Changes | ✅ PASS | Builds on existing onboarding goal components/patterns and adds only the requested step plus a minimal next-step placeholder if needed; no dependencies |
| VI — Offline-First Session Tracking | ✅ N/A | Does not touch active workout session tracking |

**Post-Design Re-check**: PASS. Design artifacts preserve the same scope: no new tables, no custom backend, no new dependencies, mobile-first responsive UI, no active-session/offline changes, and only a minimal `/onboarding/frequency` placeholder if the route is absent.

## Project Structure

### Documentation (this feature)

```text
specs/011-onboarding-experience/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── onboarding-experience-ui.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - not created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
  app/
    (app)/
      onboarding/
        experience/
          page.tsx                       # REPLACE placeholder with full authenticated app-route page for /onboarding/experience
        frequency/
          page.tsx                       # NEW IF ABSENT: minimal authenticated app-route placeholder target for Continue navigation
  modules/
    onboarding/
      components/
        OnboardingShell.tsx              # EXISTING: shared premium dark onboarding layout
        OnboardingProgress.tsx           # EXISTING: Step indicator, used as Step 2 of 8
        OnboardingActions.tsx            # MODIFY: support /onboarding/goal back target while preserving existing goal-step behavior
        ExperienceOptionGrid.tsx         # NEW: responsive experience option grid
        ExperienceOptionCard.tsx         # NEW: accessible selectable experience card with aria-pressed state and example bullets
        ExperienceSelectionForm.tsx      # NEW: client composition for selection + save flow
      services/
        onboarding-state.ts              # MODIFY: add get/save experienceLevel through user_fitness_preferences while preserving saveMainGoal behavior
      types/
        index.ts                         # MODIFY: add experience identifiers, option definitions, guards, and onboarding state typing
      index.ts                           # MODIFY: export experience selection components as needed
  i18n/
    ui.ts                                # MODIFY if implementation keeps new copy in i18n records
```

**Structure Decision**: Continue using the existing `src/modules/onboarding/` feature module created for the goal selection step. The `/onboarding/experience` page lives under `src/app/(app)/onboarding/experience/page.tsx` so it remains auth-gated by the app layout while preserving the public route; unauthenticated users are redirected by the existing `(app)` layout. The page itself remains a Server Component for reading the initial saved `experience_level` from `user_fitness_preferences` through the server Supabase client and passing it into a Client Component. `ExperienceSelectionForm`, `ExperienceOptionGrid`, and `ExperienceOptionCard` are Client Components because they manage selection state, pending/error state, accessible interactive state, Supabase browser client saving, and client-side routing. Saving uses an upsert into the existing `user_fitness_preferences` row for the current user so onboarding and profile overview share the same canonical source of truth. `OnboardingActions` should be extended minimally to accept a configurable `backHref`, defaulting to `/onboarding/welcome` so the goal step is not broken. If `/onboarding/frequency` is absent, add a minimal authenticated placeholder page to satisfy the Continue route contract without implementing the full next onboarding module.

## Complexity Tracking

No constitution violations — no complexity justification required.
