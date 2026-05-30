'use client'

import Link from 'next/link'
import { Dumbbell, ChevronRight, CheckCircle2, Clock, Zap } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import type { WorkoutDayWithCount } from '@/modules/workout-plans/types'

export type WorkoutStatus = 'not-started' | 'in-progress' | 'completed'

interface Props {
  day: WorkoutDayWithCount
  status: WorkoutStatus
  isNext: boolean
  estimatedMinutes?: number
}

export function WorkoutDayCard({ day, status, isNext, estimatedMinutes }: Props) {
  const { t } = useI18n()

  const ctaHref = `/workouts/${day.id}`
  const ctaLabel =
    status === 'completed'
      ? t('planOverviewView')
      : status === 'in-progress'
      ? t('planOverviewContinue')
      : t('planOverviewStart')

  return (
    <div
      className={`card-elevated flex flex-col gap-3 p-4 transition-all ${
        status === 'completed' ? 'opacity-60' : ''
      } ${isNext && status !== 'completed' ? 'ring-1 ring-gym-accent/30' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="heading text-base text-gym-text">{day.name}</h3>
            {isNext && status !== 'completed' && (
              <span className="shrink-0 rounded-full bg-gym-accent/15 px-2 py-0.5 text-xs font-semibold text-gym-accent">
                {t('planOverviewNextUp')}
              </span>
            )}
            {status === 'in-progress' && (
              <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-400">
                {t('planOverviewStatusInProgress')}
              </span>
            )}
          </div>
          {day.targetMuscleGroups.length > 0 && (
            <p className="truncate text-xs text-gym-muted">
              {day.targetMuscleGroups.join(' · ')}
            </p>
          )}
        </div>
        {status === 'completed' && (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-gym-accent" aria-label="Completed" />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-gym-muted">
        <span className="flex items-center gap-1">
          <Dumbbell className="h-3.5 w-3.5" aria-hidden="true" />
          {t('dashboardExercises', { count: day.exerciseCount })}
        </span>
        {estimatedMinutes && (
          <>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {t('dashboardMinutes', { count: estimatedMinutes })}
            </span>
          </>
        )}
      </div>

      <Link
        href={ctaHref}
        className={`focus-ring inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity active:opacity-80 ${
          status === 'not-started' && isNext
            ? 'glow-accent bg-gym-accent text-white'
            : status === 'in-progress'
            ? 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20'
            : 'bg-gym-surface-2 text-gym-text hover:bg-gym-surface-3'
        }`}
      >
        {status === 'in-progress' && <Zap className="h-3.5 w-3.5" aria-hidden="true" />}
        {ctaLabel}
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  )
}
