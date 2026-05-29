# Module Contract: Plan → Session Bridge

**Branch**: `009-plan-session-bridge` | **Date**: 2026-05-29

---

## New Public Exports

### `src/modules/home/index.ts`

Add export:

| Export | Props summary | Consumers |
|--------|---------------|-----------|
| `PlanWidget` | `{ userId: string }` | `src/app/(app)/page.tsx` |

### `src/modules/home/hooks/use-active-plan-widget.ts`

Internal to `home` module. Not exported from barrel (consumed only by `PlanWidget`).

---

## Modified Public Contracts

### `workout-session` module — `StartSessionOptions`

**Before**:
```ts
interface StartSessionOptions {
  sourcePlanId?: string
  sourceWorkoutDayId?: string
}
```

**After**:
```ts
interface StartSessionOptions {
  sourcePlanId?: string
  sourceWorkoutDayId?: string
  sourcePlanName?: string   // NEW
  sourceDayName?: string    // NEW
}
```

All callers of `startSession` that pass no opts are unaffected. The workout page (`/workout/page.tsx`) is the only caller that passes opts; it is updated in this spec.

### `workout-session` module — `ExerciseRef` (internal, used by `addExercise`)

**Before**:
```ts
interface ExerciseRef {
  exerciseId: string
  exerciseNameSnapshot: string
}
```

**After**:
```ts
interface ExerciseRef {
  exerciseId: string
  exerciseNameSnapshot: string
  targetSets?: number         // NEW
  targetReps?: number         // NEW
  targetRepRangeMin?: number  // NEW
  targetRepRangeMax?: number  // NEW
  targetWeight?: number       // NEW
}
```

Existing callers (`ExercisePicker` → `addExercise`) pass no target fields — backward-compatible.

### `workout-session` module — `SyncSessionPayload`

**Before** (`session` object in payload):
```ts
source_plan_id: string | null
source_workout_day_id: string | null
```

**After**:
```ts
source_plan_id: string | null
source_workout_day_id: string | null
source_plan_name: string | null    // NEW
source_day_name: string | null     // NEW
```

### `workout-session` module — `ActiveSessionDraft`

New optional fields: `sourcePlanName?: string`, `sourceDayName?: string`.

Backward-compatible — existing sessions without these fields will have `undefined` (treated as `null`).

### `workout-history` module — `WorkoutHistorySummary`

New fields: `sourceWorkoutDayId: string | null`, `sourcePlanName: string | null`, `sourceDayName: string | null`.

Consumers (`WorkoutHistoryCard`, `WorkoutHistoryDetail`, `formatSessionName`) are updated in this spec.

### `workout-history` module — `WorkoutHistoryDetail`

Same new fields as `WorkoutHistorySummary`.

---

## Integration Contracts

### `home` → `workout-session`

`PlanWidget` does NOT import from `workout-session`. It only navigates to `/workout` with query params. The workout page is responsible for reading params and calling `startSession` + `addExercise`.

### `home` → `workout-plans`

`useActivePlanWidget` uses `getActivePlan`, `getDaysWithCount`, and the new `getLastCompletedPlanSession` from `@/modules/workout-plans/services/plans-service`. The first two are existing; the third is added in this spec.

### `/workout` page → `workout-plans`

The workout page calls `getPlanExercises(dayId)` directly from `@/modules/workout-plans/services/exercises-service` when plan params are present.

### `workout-history` → Supabase

`fetchHistoryList` and `fetchHistoryDetail` select two new columns: `source_plan_name`, `source_day_name`. These columns exist after migration 005 is applied. The select string `source_workout_day_id` was already fetched (it's in the existing schema) — confirm it's actually selected in both queries (it is not currently — add it).

---

## URL Contract: Plan-Day Session Start

Navigation from `PlanWidget` to workout page:

```
/workout?planId={uuid}&dayId={uuid}&planName={encodeURIComponent(name)}&dayName={encodeURIComponent(name)}
```

The workout page reads all four params. If any is missing, the plan-day start flow is skipped and normal blank-session start is shown.

---

## i18n Keys Added (both `en` and `es` blocks in `src/i18n/ui.ts`)

| Key | en | es |
|-----|----|----|
| `activePlanHeader` | `"Your Plan"` | `"Tu Plan"` |
| `nextUpLabel` | `"Next up"` | `"Siguiente"` |
| `emptyDayWarning` | `"This day has no exercises yet"` | `"Este día no tiene ejercicios aún"` |
| `planAttributionLabel` | `"Plan:"` | `"Plan:"` |
| `loadingPlanExercises` | `"Loading exercises…"` | `"Cargando ejercicios…"` |
