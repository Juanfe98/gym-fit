# Quickstart: Workout Plans

**Branch**: `008-workout-plans` | **Date**: 2026-05-29

---

## Prerequisites

1. Spec 007 (Exercise Library) complete — `ExercisePicker` component must exist at `src/modules/workout-session/components/ExercisePicker.tsx`
2. Migration `003_user_exercise_favorites.sql` already applied (spec 007)
3. You are on branch `008-workout-plans`

---

## Setup

Apply the new migration:

```bash
supabase db push
# or: supabase migration up
```

Verify the three tables exist in your local Supabase:
- `workout_plans`
- `workout_days`
- `plan_exercises`

Start the dev server:

```bash
npm run dev
```

---

## Manual Test Paths

### Path 1: Create a Plan Manually

1. Sign in as a test user
2. Navigate to `/workout` → tap "My Plans"
3. Tap "New Plan" → choose "Build manually"
4. Fill: name="Test Plan", goal=Strength, level=Intermediate, 3 days/week → Save
5. Plan appears in Plans List (not active)
6. Open plan → tap "Add Day" → name it "Day 1 — Push"
7. Open day → tap "Add Exercise" → search "bench press" → select
8. Set 4 sets, 8–10 reps → save
9. Add a second exercise → reorder with up/down buttons
10. Navigate back to plan detail — day shows exercise count = 2

### Path 2: Create from Template

1. Tap "New Plan" → choose "Start from template"
2. Select "Muscle Gain"
3. Set 4 days/week → Save
4. Plan appears pre-populated with 4 days (first 4 of the Muscle Gain template)
5. Open any day — exercises are pre-configured with target sets/reps

### Path 3: Activate a Plan

1. Open a plan that has ≥1 day with ≥1 exercise
2. Tap "Activate Plan" → "Active" badge appears
3. Navigate to Plans List → plan shows "Active" badge
4. Activate a different plan → first plan loses badge, second gains it

### Path 4: Activate Guard

1. Open a plan with 0 days → tap "Activate Plan" → error: "Add at least one day..."
2. Open a plan with a day but 0 exercises → tap "Activate" → error: "Each day must have at least one exercise."

### Path 5: Duplicate

1. Open any plan → tap "Duplicate Plan"
2. New plan appears in list with "(copy)" suffix, not active
3. Edit the copy → original unchanged

### Path 6: Archive

1. Open any plan → tap "Archive Plan"
2. Confirm → plan disappears from default list
3. Toggle "Show archived" → plan reappears with archived badge

### Path 7: Home Screen CTA

1. User with no active plan → Home screen shows "Create a plan..." secondary CTA → taps → goes to `/plans/new`
2. User with active plan → Home screen shows active plan name in the CTA area

### Path 8: Start Session from Active Plan

1. Activate a plan with ≥1 day
2. Navigate to `/workout` → active plan name shown; day selector appears
3. Start session → session `sourcePlanId` and `sourceWorkoutDayId` populated
4. Complete session → history record shows plan name

---

## Definition of Done Checklist

- [ ] `npm run build` passes — zero TypeScript errors
- [ ] All screens render at 375px without horizontal overflow
- [ ] Plans List: shows active badge, archived toggle works
- [ ] Create Manual: form validation errors shown inline; plan created in Supabase
- [ ] Create from Template: days + exercises pre-populated; correct number of days imported
- [ ] Day Editor: add exercise opens picker; targets saved; reorder works; remove works
- [ ] Activate: guard blocks plans with no days / empty days; one active at a time
- [ ] Duplicate: deep copy created; original unchanged
- [ ] Archive: plan hidden from default list; deactivated if was active
- [ ] Home CTA: shows create-plan prompt when no active plan; shows plan name when active
- [ ] Workout screen: "My Plans" link present; active plan day selection available
- [ ] Migration `004_workout_plans.sql` applied; RLS verified (unauthenticated request returns 0 rows)
- [ ] All 37 i18n keys present in both `en` and `es` blocks
- [ ] No new npm dependencies added
