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
      total_volume: session.totalVolume,
      pr_count: session.prCount,
      notes: session.notes ?? null,
      source_plan_id: session.sourcePlanId ?? null,
      source_workout_day_id: session.sourceWorkoutDayId ?? null,
      source_plan_name: session.sourcePlanName ?? null,
      source_day_name: session.sourceDayName ?? null,
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
    personalRecords: (() => {
      const best = new Map<string, { weight: number; set: typeof session.exercises[0]['sets'][0]; exerciseId: string }>()
      for (const ex of session.exercises) {
        for (const s of ex.sets) {
          if (!s.isPr) continue
          const existing = best.get(ex.exerciseId)
          if (!existing || s.weight > existing.weight) {
            best.set(ex.exerciseId, { weight: s.weight, set: s, exerciseId: ex.exerciseId })
          }
        }
      }
      return Array.from(best.values()).map(({ set: s, exerciseId }) => ({
        user_id: session.userId,
        exercise_id: exerciseId,
        max_weight: s.weight,
        max_weight_unit: s.weightUnit,
        achieved_at: new Date(s.loggedAt).toISOString(),
        set_log_id: s.id,
      }))
    })(),
  }
}
