# Data Model: Workout Session Tracking

**Phase**: 1 | **Date**: 2026-05-27 | **Plan**: [plan.md](./plan.md)

---

## 1. Supabase (Postgres) Schema

### 1.1 `workout_sessions`

```sql
CREATE TABLE workout_sessions (
  id            UUID PRIMARY KEY,                     -- client-generated UUID
  user_id       UUID NOT NULL REFERENCES auth.users,
  status        TEXT NOT NULL CHECK (status IN ('in_progress', 'completed', 'cancelled', 'discarded')),
  started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at   TIMESTAMPTZ,
  duration_seconds INT,
  notes         TEXT,
  source_plan_id          UUID,                       -- FK to workout_plans (future module)
  source_workout_day_id   UUID,                       -- FK to workout_plan_days (future module)
  sync_status   TEXT NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending_sync')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their sessions"
  ON workout_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 1.2 `session_exercises`

```sql
CREATE TABLE session_exercises (
  id              UUID PRIMARY KEY,                   -- client-generated UUID
  session_id      UUID NOT NULL REFERENCES workout_sessions ON DELETE CASCADE,
  exercise_id     TEXT NOT NULL,                      -- references static exercise catalog id
  exercise_name_snapshot TEXT NOT NULL,               -- denormalized name at time of logging
  display_order   INT NOT NULL,
  notes           TEXT,
  was_replaced    BOOLEAN NOT NULL DEFAULT false,
  original_exercise_id TEXT,                          -- set if this replaced another exercise
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE session_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their session exercises"
  ON session_exercises FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions ws
      WHERE ws.id = session_exercises.session_id
        AND ws.user_id = auth.uid()
    )
  );
```

### 1.3 `set_logs`

```sql
CREATE TABLE set_logs (
  id                   UUID PRIMARY KEY,              -- client-generated UUID
  session_exercise_id  UUID NOT NULL REFERENCES session_exercises ON DELETE CASCADE,
  set_number           INT NOT NULL,
  weight               NUMERIC(7, 2),                 -- NULL for bodyweight exercises
  weight_unit          TEXT NOT NULL CHECK (weight_unit IN ('kg', 'lbs')),
  reps                 INT CHECK (reps > 0),
  set_type             TEXT NOT NULL DEFAULT 'normal' CHECK (set_type IN ('normal', 'warmup', 'dropset')),
  rpe                  NUMERIC(3, 1) CHECK (rpe BETWEEN 1 AND 10),
  is_completed         BOOLEAN NOT NULL DEFAULT true,
  is_pr                BOOLEAN NOT NULL DEFAULT false,
  notes                TEXT,
  logged_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE set_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their set logs"
  ON set_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM session_exercises se
      JOIN workout_sessions ws ON ws.id = se.session_id
      WHERE se.id = set_logs.session_exercise_id
        AND ws.user_id = auth.uid()
    )
  );
```

### 1.4 `personal_records`

```sql
CREATE TABLE personal_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users,
  exercise_id     TEXT NOT NULL,
  max_weight      NUMERIC(7, 2) NOT NULL,
  max_weight_unit TEXT NOT NULL CHECK (max_weight_unit IN ('kg', 'lbs')),
  achieved_at     TIMESTAMPTZ NOT NULL,
  set_log_id      UUID REFERENCES set_logs,           -- the set that set the PR
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, exercise_id)                        -- one PR row per user+exercise
);

ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their PRs"
  ON personal_records FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## 2. Dexie.js (IndexedDB) Schema

Active session data only. Historical data lives in Supabase.

