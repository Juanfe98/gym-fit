-- user_fitness_preferences
CREATE TABLE user_fitness_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  fitness_goal TEXT,
  experience_level TEXT,
  days_per_week INT,
  session_duration_minutes INT,
  preferred_days TEXT[] NOT NULL DEFAULT '{}',
  height_unit TEXT NOT NULL DEFAULT 'cm',
  weight_unit TEXT NOT NULL DEFAULT 'kg',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_fitness_preferences_user_id_key UNIQUE (user_id)
);

ALTER TABLE user_fitness_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their fitness preferences"
  ON user_fitness_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_equipment
CREATE TABLE user_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  preset TEXT,
  equipment_items TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_equipment_user_id_key UNIQUE (user_id)
);

ALTER TABLE user_equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their equipment"
  ON user_equipment FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_body_info
CREATE TABLE user_body_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  height_cm NUMERIC(6,2),
  weight_kg NUMERIC(6,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_body_info_user_id_key UNIQUE (user_id)
);

ALTER TABLE user_body_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their body info"
  ON user_body_info FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_limitations
CREATE TABLE user_limitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  affected_area TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE user_limitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their limitations"
  ON user_limitations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_body_measurements
CREATE TABLE user_body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  measured_at DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC(6,2),
  waist_cm NUMERIC(6,2),
  chest_cm NUMERIC(6,2),
  body_fat_pct NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE user_body_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their body measurements"
  ON user_body_measurements FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
