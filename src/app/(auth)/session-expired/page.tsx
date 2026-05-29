'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/client'

export default function SessionExpiredPage() {
  const { t } = useI18n()

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold text-gym-text">{t('sessionExpiredTitle')}</h1>
          <p className="text-sm text-gym-muted">{t('sessionExpiredBody')}</p>
        </div>
        <Link
          href="/login"
          className="flex h-11 w-full items-center justify-center rounded-lg bg-gym-accent font-semibold text-white"
        >
          {t('signInAgain')}
        </Link>
      </div>
    </main>
  )
}
