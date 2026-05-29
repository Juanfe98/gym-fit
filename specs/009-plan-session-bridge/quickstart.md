# Quickstart: Plan → Session Bridge

**Branch**: `009-plan-session-bridge` | **Date**: 2026-05-29

---

## Prerequisites

1. Spec 008 (Workout Plans) complete — active plan module, `getDaysWithCount`, `getPlanExercises`, `getActivePlan` must all exist.
2. Migration `004_workout_plans.sql` already applied.
3. You are on branch `009-plan-session-bridge`.

---

## Setup

Apply the new migration:

```bash
supabase db push
# or: supabase migration up
```

Verify `workout_sessions` now has columns `source_plan_name` and `source_day_name`:

```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'workout_sessions'
  AND column_name IN ('source_plan_name', 'source_day_name');
-- Should return 2 rows
```

Start the dev server:

```bash
npm run dev
```

---

## Manual Test Paths

### Path 1: Plan Widget — No Active Plan

1. Sign in as a user with no active plan (or deactivate all plans).
2. Navigate to Home (`/`).
3. **Expected**: No plan widget visible. `StartWorkoutCTA` displays as before. "Create a plan..." secondary link shown below CTA.

### Path 2: Plan Widget — Active Plan with Days

1. Activate a plan that has ≥2 days, each with ≥1 exercise.
2. Navigate to Home.
3. **Expected**: Plan widget appears above the start CTA. Shows plan name. Lists workout days with exercise counts. One day is highlighted as "Next up" (Day 1 if no prior sessions).

### Path 3: Empty Day Guard

1. Activate a plan that has a day with 0 exercises.
2. On the Home screen plan widget, tap the empty day.
3. **Expected**: Inline warning "This day has no exercises yet" appears. No navigation to `/workout`. Other days remain tappable.

### Path 4: Start Session from Plan Day

1. Activate a plan with Day 1 containing 3 exercises.
2. Tap Day 1 in the plan widget.
3. **Expected**: Navigated to `/workout`. Session auto-starts. All 3 exercises are pre-loaded in order with correct names. `sourcePlanId`, `sourceWorkoutDayId`, `sourcePlanName`, `sourceDayName` are stored on the session.
4. Log one set on any exercise → finish session.
5. **Expected**: Session saved. Navigate to History → find session → plan name and day name shown as attribution.

### Path 5: Manual Start Still Works

1. On Home screen, tap the orange "Start Workout" CTA (not a plan day).
2. **Expected**: Navigates to `/workout`. Blank session starts (no exercises pre-loaded). No plan attribution.

### Path 6: History Attribution

1. Open a session that was started from a plan day.
2. **Expected**: History list card shows plan + day name attribution below the session title.
3. Open the session detail page.
4. **Expected**: Plan attribution section visible (plan name + day name).
5. Open a session started without a plan.
6. **Expected**: No attribution shown. Layout unchanged from before this spec.

### Path 7: Attribution Survives Plan Deletion

1. Complete a plan-sourced session.
2. Archive (or delete) the source plan.
3. Return to history, open the session.
4. **Expected**: Plan and day names still shown (from snapshot). No error or missing attribution.

### Path 8: Next-Day Suggestion

1. Complete Day 1 of the active plan.
2. Return to Home.
3. **Expected**: Plan widget now highlights Day 2 as "Next up".
4. Complete Day 2. Return to Home.
5. **Expected**: Day 3 highlighted (or Day 1 if Day 2 is the last day — cycle restarts).

### Path 9: Session Recovery — Plan-Sourced Session

1. Start a session from a plan day.
2. Force-quit the browser (close tab, kill process).
3. Reopen the app → navigate to `/workout`.
4. **Expected**: "Resume workout" screen shown. Resume session → plan exercises still present. Session still has plan attribution.

---

## Definition of Done Checklist

- [ ] `npm run build` passes — zero TypeScript errors
- [ ] All screens render at 375px without horizontal overflow
- [ ] Migration 005 applied; `source_plan_name` and `source_day_name` columns present
- [ ] Home: plan widget hidden when no active plan; start CTA unchanged
- [ ] Home: plan widget shows plan name + day list + exercise counts when active plan exists
- [ ] Home: "Next up" badge on correct day (Day 1 on first visit; advances after each completed session)
- [ ] Home: empty day tap shows inline warning, no navigation
- [ ] Workout: plan-day start pre-loads all exercises in order with correct names and target values visible in each exercise row
- [ ] Workout: `SetLogForm` pre-fills weight from plan target on first set when `targetWeight` is set
- [ ] Workout: blank start (via CTA) still works; no plan attribution on blank session
- [ ] Session: `sourcePlanName` and `sourceDayName` stored in IndexedDB and synced to Supabase
- [ ] History list: plan-sourced sessions show attribution badge; manual sessions show none
- [ ] History detail: plan-sourced sessions show attribution section; manual sessions unchanged
- [ ] Attribution visible even after source plan is archived/deleted
- [ ] All new i18n keys present in both `en` and `es` blocks (`activePlanHeader`, `nextUpLabel`, `emptyDayWarning`, `planAttributionLabel`, `loadingPlanExercises`)
- [ ] No new npm dependencies added
- [ ] RLS not broken — unauthenticated request to `workout_sessions` returns 0 rows
