'use server'

import { createClient } from '@/lib/supabase/server'

export interface SyncSessionPayload {
  session: {
    id: string
    user_id: string
    status: 'completed'
    started_at: string
    finished_at: string
    duration_seconds: number
    total_volume: number
    pr_count: number
    notes: string | null
    source_plan_id: string | null
    source_workout_day_id: string | null
    source_plan_name: string | null
    source_day_name: string | null
    sync_status: 'synced'
  }
  exercises: Array<{
    id: string
    session_id: string
    exercise_id: string
    exercise_name_snapshot: string
    display_order: number
    notes: string | null
    was_replaced: boolean
    original_exercise_id: string | null
  }>
  sets: Array<{
    id: string
    session_exercise_id: string
    set_number: number
    weight: number | null
    weight_unit: 'kg' | 'lbs'
    reps: number | null
    set_type: 'normal' | 'warmup' | 'dropset'
    rpe: number | null
    is_completed: boolean
    is_pr: boolean
    notes: string | null
    logged_at: string
  }>
  personalRecords: Array<{
    user_id: string
    exercise_id: string
    max_weight: number
    max_weight_unit: 'kg' | 'lbs'
    achieved_at: string
    set_log_id: string | null
  }>
}

export interface SyncResult {
  success: boolean
  error?: string
}

export async function syncCompletedSession(payload: SyncSessionPayload): Promise<SyncResult> {
  const supabase = await createClient()

  const { error: sessionErr } = await supabase
    .from('workout_sessions')
    .upsert(payload.session, { onConflict: 'id' })
  if (sessionErr) return { success: false, error: sessionErr.message }

  if (payload.exercises.length > 0) {
    const { error: exErr } = await supabase
      .from('session_exercises')
      .upsert(payload.exercises, { onConflict: 'id' })
    if (exErr) return { success: false, error: exErr.message }
  }

  if (payload.sets.length > 0) {
    const { error: setsErr } = await supabase
      .from('set_logs')
      .upsert(payload.sets, { onConflict: 'id' })
    if (setsErr) return { success: false, error: setsErr.message }
  }

  if (payload.personalRecords.length > 0) {
    const { error: prErr } = await supabase.from('personal_records').upsert(
      payload.personalRecords,
      {
        onConflict: 'user_id,exercise_id',
        ignoreDuplicates: false,
      }
    )
    if (prErr) return { success: false, error: prErr.message }
  }

  return { success: true }
}

export async function upsertSetLog(
  setLog: SyncSessionPayload['sets'][number]
): Promise<SyncResult> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('set_logs')
    .upsert(setLog, { onConflict: 'id' })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function deleteSetLog(setLogId: string): Promise<SyncResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('set_logs').delete().eq('id', setLogId)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

