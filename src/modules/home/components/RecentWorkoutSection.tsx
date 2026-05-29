'use client'

import { useI18n } from '@/i18n/client'
import { useRecentWorkout } from '../hooks/use-recent-workout'
import { RecentWorkoutSkeleton } from './RecentWorkoutSkeleton'
import { RecentWorkoutCard } from './RecentWorkoutCard'

type Props = {
  userId: string
}

export function RecentWorkoutSection({ userId }: Props) {
  const { t } = useI18n()
  const { data, isLoading, isError, refetch } = useRecentWorkout(userId)

  if (isLoading) return <RecentWorkoutSkeleton />

  if (isError) {
    return (
      <div className="rounded-xl border border-gym-border bg-gym-surface-2 p-4 text-center">
        <p className="text-sm text-gym-muted mb-3">{t('homeRecentWorkoutError')}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-sm font-semibold text-gym-accent"
        >
          {t('homeRetry')}
        </button>
      </div>
    )
  }

  if (data === null || data === undefined) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gym-muted">{t('historyEmpty')}</p>
        <p className="text-xs text-gym-muted mt-1">{t('historyEmptyCtaStart')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium uppercase tracking-wide text-gym-muted">
        {t('homeRecentWorkoutLabel')}
      </p>
      <RecentWorkoutCard session={data} />
    </div>
  )
}
