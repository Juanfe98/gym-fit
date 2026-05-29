-- workout_plans
CREATE TABLE workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  goal TEXT NOT NULL,
  level TEXT NOT NULL,
  duration_weeks INT,
  days_per_week INT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their plans"
  ON workout_plans FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- workout_days
CREATE TABLE workout_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES workout_plans ON DELETE CASCADE,
  name TEXT NOT NULL,
  day_order INT NOT NULL,
  target_muscle_groups TEXT[] NOT NULL DEFAULT '{}'
);

ALTER TABLE workout_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their workout days"
  ON workout_days FOR ALL
  USING (
    auth.uid() = (SELECT user_id FROM workout_plans WHERE id = plan_id)
  )
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM workout_plans WHERE id = plan_id)
  );

-- plan_exercises
CREATE TABLE plan_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID NOT NULL REFERENCES workout_days ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  display_order INT NOT NULL,
  target_sets INT,
  target_reps INT,
  target_rep_range_min INT,
  target_rep_range_max INT,
  target_weight NUMERIC(8,2),
  rest_seconds INT,
  tempo TEXT,
  target_rpe NUMERIC(3,1),
  notes TEXT
);

ALTER TABLE plan_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their plan exercises"
  ON plan_exercises FOR ALL
  USING (
    auth.uid() = (
      SELECT wp.user_id FROM workout_plans wp
      JOIN workout_days wd ON wd.plan_id = wp.id
      WHERE wd.id = day_id
    )
  )
  WITH CHECK (
    auth.uid() = (
      SELECT wp.user_id FROM workout_plans wp
      JOIN workout_days wd ON wd.plan_id = wp.id
      WHERE wd.id = day_id
    )
  );
