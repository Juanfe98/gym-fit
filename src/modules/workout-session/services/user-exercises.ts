import { createClient } from '@/lib/supabase/client'
import { generateId } from '../utils/idempotency'

export interface UserExerciseSuggestion {
  id: string
  name: string
  useCount: number
  lastUsedAt: string | null
}

export interface ExerciseRef {
  exerciseId: string
  exerciseNameSnapshot: string
}

export function normalizeExerciseName(name: string) {
  return name.trim().replace(/\s+/g, ' ')
}

export async function searchUserExercises(query: string): Promise<UserExerciseSuggestion[]> {
  const supabase = createClient()
  const normalizedQuery = normalizeExerciseName(query).toLowerCase()

  let request = supabase
    .from('user_exercises')
    .select('id, name, use_count, last_used_at')
    .order('use_count', { ascending: false })
    .order('last_used_at', { ascending: false, nullsFirst: false })
    .limit(8)

  if (normalizedQuery) {
    request = request.ilike('normalized_name', `%${normalizedQuery}%`)
  }

  const { data, error } = await request
  if (error) throw error

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    useCount: row.use_count,
    lastUsedAt: row.last_used_at,
  }))
}

export async function trackUserExercise(name: string): Promise<ExerciseRef> {
  const cleanName = normalizeExerciseName(name)
  if (!cleanName) throw new Error('Exercise name is required')

  const supabase = createClient()
  const { data, error } = await supabase
    .rpc('track_user_exercise', { p_name: cleanName })
    .single()

  if (error) {
    // Logging should stay fast/offline-tolerant even if Supabase is unavailable.
    return {
      exerciseId: `custom:${generateId()}`,
      exerciseNameSnapshot: cleanName,
    }
  }

  const row = data as { id: string; name: string }

  return {
    exerciseId: row.id,
    exerciseNameSnapshot: row.name,
  }
}
