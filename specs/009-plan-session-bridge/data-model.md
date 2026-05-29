# Data Model: Plan → Session Bridge

**Branch**: `009-plan-session-bridge` | **Date**: 2026-05-29

---

## Supabase Changes

### `workout_sessions` — 2 new columns

Migration 005 adds:

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `source_plan_name` | TEXT | NULLABLE | Snapshot of plan name at session start; null for manual sessions |
| `source_day_name` | TEXT | NULLABLE | Snapshot of day name at session start; null for manual sessions |

**Why snapshots**: Attribution in history must survive plan/day deletion (FR4 acceptance scenario 3). Joining at read time fails when the plan is gone.

**Existing related columns** (already in migration 001, no changes):
- `source_plan_id UUID` — FK to `workout_plans.id` (nullable)
- `source_workout_day_id UUID` — FK to `workout_days.id` (nullable)

No RLS policy changes needed — `workout_sessions` RLS (`auth.uid() = user_id`) already covers these columns.

---

## TypeScript Type Changes

### `src/modules/workout-session/types/index.ts`

Add to `ActiveSessionDraft`:
```ts
sourcePlanName?: string    // snapshot — from plan.name at start time
sourceDayName?: string     // snapshot — from day.name at start time
```

Add to `SessionExerciseDraft`:
```ts
targetSets?: number
targetReps?: number
targetRepRangeMin?: number
targetRepRangeMax?: number
targetWeight?: number
```

`FinishedSession` extends `ActiveSessionDraft` (via `Omit` + override), so it inherits the new session fields automatically. No change needed to `FinishedSession` directly.

### `src/lib/offline-db.ts`

Add to `OfflineWorkoutSession`:
```ts
sourcePlanName?: string
sourceDayName?: string
```

Add to `OfflineSessionExercise`:
```ts
targetSets?: number
targetReps?: number
targetRepRangeMin?: number
targetRepRangeMax?: number
targetWeight?: number
```

No Dexie version bump needed — all new fields are non-indexed.

### `src/modules/workout-session/services/session-supabase.ts`

Add to `SyncSessionPayload.session`:
```ts
source_plan_name: string | null
source_day_name: string | null
```

### `src/modules/workout-history/types/index.ts`

Add to `WorkoutHistorySummary`:
```ts
sourceWorkoutDayId: string | null
sourcePlanName: string | null
sourceDayName: string | null
```

Add to `WorkoutHistoryDetail`:
```ts
sourceWorkoutDayId: string | null
sourcePlanName: string | null
sourceDayName: string | null
```

---

## New Hook: `useActivePlanWidget`

**File**: `src/modules/home/hooks/use-active-plan-widget.ts`

Fetches:
1. Active plan via `getActivePlan(userId)` — TQ key: `['plans', 'active', userId]` (shared with `StartWorkoutCTA`, no duplicate request)
2. Days with exercise counts via `getDaysWithCount(activePlan.id)` — TQ key: `['plans', 'days', activePlan.id]`
3. Last completed plan session via `getLastCompletedPlanSession(userId, activePlan.id)` (new service function in `plans-service.ts`) — TQ key: `['plans', 'lastSession', activePlan.id]`

Returns:
```ts
interface ActivePlanWidgetData {
  activePlan: WorkoutPlan | null
  days: WorkoutDayWithCount[]
  suggestedDayId: string | null   // null → suggest first day
  isLoading: boolean
}
```

**Suggested day logic**:
```
lastSession = last completed session for activePlan
if lastSession has sourceWorkoutDayId:
  lastDay = days.find(d => d.id === lastSession.sourceWorkoutDayId)
  if lastDay exists:
    nextIndex = (lastDay.dayOrder + 1) % days.length
    suggestedDayId = days[nextIndex].id
  else:
    suggestedDayId = days[0]?.id ?? null  // fallback if day was deleted
else:
  suggestedDayId = days[0]?.id ?? null   // no prior session → first day
```

---

## New Component: `PlanWidget`

**File**: `src/modules/home/components/PlanWidget.tsx`

Props:
```ts
interface PlanWidgetProps {
  userId: string
}
```

Behavior:
- Uses `useActivePlanWidget(userId)`
- Returns `null` when `activePlan` is null (no active plan → hidden)
- Shows: plan name as header, list of workout days (name + exercise count + "Next up" badge)
- Each day row is tappable (min 44px hit target)
- Empty day guard: if `exerciseCount === 0`, shows inline warning toast/text instead of navigating
- Non-empty day: `router.push('/workout?planId=X&dayId=Y&planName=...&dayName=...')` using `encodeURIComponent` for name values

---

## Modified: Workout Page Auto-Start Flow

**File**: `src/app/(app)/workout/page.tsx`

New params read (via `useSearchParams()`):
- `planId` — triggers plan-from-day start flow
- `dayId`
- `planName` (URL-decoded)
- `dayName` (URL-decoded)

Auto-start sequence (only when all four params present and no existing session):
1. Fetch `getPlanExercises(dayId)` — list of `PlanExercise` ordered by `displayOrder`
2. `startSession(userId, { sourcePlanId: planId, sourceWorkoutDayId: dayId, sourcePlanName: planName, sourceDayName: dayName })`
3. For each exercise in order: `addExercise({ exerciseId, exerciseNameSnapshot: EXERCISE_CATALOG[exerciseId]?.displayName ?? exerciseId })`
4. Navigate cleans the URL params (replace state) so browser back doesn't re-trigger

If `getPlanExercises` returns empty array (defensive guard): do not start session; show error state.
If a session is already in progress: ignore plan params; show existing session (normal recovery flow).