```ts
// src/lib/offline-db.ts

export interface OfflineWorkoutSession {
  id: string                    // UUID — same as Supabase row id
  userId: string
  status: 'in_progress' | 'completed' | 'cancelled' | 'discarded'
  startedAt: number             // Date.now() — milliseconds
  finishedAt?: number
  notes?: string
  sourcePlanId?: string
  sourceWorkoutDayId?: string
  syncStatus: 'local' | 'pending_sync' | 'syncing' | 'synced' | 'sync_failed'
}

export interface OfflineSessionExercise {
  id: string                    // UUID
  sessionId: string
  exerciseId: string
  exerciseNameSnapshot: string
  displayOrder: number
  notes?: string
  wasReplaced: boolean
  originalExerciseId?: string
}

export interface OfflineSetLog {
  id: string                    // UUID
  sessionExerciseId: string
  setNumber: number
  weight?: number
  weightUnit: 'kg' | 'lbs'
  reps?: number
  setType: 'normal' | 'warmup' | 'dropset'
  rpe?: number
  isCompleted: boolean
  isPr: boolean
  notes?: string
  loggedAt: number              // Date.now()
  syncStatus: 'local' | 'pending_sync' | 'synced' | 'sync_failed'
}

export interface OfflineQueueItem {
  id?: number                   // Dexie auto-increment
  table: 'workout_sessions' | 'session_exercises' | 'set_logs' | 'personal_records'
  operation: 'upsert' | 'delete'
  payload: Record<string, unknown>
  idempotencyKey: string        // UUID of the record being synced
  createdAt: number
  attempts: number
  lastAttemptAt?: number
}

// Dexie class definition
export class GymPlannerDB extends Dexie {
  workoutSessions!: EntityTable<OfflineWorkoutSession, 'id'>
  sessionExercises!: EntityTable<OfflineSessionExercise, 'id'>
  setLogs!: EntityTable<OfflineSetLog, 'id'>
  offlineQueue!: EntityTable<OfflineQueueItem, 'id'>

  constructor() {
    super('GymPlannerDB')
    this.version(1).stores({
      workoutSessions: 'id, userId, status, syncStatus',
      sessionExercises: 'id, sessionId',
      setLogs: 'id, sessionExerciseId, syncStatus',
      offlineQueue: '++id, table, idempotencyKey, createdAt',
    })
  }
}
```

---

## 3. TypeScript Domain Types

```ts
// modules/workout-session/types/index.ts

export type SetType = 'normal' | 'warmup' | 'dropset'
export type WeightUnit = 'kg' | 'lbs'
export type SessionStatus = 'in_progress' | 'completed' | 'cancelled' | 'discarded'
export type SyncStatus = 'local' | 'pending_sync' | 'syncing' | 'synced' | 'sync_failed'

export interface SetInput {
  weight: number
  weightUnit: WeightUnit
  reps: number
  setType: SetType
  rpe?: number
  notes?: string
}

export interface SetLogDraft extends SetInput {
  id: string          // client UUID
  setNumber: number
  isPr: boolean
  loggedAt: number
}

export interface SessionExerciseDraft {
  id: string
  exerciseId: string
  exerciseNameSnapshot: string
  displayOrder: number
  notes?: string
  sets: SetLogDraft[]
}

export interface ActiveSessionDraft {
  id: string
  userId: string
  startedAt: number
  status: 'in_progress'
  exercises: SessionExerciseDraft[]
  notes?: string
  sourcePlanId?: string
  sourceWorkoutDayId?: string
  syncStatus: SyncStatus
}

export interface FinishedSession extends Omit<ActiveSessionDraft, 'status'> {
  status: 'completed'
  finishedAt: number
  durationSeconds: number
  totalVolume: number         // sum of weight × reps for normal + dropset sets
  prCount: number
}

export interface PrMap {
  [exerciseId: string]: {
    maxWeight: number
    maxWeightUnit: WeightUnit
  }
}
```

---

## 4. State Transitions

### WorkoutSession status

```
                    ┌──────────────┐
              start │              │
    ────────────────▶  in_progress │
                    │              │
                    └──────┬───────┘
                           │
              ┌────────────┼───────────────┐
              │            │               │
          finish       cancel          discard
              │       (no sets)       (has sets)
              │            │               │
              ▼            ▼               ▼
         completed     discarded       cancelled
```

### SyncStatus transitions

```
local  ──(online)──▶  pending_sync  ──(success)──▶  synced
                           │
                      (failure ×3)
                           │
                           ▼
                       sync_failed
```

---

## 5. Volume Calculation Rules

Per spec assumption: only `normal` and `dropset` sets count toward total volume.
`warmup` sets are excluded.

```ts
// modules/workout-session/utils/volume.ts

export function calculateTotalVolume(
  exercises: SessionExerciseDraft[],
  displayUnit: WeightUnit
): number {
  return exercises.flatMap(e => e.sets)
    .filter(s => s.setType !== 'warmup' && s.reps > 0 && s.weight > 0)
    .reduce((sum, s) => {
      const weight = toDisplayUnit(s.weight, s.weightUnit, displayUnit)
      return sum + weight * s.reps
    }, 0)
}
```
