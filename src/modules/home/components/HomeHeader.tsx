'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { createClient } from '@/lib/supabase/client'

type Props = {
  displayName: string
}

export function HomeHeader({ displayName }: Props) {
  const { t } = useI18n()
  const router = useRouter()

  async function handleSignOut() {
    await createClient().auth.signOut()
    router.push('/login')
  }

  return (
    <header className="flex items-center justify-between px-4 pt-6 pb-2">
      <p className="text-base font-semibold text-gym-text">
        {t('homeGreeting', { name: displayName })}
      </p>
      <button
        type="button"
        onClick={handleSignOut}
        className="flex items-center gap-1.5 text-xs text-gym-muted"
        aria-label={t('signOut')}
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        <span>{t('signOut')}</span>
      </button>
    </header>
  )
}
