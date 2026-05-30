'use client'

import { Dumbbell, Flame, BarChart3, Clock } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { SectionLabel, StatTile } from '@/components/ui'
import { useTrainingStats } from '@/modules/workout-history/hooks/use-training-stats'
import { relativeDay } from '@/lib/format'
import { useRecentWorkoutsList } from '../hooks/use-recent-workouts-list'

type Props = { userId: string }

export function ProgressSnapshotCard({ userId }: Props) {
  const { t } = useI18n()
  const { data: stats, isLoading: statsLoading } = useTrainingStats(userId)
  const { data: recent, isLoading: recentLoading } = useRecentWorkoutsList(userId, 5)

  const isLoading = statsLoading || recentLoading

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="h-4 w-28 animate-pulse rounded bg-gym-surface-2" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[72px] animate-pulse rounded-xl bg-gym-surface-2" />
          ))}
        </div>
      </div>
    )
  }

  if (!stats || stats.totalWorkouts === 0) {
    return (
      <section>
        <SectionLabel className="mb-3">{t('dashboardProgressTitle')}</SectionLabel>
        <div className="card p-4">
          <p className="text-sm text-gym-muted">{t('dashboardProgressEmpty')}</p>
        </div>
      </section>
    )
  }

  const lastWorkout = recent?.[0]
  let lastLabel = '—'
  if (lastWorkout) {
    const rel = relativeDay(lastWorkout.startedAt)
    lastLabel = rel.key === 'timeAgoDays' ? t(rel.key, { count: rel.count }) : t(rel.key)
  }

  return (
    <section aria-label={t('dashboardProgressTitle')}>
      <SectionLabel className="mb-3">{t('dashboardProgressTitle')}</SectionLabel>
      <div className="grid grid-cols-2 gap-3">
        <StatTile
          label={t('dashboardWorkoutsThisWeek')}
          value={stats.weekWorkouts}
          Icon={Dumbbell}
          accentClass="text-gym-accent"
        />
        <StatTile
          label={t('dashboardCurrentStreak')}
          value={stats.currentStreakDays}
          Icon={Flame}
          accentClass="text-gym-pr"
        />
        <StatTile
          label={t('dashboardTotalWorkouts')}
          value={stats.totalWorkouts}
          Icon={BarChart3}
          accentClass="text-goal-conditioning"
        />
        <StatTile
          label={t('dashboardLastWorkout')}
          value={lastLabel}
          Icon={Clock}
          accentClass="text-goal-muscle"
        />
      </div>
    </section>
  )
}
