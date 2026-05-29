# Implementation Plan: Workout Plans

**Branch**: `008-workout-plans` | **Date**: 2026-05-29 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/008-workout-plans/spec.md`

---

## Summary

Build a Workout Plans module at `/plans`. Users can create plans manually or from four seeded template routines, add and configure workout days, add exercises from the Exercise Library picker, set per-exercise targets (sets, reps, weight, rest), reorder exercises with up/down buttons, activate a plan (one active at a time), and duplicate or archive plans. Three new Supabase tables (`workout_plans`, `workout_days`, `plan_exercises`) with full RLS. Plans gets a primary BottomNav tab — History tab is replaced (History remains accessible from Profile). No new npm dependencies.

---

## Technical Context

**Language/Version**: TypeScript 5.8, Next.js 15 App Router
**Primary Dependencies**: `@supabase/ssr`, `@tanstack/react-query ^5`, `zustand ^5`, `react-hook-form ^7`, `zod ^4`, `lucide-react`, Tailwind CSS v4
**Storage**: Supabase Postgres — 3 new tables (`workout_plans`, `workout_days`, `plan_exercises`); template routines from `src/data/routines/` (in-memory, no DB)
**Testing**: Manual 375px viewport check + `npm run build` per constitution DoD
**Target Platform**: Mobile-first web, 375px primary
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Plans list first render <1s; plan detail with days/exercises <1.5s
**Constraints**: No new npm dependencies; no drag-and-drop (up/down buttons for reorder); no plan deletion (archive only); active workout session uses `sourcePlanId` / `sourceWorkoutDayId` (real Supabase UUIDs)
**Scale/Scope**: 3 new Supabase tables; ~12 new components; 5 new routes; 1 BottomNav tab change (History → Plans)

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I — User-First Architecture | ✅ PASS | All plan data behind Supabase RLS; no custom server; TanStack Query for server state |
| II — Mobile-First UI | ✅ PASS | 44px tap targets; 375px-first; Plans tab replaces History tab — nav stays at 5 tabs |
| III — Exercise Content Integrity | ✅ PASS | Exercise catalog untouched; plan_exercises references `exercise_id` from static catalog |
| IV — External Media Isolation | ✅ N/A | No ExerciseDB calls in plan module |
| V — Minimal, Reviewable Changes | ✅ PASS | No new deps; ExercisePicker reused as-is; BottomNav History tab replaced with Plans tab (1-line change + new i18n key) |
| VI — Offline-First Session Tracking | ✅ N/A | Plan data is not part of IndexedDB active session; `sourcePlanId` / `sourceWorkoutDayId` are optional metadata on session start |

**Post-Design Re-check**: No violations introduced. All three tables have full RLS. BottomNav stays at 5 tabs (History replaced by Plans; History accessible from Profile).

---

## Project Structure

### Documentation (this feature)

```text
specs/008-workout-plans/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── workout-plans-module.md  ← Phase 1 output
└── tasks.md             ← /speckit-tasks output (not yet created)
```

### Source Code

```text
src/
  app/
    (app)/
      plans/
        page.tsx                          ← NEW: plans list screen
        new/
          page.tsx                        ← NEW: create plan screen
        [id]/
          page.tsx                        ← NEW: plan detail screen
          edit/
            page.tsx                      ← NEW: edit plan screen
          days/
            [dayId]/
              page.tsx                    ← NEW: workout day editor screen
  modules/
    workout-plans/
      components/
        PlanCard.tsx                      ← NEW: plan summary card (name, goal, active badge, days count)
        PlanForm.tsx                      ← NEW: create/edit form (name, goal, level, duration, days-per-week)
        TemplatePicker.tsx                ← NEW: template selection grid (4 cards: muscle-gain, fat-loss, strength, conditioning)
        PlanDayList.tsx                   ← NEW: ordered list of workout days in plan detail
        PlanDayCard.tsx                   ← NEW: single day row (name, exercise count, edit/delete actions)
        WorkoutDayEditor.tsx              ← NEW: full day editor (day name + exercise list + add exercise button)
        PlanExerciseRow.tsx               ← NEW: single exercise slot row (name, targets, up/down, remove)
        PlanExerciseForm.tsx              ← NEW: bottom-sheet / inline form for per-exercise target configuration
        ActivateButton.tsx                ← NEW: activate/deactivate CTA with validation guard
        PlanActions.tsx                   ← NEW: duplicate + archive action buttons (plan detail footer)
      hooks/
        use-plans.ts                      ← NEW: TanStack Query hooks for plans list, plan detail, plan days
        use-plan-mutations.ts             ← NEW: create, update, activate, deactivate, duplicate, archive mutations
        use-plan-exercises.ts             ← NEW: hooks for plan exercises CRUD + reorder
      services/
        plans-service.ts                  ← NEW: Supabase CRUD for workout_plans
        days-service.ts                   ← NEW: Supabase CRUD for workout_days
        exercises-service.ts              ← NEW: Supabase CRUD for plan_exercises
        template-import.ts               ← NEW: converts Routine → workout_plans + workout_days + plan_exercises rows
      types/
        index.ts                          ← NEW
      validation/
        plan-schema.ts                    ← NEW: Zod schemas for PlanForm and PlanExerciseForm
      index.ts                            ← NEW barrel
    home/
      components/
        BottomNav.tsx                     ← MODIFY: replace History tab with Plans tab; add 'navPlans' i18n key; import ClipboardList from lucide-react
        StartWorkoutCTA.tsx               ← MODIFY: add "Create plan" CTA in empty / no-active-plan state
  i18n/
    ui.ts                                 ← MODIFY: add ~30 new i18n keys (en + es)
supabase/
  migrations/
    004_workout_plans.sql                 ← NEW: three tables + RLS policies
```

**Structure Decision**: Single Next.js project. Workout Plans module follows the same layout as `workout-session` and `workout-history`. Pages are thin Client Component wrappers (plan editing requires `useState`); data logic lives in `src/modules/workout-plans/`. Plans gets a primary BottomNav tab (History tab replaced — see research.md Decision 1). History remains accessible via `/history` link on the Profile screen.

---

## Complexity Tracking

No constitution violations — no complexity justification required.
