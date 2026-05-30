import { createClient } from '@/lib/supabase/client'
import {
  isExperienceLevel,
  isMainGoal,
  isWeeklyWorkoutDays,
  isWorkoutDurationMinutes,
  type EquipmentItem,
  type ExperienceLevel,
  type MainGoal,
  type WeeklyWorkoutDays,
  type WorkoutDurationMinutes,
} from '../types'

async function getAuthenticatedUserId() {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) throw error
  if (!user) throw new Error('User not authenticated')

  return { supabase, userId: user.id, user }
}

export async function saveMainGoal(mainGoal: MainGoal) {
  if (!isMainGoal(mainGoal)) {
    throw new Error('Invalid main goal')
  }

  const { supabase, user } = await getAuthenticatedUserId()

  const { error } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      mainGoal,
    },
  })

  if (error) throw error
}

export async function getExperienceLevel(): Promise<ExperienceLevel | null> {
  const { supabase, userId } = await getAuthenticatedUserId()
  const { data, error } = await supabase
    .from('user_fitness_preferences')
    .select('experience_level')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error

  return isExperienceLevel(data?.experience_level) ? data.experience_level : null
}

export async function saveExperienceLevel(experienceLevel: ExperienceLevel) {
  if (!isExperienceLevel(experienceLevel)) {
    throw new Error('Invalid experience level')
  }

  const { supabase, userId } = await getAuthenticatedUserId()
  const { data: existing, error: readError } = await supabase
    .from('user_fitness_preferences')
    .select('fitness_goal, days_per_week, session_duration_minutes, preferred_days, height_unit, weight_unit')
    .eq('user_id', userId)
    .maybeSingle()

  if (readError) throw readError

  const { error } = await supabase
    .from('user_fitness_preferences')
    .upsert(
      {
        user_id: userId,
        fitness_goal: existing?.fitness_goal ?? null,
        experience_level: experienceLevel,
        days_per_week: existing?.days_per_week ?? null,
        session_duration_minutes: existing?.session_duration_minutes ?? null,
        preferred_days: existing?.preferred_days ?? [],
        height_unit: existing?.height_unit ?? 'cm',
        weight_unit: existing?.weight_unit ?? 'kg',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

  if (error) throw error
}

export async function saveWeeklyWorkoutDays(weeklyWorkoutDays: WeeklyWorkoutDays) {
  if (!isWeeklyWorkoutDays(weeklyWorkoutDays)) {
    throw new Error('Invalid weekly workout days')
  }

  const { supabase, userId } = await getAuthenticatedUserId()
  const { data: existing, error: readError } = await supabase
    .from('user_fitness_preferences')
    .select('fitness_goal, experience_level, session_duration_minutes, preferred_days, height_unit, weight_unit')
    .eq('user_id', userId)
    .maybeSingle()

  if (readError) throw readError

  const { error } = await supabase
    .from('user_fitness_preferences')
    .upsert(
      {
        user_id: userId,
        fitness_goal: existing?.fitness_goal ?? null,
        experience_level: existing?.experience_level ?? null,
        days_per_week: weeklyWorkoutDays,
        session_duration_minutes: existing?.session_duration_minutes ?? null,
        preferred_days: existing?.preferred_days ?? [],
        height_unit: existing?.height_unit ?? 'cm',
        weight_unit: existing?.weight_unit ?? 'kg',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

  if (error) throw error
}

export async function saveSessionDuration(minutes: WorkoutDurationMinutes) {
  if (!isWorkoutDurationMinutes(minutes)) {
    throw new Error('Invalid session duration')
  }

  const { supabase, userId } = await getAuthenticatedUserId()
  const { data: existing, error: readError } = await supabase
    .from('user_fitness_preferences')
    .select('fitness_goal, experience_level, days_per_week, preferred_days, height_unit, weight_unit')
    .eq('user_id', userId)
    .maybeSingle()

  if (readError) throw readError

  const { error } = await supabase
    .from('user_fitness_preferences')
    .upsert(
      {
        user_id: userId,
        fitness_goal: existing?.fitness_goal ?? null,
        experience_level: existing?.experience_level ?? null,
        days_per_week: existing?.days_per_week ?? null,
        session_duration_minutes: minutes,
        preferred_days: existing?.preferred_days ?? [],
        height_unit: existing?.height_unit ?? 'cm',
        weight_unit: existing?.weight_unit ?? 'kg',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

  if (error) throw error
}

export type BodyInfoInput = {
  age?: number
  heightCm?: number
  weightKg?: number
  heightUnit: 'cm' | 'in'
  weightUnit: 'kg' | 'lb'
}

export async function saveBodyInfo({ age, heightCm, weightKg, heightUnit, weightUnit }: BodyInfoInput) {
  const { supabase, userId, user } = await getAuthenticatedUserId()

  const saves: Promise<void>[] = []

  if (age !== undefined) {
    saves.push(
      (async () => {
        const { error } = await supabase.auth.updateUser({ data: { ...user.user_metadata, age } })
        if (error) throw error
      })()
    )
  }

  if (heightCm !== undefined || weightKg !== undefined) {
    saves.push(
      (async () => {
        const { error } = await supabase
          .from('user_body_info')
          .upsert(
            {
              user_id: userId,
              ...(heightCm !== undefined && { height_cm: heightCm }),
              ...(weightKg !== undefined && { weight_kg: weightKg }),
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          )
        if (error) throw error
      })()
    )
  }

  const { data: existing, error: readError } = await supabase
    .from('user_fitness_preferences')
    .select('fitness_goal, experience_level, days_per_week, session_duration_minutes, preferred_days')
    .eq('user_id', userId)
    .maybeSingle()

  if (readError) throw readError

  saves.push(
    (async () => {
      const { error } = await supabase
        .from('user_fitness_preferences')
        .upsert(
          {
            user_id: userId,
            fitness_goal: existing?.fitness_goal ?? null,
            experience_level: existing?.experience_level ?? null,
            days_per_week: existing?.days_per_week ?? null,
            session_duration_minutes: existing?.session_duration_minutes ?? null,
            preferred_days: existing?.preferred_days ?? [],
            height_unit: heightUnit,
            weight_unit: weightUnit,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )
      if (error) throw error
    })()
  )

  await Promise.all(saves)
}

export async function completeOnboarding() {
  const { supabase, user, userId } = await getAuthenticatedUserId()

  const [prefsResult, equipmentResult] = await Promise.all([
    supabase
      .from('user_fitness_preferences')
      .select('experience_level, days_per_week, session_duration_minutes')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('user_equipment')
      .select('equipment_items')
      .eq('user_id', userId)
      .maybeSingle(),
  ])

  const prefs = prefsResult.data
  const equipment = equipmentResult.data

  const missingRequired =
    !user.user_metadata?.mainGoal ||
    !prefs?.experience_level ||
    !prefs?.days_per_week ||
    !prefs?.session_duration_minutes ||
    !Array.isArray(equipment?.equipment_items) ||
    equipment.equipment_items.length === 0

  if (missingRequired) {
    throw new Error('Please complete all required steps before finishing setup.')
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      onboarding_status: 'completed',
      onboarding_completed_at: new Date().toISOString(),
    },
  })
  if (error) throw error
}

export async function saveLimitations(areas: string[], notes?: string) {
  const { supabase, userId } = await getAuthenticatedUserId()

  const description = notes?.trim() || null
  const rows = areas.map((area) => ({ user_id: userId, affected_area: area, description }))

  // Record timestamp before inserting so we can safely delete only the old rows.
  const cutoff = new Date().toISOString()

  // Insert new rows first — if this fails, existing data is untouched.
  if (rows.length > 0) {
    const { error: insertError } = await supabase.from('user_limitations').insert(rows)
    if (insertError) throw insertError
  }

  // Delete rows that existed before this save. New rows have created_at >= cutoff.
  const { error: deleteError } = await supabase
    .from('user_limitations')
    .delete()
    .eq('user_id', userId)
    .lt('created_at', cutoff)

  if (deleteError) throw deleteError
}

export async function saveEquipment(items: EquipmentItem[]) {
  if (!items.length) {
    throw new Error('At least one equipment item is required')
  }

  const preset = items.includes('full-gym')
    ? 'full_gym'
    : items.length === 1 && items[0] === 'bodyweight-only'
      ? 'bodyweight'
      : 'custom'

  const { supabase, userId } = await getAuthenticatedUserId()

  const { error } = await supabase
    .from('user_equipment')
    .upsert(
      {
        user_id: userId,
        preset,
        equipment_items: items,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

  if (error) throw error
}
