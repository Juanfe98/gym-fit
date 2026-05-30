import { createClient } from '@/lib/supabase/client'
import { isExperienceLevel, isMainGoal, type ExperienceLevel, type MainGoal } from '../types'

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
