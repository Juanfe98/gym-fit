import { createClient } from '@/lib/supabase/server'
import {
  HomeHeader,
  StartWorkoutCTA,
  WeeklySummary,
  RecentWorkoutSection,
} from '@/modules/home'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user!.id
  const displayName =
    user!.user_metadata?.full_name ?? user!.email?.split('@')[0] ?? 'User'
  const avatarUrl = user!.user_metadata?.avatar_url ?? null

  return (
    <>
      <HomeHeader displayName={displayName} avatarUrl={avatarUrl} userId={userId} />
      <div className="flex flex-col gap-6 px-4 pt-4 pb-4">
        <StartWorkoutCTA userId={userId} />
        <WeeklySummary userId={userId} />
        <RecentWorkoutSection userId={userId} />
      </div>
    </>
  )
}
