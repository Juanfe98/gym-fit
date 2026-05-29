import { createClient } from '@/lib/supabase/server'
import { HomeHeader, StartWorkoutCTA, RecentWorkoutSection } from '@/modules/home'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user!.id
  const displayName =
    user!.user_metadata?.full_name ?? user!.email?.split('@')[0] ?? 'User'

  return (
    <>
      <HomeHeader displayName={displayName} />
      <div className="flex flex-col gap-6 px-4 pt-4 pb-4">
        <StartWorkoutCTA />
        <RecentWorkoutSection userId={userId} />
      </div>
    </>
  )
}
