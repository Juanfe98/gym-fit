import { createClient } from '@/lib/supabase/client'
import type { WorkoutPlan, PlanGoal, PlanLevel } from '../types'

type PlanRow = {
  id: string
  user_id: string
  name: string
  description: string | null
  goal: string
  level: string
  duration_weeks: number | null
  days_per_week: number
  is_active: boolean
  is_archived: boolean
  created_at: string
  updated_at: string
}

function mapPlan(row: PlanRow): WorkoutPlan {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    goal: row.goal as PlanGoal,
    level: row.level as PlanLevel,
    durationWeeks: row.duration_weeks,
    daysPerWeek: row.days_per_week,
    isActive: row.is_active,
    isArchived: row.is_archived,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getPlans(userId: string): Promise<WorkoutPlan[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('workout_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as PlanRow[]).map(mapPlan)
}

export async function getPlansWithDayCount(
  userId: string,
): Promise<Array<WorkoutPlan & { dayCount: number }>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('workout_plans')
    .select('*, workout_days(count)')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as Array<PlanRow & { workout_days: Array<{ count: number }> }>).map((row) => ({
    ...mapPlan(row),
    dayCount: row.workout_days[0]?.count ?? 0,
  }))
}

export async function getActivePlan(userId: string): Promise<WorkoutPlan | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('workout_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data ? mapPlan(data as PlanRow) : null
}

export async function getPlan(planId: string): Promise<WorkoutPlan | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('workout_plans')
    .select('*')
    .eq('id', planId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data ? mapPlan(data as PlanRow) : null
}

export async function createPlan(
  userId: string,
  data: Omit<WorkoutPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
): Promise<WorkoutPlan> {
  const supabase = createClient()
  const { data: row, error } = await supabase
    .from('workout_plans')
    .insert({
      user_id: userId,
      name: data.name,
      description: data.description,
      goal: data.goal,
      level: data.level,
      duration_weeks: data.durationWeeks,
      days_per_week: data.daysPerWeek,
      is_active: data.isActive,
      is_archived: data.isArchived,
    })
    .select()
    .single()
  if (error) throw error
  return mapPlan(row as PlanRow)
}

export async function updatePlan(
  planId: string,
  data: Partial<WorkoutPlan>,
): Promise<void> {
  const supabase = createClient()
  const update: Partial<PlanRow> = {}
  if (data.name !== undefined) update.name = data.name
  if (data.description !== undefined) update.description = data.description
  if (data.goal !== undefined) update.goal = data.goal
  if (data.level !== undefined) update.level = data.level
  if (data.durationWeeks !== undefined) update.duration_weeks = data.durationWeeks
  if (data.daysPerWeek !== undefined) update.days_per_week = data.daysPerWeek
  if (data.isActive !== undefined) update.is_active = data.isActive
  if (data.isArchived !== undefined) update.is_archived = data.isArchived
  const { error } = await supabase.from('workout_plans').update(update).eq('id', planId)
  if (error) throw error
}

export async function activatePlan(userId: string, planId: string): Promise<void> {
  const supabase = createClient()
  const { error: deactivateError } = await supabase
    .from('workout_plans')
    .update({ is_active: false })
    .eq('user_id', userId)
  if (deactivateError) throw deactivateError
  const { error } = await supabase
    .from('workout_plans')
    .update({ is_active: true })
    .eq('id', planId)
  if (error) throw error
}

export async function deactivatePlan(planId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('workout_plans')
    .update({ is_active: false })
    .eq('id', planId)
  if (error) throw error
}

export async function archivePlan(planId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('workout_plans')
    .update({ is_archived: true, is_active: false })
    .eq('id', planId)
  if (error) throw error
}

export async function duplicatePlan(userId: string, sourcePlanId: string): Promise<WorkoutPlan> {
  const source = await getPlan(sourcePlanId)
  if (!source) throw new Error('Source plan not found')
  return createPlan(userId, {
    name: `${source.name} (copy)`,
    description: source.description,
    goal: source.goal,
    level: source.level,
    durationWeeks: source.durationWeeks,
    daysPerWeek: source.daysPerWeek,
    isActive: false,
    isArchived: false,
  })
}
