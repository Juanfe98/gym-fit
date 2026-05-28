-- Migration: 001_workout_sessions
-- Creates workout session tracking tables with RLS policies.

-- ---------------------------------------------------------------------------
-- workout_sessions
-- ---------------------------------------------------------------------------

CREATE TABLE workout_sessions (
  id                    UUID PRIMARY KEY,
  user_id               UUID NOT NULL REFERENCES auth.users,
  status                TEXT NOT NULL CHECK (status IN ('in_progress', 'completed', 'cancelled', 'discarded')),
  started_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at           TIMESTAMPTZ,
  duration_seconds      INT,
  notes                 TEXT,
  source_plan_id        UUID,
  source_workout_day_id UUID,
  sync_status           TEXT NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending_sync')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their sessions"
  ON workout_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- session_exercises
-- ---------------------------------------------------------------------------

CREATE TABLE session_exercises (
  id                      UUID PRIMARY KEY,
  session_id              UUID NOT NULL REFERENCES workout_sessions ON DELETE CASCADE,
  exercise_id             TEXT NOT NULL,
  exercise_name_snapshot  TEXT NOT NULL,
  display_order           INT NOT NULL,
  notes                   TEXT,
  was_replaced            BOOLEAN NOT NULL DEFAULT false,
  original_exercise_id    TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
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

-- ---------------------------------------------------------------------------
-- set_logs
-- ---------------------------------------------------------------------------

CREATE TABLE set_logs (
  id                   UUID PRIMARY KEY,
  session_exercise_id  UUID NOT NULL REFERENCES session_exercises ON DELETE CASCADE,
  set_number           INT NOT NULL,
  weight               NUMERIC(7, 2),
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

-- ---------------------------------------------------------------------------
-- personal_records
-- ---------------------------------------------------------------------------

CREATE TABLE personal_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users,
  exercise_id     TEXT NOT NULL,
  max_weight      NUMERIC(7, 2) NOT NULL,
  max_weight_unit TEXT NOT NULL CHECK (max_weight_unit IN ('kg', 'lbs')),
  achieved_at     TIMESTAMPTZ NOT NULL,
  set_log_id      UUID REFERENCES set_logs,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, exercise_id)
);

ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their PRs"
  ON personal_records FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER workout_sessions_updated_at
  BEFORE UPDATE ON workout_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER personal_records_updated_at
  BEFORE UPDATE ON personal_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
