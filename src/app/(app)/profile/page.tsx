'use client'

import { useI18n } from '@/i18n/client'

export default function ProfilePage() {
  const { t } = useI18n()

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm text-gym-muted">{t('profileComingSoon')}</p>
    </main>
  )
}
