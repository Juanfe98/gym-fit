import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  WorkoutHistorySummary,
  WorkoutHistoryDetail,
  WorkoutHistoryExercise,
  WorkoutHistorySet,
  DateRangeFilter,
} from '../types'

function dateRangeToStartDate(range: NonNullable<DateRangeFilter>): string {
  const days: Record<NonNullable<DateRangeFilter>, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '180d': 180,
    '365d': 365,
  }
  const d = new Date()
  d.setDate(d.getDate() - days[range])
  return d.toISOString()
}

export type FetchHistoryListResult =
  | { data: WorkoutHistorySummary[]; hasMore: boolean; error: null }
  | { data: null; hasMore: false; error: string }

export async function fetchHistoryList({
  supabase,
  userId,
  dateRange,
  sessionIds,
  cursor,
  limit = 20,
}: {
  supabase: SupabaseClient
  userId: string
  dateRange?: DateRangeFilter
  sessionIds?: string[]
  cursor?: string
  limit?: number
}): Promise<FetchHistoryListResult> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from('workout_sessions')
    .select(`
      id,
      started_at,
      finished_at,
      duration_seconds,
      total_volume,
      pr_count,
      notes,
      source_plan_id,
      session_exercises (
        id,
        set_logs (
          id,
          set_type,
          is_completed
        )
      )
    `)
    .eq('status', 'completed')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(limit + 1)

  if (cursor) query = query.lt('started_at', cursor)
  if (dateRange) query = query.gte('started_at', dateRangeToStartDate(dateRange))
  if (sessionIds?.length) query = query.in('id', sessionIds)

  const { data, error } = await query

  if (error) return { data: null, hasMore: false, error: error.message }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = (data ?? []) as any[]
  const hasMore = rows.length > limit
  const page = rows.slice(0, limit).map((s): WorkoutHistorySummary => ({
    id: s.id,
    startedAt: s.started_at,
    finishedAt: s.finished_at ?? '',
    durationSeconds: s.duration_seconds ?? 0,
    totalVolume: s.total_volume,
    prCount: s.pr_count ?? 0,
    notes: s.notes,
    sourcePlanId: s.source_plan_id,
    exerciseCount: (s.session_exercises ?? []).length,
    totalSets: (s.session_exercises ?? [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .flatMap((e: any) => e.set_logs ?? [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((sl: any) => sl.set_type !== 'warmup' && sl.is_completed)
      .length,
  }))

  return { data: page, hasMore, error: null }
}

export type FetchHistoryDetailResult =
  | { data: WorkoutHistoryDetail; error: null }
  | { data: null; error: string }

export async function fetchHistoryDetail({
  supabase,
  sessionId,
}: {
  supabase: SupabaseClient
  sessionId: string
}): Promise<FetchHistoryDetailResult> {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select(`
      id,
      started_at,
      finished_at,
      duration_seconds,
      total_volume,
      pr_count,
      notes,
      source_plan_id,
      session_exercises (
        id,
        exercise_id,
        exercise_name_snapshot,
        display_order,
        notes,
        was_replaced,
        original_exercise_id,
        set_logs (
          id,
          set_number,
          weight,
          weight_unit,
          reps,
          set_type,
          rpe,
          is_completed,
          is_pr,
          notes
        )
      )
    `)
    .eq('id', sessionId)
    .single()

  if (error) return { data: null, error: error.message }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = data as any
  const detail: WorkoutHistoryDetail = {
    id: s.id,
    startedAt: s.started_at,
    finishedAt: s.finished_at ?? '',
    durationSeconds: s.duration_seconds ?? 0,
    totalVolume: s.total_volume,
    prCount: s.pr_count ?? 0,
    notes: s.notes,
    sourcePlanId: s.source_plan_id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exercises: (s.session_exercises ?? []).sort((a: any, b: any) => a.display_order - b.display_order).map((ex: any): WorkoutHistoryExercise => ({
      id: ex.id,
      exerciseId: ex.exercise_id,
      exerciseNameSnapshot: ex.exercise_name_snapshot,
      displayOrder: ex.display_order,
      notes: ex.notes,
      wasReplaced: ex.was_replaced,
      originalExerciseId: ex.original_exercise_id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sets: (ex.set_logs ?? []).sort((a: any, b: any) => a.set_number - b.set_number).map((sl: any): WorkoutHistorySet => ({
        id: sl.id,
        setNumber: sl.set_number,
        weight: sl.weight,
        weightUnit: sl.weight_unit,
        reps: sl.reps,
        setType: sl.set_type,
        rpe: sl.rpe,
        isCompleted: sl.is_completed,
        isPr: sl.is_pr,
        notes: sl.notes,
      })),
    })),
  }

  return { data: detail, error: null }
}

export type SearchSessionsByExerciseResult =
  | { sessionIds: string[]; error: null }
  | { sessionIds: null; error: string }

export async function searchSessionsByExercise({
  supabase,
  term,
}: {
  supabase: SupabaseClient
  term: string
}): Promise<SearchSessionsByExerciseResult> {
  const { data, error } = await supabase
    .from('session_exercises')
    .select('session_id')
    .ilike('exercise_name_snapshot', `%${term}%`)

  if (error) return { sessionIds: null, error: error.message }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ids = [...new Set((data ?? []).map((r: any) => r.session_id as string))]
  return { sessionIds: ids, error: null }
}
