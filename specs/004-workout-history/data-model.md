# Data Model: Workout History

**Phase**: 1 | **Date**: 2026-05-28 | **Plan**: [plan.md](./plan.md)

---

## 1. Supabase Schema Changes

**No new tables.** One new migration adds two columns to `workout_sessions`.

### Migration 002 — add summary columns to `workout_sessions`

```sql
ALTER TABLE workout_sessions
  ADD COLUMN total_volume NUMERIC(10, 2),
  ADD COLUMN pr_count     INT NOT NULL DEFAULT 0;
```

No new RLS policies — existing `"Users own their sessions"` policy covers the new columns.

`SyncSessionPayload` (in `session-supabase.ts`) and `finishedSessionToPayload` (in
`session-payload.ts`) must be updated to write `total_volume` and `pr_count` when syncing
a completed session. Sessions synced before this migration have `total_volume = NULL` and
`pr_count = 0`; history cards should handle `null` gracefully (display `—`).

| Table | Purpose |
|---|---|
| `workout_sessions` | Session metadata + stored volume/PR summary |
| `session_exercises` | Exercises performed in a session |
| `set_logs` | Individual sets within each exercise |
| `personal_records` | Best lifts per exercise per user |

All tables have RLS enabled. Existing policies cover SELECT for authenticated users.

---

## 2. Query Contracts (Supabase)

### 2.1 History List Query

Fetches paginated sessions for the authenticated user. Only `completed` sessions returned.

```sql
-- Conceptual (expressed in Supabase JS client syntax in contracts/)
SELECT
  ws.id,
  ws.status,
  ws.started_at,
  ws.finished_at,
  ws.duration_seconds,
  ws.total_volume,
  ws.pr_count,
  ws.notes,
  ws.source_plan_id,
  ws.source_workout_day_id,
  COUNT(DISTINCT se.id) AS exercise_count,
  COUNT(sl.id) AS total_sets
FROM workout_sessions ws
LEFT JOIN session_exercises se ON se.session_id = ws.id
LEFT JOIN set_logs sl ON sl.session_exercise_id = se.id
  AND sl.set_type != 'warmup'
  AND sl.is_completed = true
WHERE ws.user_id = auth.uid()
  AND ws.status = 'completed'
  -- optional date filter: AND ws.started_at >= $startDate AND ws.started_at <= $endDate
ORDER BY ws.started_at DESC
LIMIT 20 OFFSET $cursor;
```

**Note**: `total_volume` and `pr_count` are read from stored columns (written at sync time).
Sessions from before migration 002 will have `total_volume = NULL`; display `—` in that case.

### 2.2 History Detail Query

Fetches full nested data for a single session.

```sql
-- Supabase JS: select with nested relations
workout_sessions
  .select(`
    *,
    session_exercises (
      *,
      set_logs (*)
    )
  `)
  .eq('id', sessionId)
  .eq('user_id', auth.uid())
  .single()
```

### 2.3 Exercise Name Search Query

Returns session IDs where any exercise name snapshot matches the search term.

```sql
SELECT DISTINCT session_id
FROM session_exercises
WHERE session_id IN (
  SELECT id FROM workout_sessions WHERE user_id = auth.uid() AND status = 'completed'
)
AND exercise_name_snapshot ILIKE '%{term}%'
```

Result is used to scope the history list query with `ws.id IN (...)`.

---

## 3. Frontend Types

### 3.1 History List Item

Used for session cards in the history list. Lightweight — no full set data.

```ts
// modules/workout-history/types/index.ts

export interface WorkoutHistorySummary {
  id: string
  startedAt: string         // ISO timestamp
  finishedAt: string        // ISO timestamp
  durationSeconds: number
  totalVolume: number       // stored from FinishedSession at completion
  totalSets: number         // count of non-warmup completed sets
  exerciseCount: number
  notes: string | null
  sourcePlanId: string | null
}
```

### 3.2 History Detail

Full session data including exercises and sets.

```ts
export interface WorkoutHistoryDetail {
  id: string
  startedAt: string
  finishedAt: string
  durationSeconds: number
  totalVolume: number
  notes: string | null
  sourcePlanId: string | null
  exercises: WorkoutHistoryExercise[]
  prCount: number
}

export interface WorkoutHistoryExercise {
  id: string
  exerciseId: string
  exerciseNameSnapshot: string
  displayOrder: number
  notes: string | null
  wasReplaced: boolean
  originalExerciseId: string | null
  sets: WorkoutHistorySet[]
}

export interface WorkoutHistorySet {
  id: string
  setNumber: number
  weight: number | null
  weightUnit: 'kg' | 'lbs'
  reps: number | null
  setType: 'normal' | 'warmup' | 'dropset'
  rpe: number | null
  isCompleted: boolean
  isPr: boolean
  notes: string | null
}
```

### 3.3 Filter State

```ts
export type DateRangeFilter = '7d' | '30d' | '90d' | '180d' | '365d' | null

export interface HistoryFilters {
  dateRange: DateRangeFilter
  exerciseSearch: string    // '' = no search filter
}
```

---

## 4. IndexedDB (Dexie)

No new Dexie tables. Offline access for history relies on TanStack Query's cache (stale data
served from memory/localStorage when offline). Full offline history persistence is out of scope
for V1.

---

## 5. Derived Values

### Total Volume

Computed at session finish time (`FinishedSession.totalVolume`) and stored in
`workout_sessions.total_volume` via migration 002. History reads the stored column —
does not recompute. Sessions synced before migration 002 have `NULL`; display `—`.

### Session Name

Sessions have no user-defined name field in `workout_sessions`. Display name derived as:
- If `source_plan_id` is set: show "Workout" (plan day name lookup deferred)
- Otherwise: `"Workout — {date}"` formatted from `started_at`

Display-only concern handled in `utils/format-session-name.ts`.

### PR Count

Computed at session finish time (`FinishedSession.prCount`) and stored in
`workout_sessions.pr_count` via migration 002. History reads the stored column —
does not recompute. Sessions synced before migration 002 have `pr_count = 0`.
