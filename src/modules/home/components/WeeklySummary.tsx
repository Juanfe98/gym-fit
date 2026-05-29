'use client'

import { Dumbbell, Weight, Clock } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { SectionLabel, StatTile } from '@/components/ui'
import { useTrainingStats } from '@/modules/workout-history/hooks/use-training-stats'
import { useVolumeFormat } from '@/modules/workout-session/hooks/use-volume-format'
import { formatDuration } from '@/lib/format'

export function WeeklySummary({ userId }: { userId: string }) {
  const { t } = useI18n()
  const { data, isLoading } = useTrainingStats(userId)
  const { unit, formatVolume } = useVolumeFormat()

  return (
    <section className="flex flex-col gap-2">
      <SectionLabel>{t('homeWeekSummary')}</SectionLabel>
      {isLoading || !data ? (
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[72px] rounded-xl bg-gym-surface-2 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <StatTile
            label={t('statWorkouts')}
            value={data.weekWorkouts}
            Icon={Dumbbell}
            accentClass="text-gym-accent"
          />
          <StatTile
            label={t('statVolume')}
            value={formatVolume(data.weekVolume)}
            unit={unit}
            Icon={Weight}
            accentClass="text-goal-strength"
          />
          <StatTile
            label={t('statTimeTrained')}
            value={formatDuration(data.weekDurationSeconds)}
            Icon={Clock}
            accentClass="text-goal-conditioning"
          />
        </div>
      )}
    </section>
  )
}
