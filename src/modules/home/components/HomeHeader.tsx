'use client'

import Link from 'next/link'
import { Flame } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { useTrainingStats } from '@/modules/workout-history/hooks/use-training-stats'

type Props = {
  displayName: string
  avatarUrl: string | null
  userId: string
}

export function HomeHeader({ displayName, avatarUrl, userId }: Props) {
  const { t, lang } = useI18n()
  const { data } = useTrainingStats(userId)

  const today = new Intl.DateTimeFormat(lang, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date())

  const streak = data?.currentStreakDays ?? 0
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <header className="flex items-center justify-between gap-3 px-4 pt-6 pb-2">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-xs uppercase tracking-wide text-gym-muted">{today}</p>
        <p className="heading text-2xl text-gym-text">
          {t('homeGreeting', { name: displayName })}
        </p>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gym-pr/15 px-2.5 py-0.5 text-xs font-semibold text-gym-pr">
          <Flame className="h-3.5 w-3.5" aria-hidden="true" />
          {streak > 0 ? t('streakDays', { count: streak }) : t('streakNone')}
        </span>
      </div>

      <Link
        href="/profile"
        aria-label={t('profileTitle')}
        className="focus-ring shrink-0 rounded-full"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="h-11 w-11 rounded-full object-cover" />
        ) : (
          <span className="metric flex h-11 w-11 items-center justify-center rounded-full bg-gym-surface-2 text-lg text-gym-text">
            {initial}
          </span>
        )}
      </Link>
    </header>
  )
}
