import { createClient } from '@/lib/supabase/client'
import type { WorkoutDay, WorkoutDayWithCount } from '../types'

type DayRow = {
  id: string
  plan_id: string
  name: string
  day_order: number
  target_muscle_groups: string[]
}

function mapDay(row: DayRow): WorkoutDay {
  return {
    id: row.id,
    planId: row.plan_id,
    name: row.name,
    dayOrder: row.day_order,
    targetMuscleGroups: row.target_muscle_groups,
  }
}

export async function getDayById(dayId: string): Promise<WorkoutDay | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('workout_days')
    .select('*')
    .eq('id', dayId)
    .maybeSingle()
  if (error) throw error
  return data ? mapDay(data as DayRow) : null
}

export async function getDays(planId: string): Promise<WorkoutDay[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('workout_days')
    .select('*')
    .eq('plan_id', planId)
    .order('day_order', { ascending: true })
  if (error) throw error
  return (data as DayRow[]).map(mapDay)
}

export async function getDaysWithCount(planId: string): Promise<WorkoutDayWithCount[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('workout_days')
    .select('*, plan_exercises(count)')
    .eq('plan_id', planId)
    .order('day_order', { ascending: true })
  if (error) throw error
  return (data as Array<DayRow & { plan_exercises: Array<{ count: number }> }>).map((row) => ({
    ...mapDay(row),
    exerciseCount: row.plan_exercises[0]?.count ?? 0,
  }))
}

export async function addDay(
  planId: string,
  data: Pick<WorkoutDay, 'name' | 'dayOrder' | 'targetMuscleGroups'>,
): Promise<WorkoutDay> {
  const supabase = createClient()
  const { data: row, error } = await supabase
    .from('workout_days')
    .insert({
      plan_id: planId,
      name: data.name,
      day_order: data.dayOrder,
      target_muscle_groups: data.targetMuscleGroups,
    })
    .select()
    .single()
  if (error) throw error
  return mapDay(row as DayRow)
}

export async function updateDay(
  dayId: string,
  data: Partial<Pick<WorkoutDay, 'name' | 'dayOrder' | 'targetMuscleGroups'>>,
): Promise<void> {
  const supabase = createClient()
  const update: Partial<DayRow> = {}
  if (data.name !== undefined) update.name = data.name
  if (data.dayOrder !== undefined) update.day_order = data.dayOrder
  if (data.targetMuscleGroups !== undefined) update.target_muscle_groups = data.targetMuscleGroups
  const { error } = await supabase.from('workout_days').update(update).eq('id', dayId)
  if (error) throw error
}

export async function removeDay(dayId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('workout_days').delete().eq('id', dayId)
  if (error) throw error
}
