import type { FinishedSession } from '../types'
import type { SyncSessionPayload } from '../services/session-supabase'

export function finishedSessionToPayload(session: FinishedSession): SyncSessionPayload {
  return {
    session: {
      id: session.id,
      user_id: session.userId,
      status: 'completed',
      started_at: new Date(session.startedAt).toISOString(),
      finished_at: new Date(session.finishedAt).toISOString(),
      duration_seconds: session.durationSeconds,
      notes: session.notes ?? null,
      source_plan_id: session.sourcePlanId ?? null,
      source_workout_day_id: session.sourceWorkoutDayId ?? null,
      sync_status: 'synced',
    },
    exercises: session.exercises.map((ex) => ({
      id: ex.id,
      session_id: session.id,
      exercise_id: ex.exerciseId,
      exercise_name_snapshot: ex.exerciseNameSnapshot,
      display_order: ex.displayOrder,
      notes: ex.notes ?? null,
      was_replaced: false,
      original_exercise_id: null,
    })),
    sets: session.exercises.flatMap((ex) =>
      ex.sets.map((s) => ({
        id: s.id,
        session_exercise_id: ex.id,
        set_number: s.setNumber,
        weight: s.weight > 0 ? s.weight : null,
        weight_unit: s.weightUnit,
        reps: s.reps > 0 ? s.reps : null,
        set_type: s.setType,
        rpe: s.rpe ?? null,
        is_completed: true,
        is_pr: s.isPr,
        notes: s.notes ?? null,
        logged_at: new Date(s.loggedAt).toISOString(),
      }))
    ),
    personalRecords: session.exercises
      .flatMap((ex) => ex.sets.filter((s) => s.isPr).map((s) => ({ ex, s })))
      .map(({ ex, s }) => ({
        user_id: session.userId,
        exercise_id: ex.exerciseId,
        max_weight: s.weight,
        max_weight_unit: s.weightUnit,
        achieved_at: new Date(s.loggedAt).toISOString(),
        set_log_id: s.id,
      })),
  }
}
