'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/client'

export function StartWorkoutCTA() {
  const { t } = useI18n()

  return (
    <Link
      href="/workout"
      className="flex h-11 w-full items-center justify-center rounded-lg bg-gym-accent font-semibold text-white active:scale-[0.98] transition-all"
    >
      {t('startWorkout')}
    </Link>
  )
}
