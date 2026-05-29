'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/client'
import { AuthFormWrapper } from '@/modules/auth'

export default function SessionExpiredPage() {
  const { t } = useI18n()

  return (
    <AuthFormWrapper>
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex flex-col gap-2">
          <h2 className="heading text-xl text-gym-text">{t('sessionExpiredTitle')}</h2>
          <p className="text-sm text-gym-muted">{t('sessionExpiredBody')}</p>
        </div>
        <Link
          href="/login"
          className="glow-accent flex h-11 w-full items-center justify-center rounded-lg bg-gym-accent font-semibold text-white transition-all hover:bg-orange-600 active:scale-[0.98]"
        >
          {t('signInAgain')}
        </Link>
      </div>
    </AuthFormWrapper>
  )
}
