'use client'

import Link from 'next/link'
import { Dumbbell, ChevronRight, Target } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { SectionLabel, EmptyState } from '@/components/ui'
import { useActivePlanWidget } from '@/modules/home/hooks/use-active-plan-widget'

type Props = { userId: string }

function Skeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-4 w-28 animate-pulse rounded bg-gym-surface-2" />
      <div className="card-elevated animate-pulse p-4">
        <div className="mb-3 h-6 w-44 rounded bg-gym-surface-3" />
        <div className="mb-2 h-4 w-36 rounded bg-gym-surface-3" />
        <div className="mb-4 h-4 w-20 rounded bg-gym-surface-3" />
        <div className="h-11 w-36 rounded-xl bg-gym-surface-3" />
      </div>
    </div>
  )
}

export function TodayWorkoutCard({ userId }: Props) {
  const { t } = useI18n()
  const { activePlan, days, suggestedDayId, isLoading } = useActivePlanWidget(userId)

  if (isLoading) return <Skeleton />

  if (!activePlan || !suggestedDayId) {
    return (
      <section>
        <SectionLabel className="mb-3">{t('dashboardTodayTitle')}</SectionLabel>
        <div className="card-elevated">
          <EmptyState
            Icon={Target}
            title={t('dashboardNoPlanTitle')}
            message={t('dashboardNoPlanBody')}
            action={
              <Link
                href="/plans/new"
                className="focus-ring inline-flex items-center gap-1.5 rounded-xl bg-gym-accent px-4 py-2 text-sm font-semibold text-white"
              >
                {t('dashboardCreatePlan')}
              </Link>
            }
          />
        </div>
      </section>
    )
  }

  const today = days.find(d => d.id === suggestedDayId)
  if (!today) return null

  const workoutUrl = `/workouts/${today.id}`

  return (
    <section aria-labelledby="today-workout-title">
      <SectionLabel className="mb-3">{t('dashboardTodayTitle')}</SectionLabel>
      <div className="card-elevated flex flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 id="today-workout-title" className="heading text-lg text-gym-text">
              {today.name}
            </h2>
            {today.targetMuscleGroups.length > 0 && (
              <p className="text-sm text-gym-muted">
                {today.targetMuscleGroups.join(' · ')}
              </p>
            )}
          </div>
          <span className="shrink-0 rounded-full bg-gym-accent/15 px-2.5 py-1 text-xs font-semibold text-gym-accent">
            {t('dashboardNextUp')}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gym-muted">
          <span className="flex items-center gap-1.5">
            <Dumbbell className="h-3.5 w-3.5" aria-hidden="true" />
            {t('dashboardExercises', { count: today.exerciseCount })}
          </span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{activePlan.name}</span>
        </div>

        <Link
          href={workoutUrl}
          className="glow-accent focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-gym-accent px-4 py-3 text-sm font-semibold text-white transition-opacity active:opacity-80 sm:w-fit"
        >
          <Dumbbell className="h-4 w-4" aria-hidden="true" />
          {t('dashboardStartWorkoutCta')}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
