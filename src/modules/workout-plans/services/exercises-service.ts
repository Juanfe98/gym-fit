import { createClient } from '@/lib/supabase/client'
import type { PlanExercise } from '../types'

type ExerciseRow = {
  id: string
  day_id: string
  exercise_id: string
  display_order: number
  target_sets: number | null
  target_reps: number | null
  target_rep_range_min: number | null
  target_rep_range_max: number | null
  target_weight: number | null
  rest_seconds: number | null
  tempo: string | null
  target_rpe: number | null
  notes: string | null
}

function mapExercise(row: ExerciseRow): PlanExercise {
  return {
    id: row.id,
    dayId: row.day_id,
    exerciseId: row.exercise_id,
    displayOrder: row.display_order,
    targetSets: row.target_sets,
    targetReps: row.target_reps,
    targetRepRangeMin: row.target_rep_range_min,
    targetRepRangeMax: row.target_rep_range_max,
    targetWeight: row.target_weight,
    restSeconds: row.rest_seconds,
    tempo: row.tempo,
    targetRpe: row.target_rpe,
    notes: row.notes,
  }
}

export async function getPlanExercises(dayId: string): Promise<PlanExercise[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('plan_exercises')
    .select('*')
    .eq('day_id', dayId)
    .order('display_order', { ascending: true })
  if (error) throw error
  return (data as ExerciseRow[]).map(mapExercise)
}

export async function addPlanExercise(
  dayId: string,
  data: Omit<PlanExercise, 'id' | 'dayId'>,
): Promise<PlanExercise> {
  const supabase = createClient()
  const { data: row, error } = await supabase
    .from('plan_exercises')
    .insert({
      day_id: dayId,
      exercise_id: data.exerciseId,
      display_order: data.displayOrder,
      target_sets: data.targetSets,
      target_reps: data.targetReps,
      target_rep_range_min: data.targetRepRangeMin,
      target_rep_range_max: data.targetRepRangeMax,
      target_weight: data.targetWeight,
      rest_seconds: data.restSeconds,
      tempo: data.tempo,
      target_rpe: data.targetRpe,
      notes: data.notes,
    })
    .select()
    .single()
  if (error) throw error
  return mapExercise(row as ExerciseRow)
}

export async function updatePlanExercise(
  exerciseId: string,
  data: Partial<PlanExercise>,
): Promise<void> {
  const supabase = createClient()
  const update: Partial<ExerciseRow> = {}
  if (data.displayOrder !== undefined) update.display_order = data.displayOrder
  if (data.targetSets !== undefined) update.target_sets = data.targetSets
  if (data.targetReps !== undefined) update.target_reps = data.targetReps
  if (data.targetRepRangeMin !== undefined) update.target_rep_range_min = data.targetRepRangeMin
  if (data.targetRepRangeMax !== undefined) update.target_rep_range_max = data.targetRepRangeMax
  if (data.targetWeight !== undefined) update.target_weight = data.targetWeight
  if (data.restSeconds !== undefined) update.rest_seconds = data.restSeconds
  if (data.tempo !== undefined) update.tempo = data.tempo
  if (data.targetRpe !== undefined) update.target_rpe = data.targetRpe
  if (data.notes !== undefined) update.notes = data.notes
  const { error } = await supabase.from('plan_exercises').update(update).eq('id', exerciseId)
  if (error) throw error
}

export async function removePlanExercise(exerciseId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('plan_exercises').delete().eq('id', exerciseId)
  if (error) throw error
}

export async function reorderPlanExercises(
  updates: Array<{ id: string; displayOrder: number }>,
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('plan_exercises')
    .upsert(updates.map((u) => ({ id: u.id, display_order: u.displayOrder })))
  if (error) throw error
}
