import { createClient } from '@/lib/supabase/client'
import { isMainGoal, type MainGoal } from '../types'

export async function saveMainGoal(mainGoal: MainGoal) {
  if (!isMainGoal(mainGoal)) {
    throw new Error('Invalid main goal')
  }

  const supabase = createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) throw userError
  if (!user) throw new Error('User not authenticated')

  const { error } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      mainGoal,
    },
  })

  if (error) throw error
}
