-- Migration: 002_workout_sessions_summary
-- Adds pre-computed summary columns to workout_sessions for history list display.
-- total_volume: sum of (weight × reps) for non-warmup completed sets, written at sync time.
-- pr_count: number of personal records achieved in the session, written at sync time.

ALTER TABLE workout_sessions
  ADD COLUMN total_volume NUMERIC(10, 2),
  ADD COLUMN pr_count     INT NOT NULL DEFAULT 0;
