'use client'

import { Dumbbell, Weight, Flame } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { StatTile } from '@/components/ui'
import { useTrainingStats } from '../hooks/use-training-stats'
import { useVolumeFormat } from '@/modules/workout-session/hooks/use-volume-format'

export function HistorySummary({ userId }: { userId: string }) {
  const { t } = useI18n()
  const { data, isLoading } = useTrainingStats(userId)
  const { unit, formatVolume } = useVolumeFormat()

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-[72px] rounded-xl bg-gym-surface-2 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      <StatTile
        label={t('statWorkouts')}
        value={data.totalWorkouts}
        Icon={Dumbbell}
        accentClass="text-gym-accent"
      />
      <StatTile
        label={t('statVolume')}
        value={formatVolume(data.totalVolume)}
        unit={unit}
        Icon={Weight}
        accentClass="text-goal-strength"
      />
      <StatTile
        label={t('statStreak')}
        value={data.currentStreakDays}
        Icon={Flame}
        accentClass="text-gym-pr"
      />
    </div>
  )
}
