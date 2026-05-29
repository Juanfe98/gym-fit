import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/modules/home'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const shellUser = {
    id: user.id,
    displayName: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User',
    avatarUrl: user.user_metadata?.avatar_url ?? null,
  }

  return (
    <AppShell user={shellUser}>
      {children}
    </AppShell>
  )
}
