'use client'

import { useI18n } from '@/i18n/client'
import type { WorkoutHistorySummary } from '@/modules/workout-history/types'

type Props = {
  session: WorkoutHistorySummary
}

export function RecentWorkoutCard({ session }: Props) {
  const { t } = useI18n()

  const date = new Date(session.startedAt).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const durationMin = Math.round(session.durationSeconds / 60)

  return (
    <div className="rounded-xl border border-gym-border bg-gym-surface-2 p-4">
      <p className="text-sm font-semibold text-gym-text mb-3">{date}</p>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div>
          <p className="text-xs text-gym-muted">{t('duration')}</p>
          <p className="text-sm font-semibold text-gym-text">{durationMin}m</p>
        </div>
        <div>
          <p className="text-xs text-gym-muted">{t('volume')}</p>
          <p className="text-sm font-semibold text-gym-text">
            {session.totalVolume != null ? session.totalVolume : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gym-muted">{t('sets')}</p>
          <p className="text-sm font-semibold text-gym-text">{session.totalSets}</p>
        </div>
        <div>
          <p className="text-xs text-gym-muted">{t('exercises')}</p>
          <p className="text-sm font-semibold text-gym-text">{session.exerciseCount}</p>
        </div>
      </div>
    </div>
  )
}
