import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileOverviewScreen } from '@/modules/profile'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <ProfileOverviewScreen
      userId={user.id}
      displayName={user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? ''}
      avatarUrl={user.user_metadata?.avatar_url ?? null}
    />
  )
}
