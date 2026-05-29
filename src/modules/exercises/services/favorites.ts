import { createClient } from '@/lib/supabase/client'

export async function getFavorites(userId: string): Promise<string[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_exercise_favorites')
    .select('exercise_id')
    .eq('user_id', userId)
  if (error) throw error
  return data.map((row) => row.exercise_id)
}

export async function addFavorite(userId: string, exerciseId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('user_exercise_favorites')
    .insert({ user_id: userId, exercise_id: exerciseId })
  if (error) throw error
}

export async function removeFavorite(userId: string, exerciseId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('user_exercise_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
  if (error) throw error
}
