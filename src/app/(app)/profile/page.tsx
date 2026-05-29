import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileScreen } from '@/modules/profile'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <ProfileScreen
      user={{
        id: user.id,
        displayName:
          user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User',
        email: user.email ?? '',
        avatarUrl: user.user_metadata?.avatar_url ?? null,
        createdAt: user.created_at ?? null,
      }}
    />
  )
}
