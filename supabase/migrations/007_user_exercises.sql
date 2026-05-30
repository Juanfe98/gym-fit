-- Migration: 007_user_exercises
-- User-owned custom exercise names for fast workout logging autocomplete.

CREATE TABLE user_exercises (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users,
  name            TEXT NOT NULL,
  normalized_name TEXT NOT NULL,
  use_count       INT NOT NULL DEFAULT 0 CHECK (use_count >= 0),
  last_used_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, normalized_name),
  CHECK (char_length(trim(name)) BETWEEN 1 AND 120),
  CHECK (char_length(trim(normalized_name)) BETWEEN 1 AND 120)
);

CREATE INDEX user_exercises_user_last_used_idx
  ON user_exercises (user_id, last_used_at DESC NULLS LAST, use_count DESC);

CREATE INDEX user_exercises_user_name_idx
  ON user_exercises (user_id, normalized_name);

ALTER TABLE user_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their custom exercises"
  ON user_exercises FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER user_exercises_updated_at
  BEFORE UPDATE ON user_exercises
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION track_user_exercise(p_name TEXT)
RETURNS TABLE(id UUID, name TEXT)
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  clean_name TEXT;
  normalized TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  clean_name := regexp_replace(trim(p_name), '\s+', ' ', 'g');
  normalized := lower(clean_name);

  IF char_length(clean_name) < 1 OR char_length(clean_name) > 120 THEN
    RAISE EXCEPTION 'Exercise name must be between 1 and 120 characters';
  END IF;

  RETURN QUERY
  INSERT INTO user_exercises AS ue (user_id, name, normalized_name, use_count, last_used_at)
  VALUES (auth.uid(), clean_name, normalized, 1, now())
  ON CONFLICT (user_id, normalized_name) DO UPDATE
    SET name = EXCLUDED.name,
        use_count = ue.use_count + 1,
        last_used_at = now(),
        updated_at = now()
  RETURNING ue.id, ue.name;
END;
$$;
