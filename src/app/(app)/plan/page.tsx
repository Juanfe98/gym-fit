'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ClipboardList, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/i18n/client'
import { EmptyState, SectionLabel } from '@/components/ui'
import {
  PlanHeader,
  WeeklyMiniGrid,
  WorkoutDayCard,
  RestDayCard,
  PlanSummaryCard,
  usePlanOverview,
} from '@/modules/plan-overview'

export default function PlanPage() {
  const { t } = useI18n()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => setUserId(user?.id ?? null))
  }, [])

  const {
    activePlan,
    days,
    suggestedDayId,
    completedDayIds,
    inProgressDayId,
    weekGrid,
    prefs,
    equipment,
    hasOnboardingData,
    isLoading,
  } = usePlanOverview(userId ?? '')

  if (!userId || isLoading) {
    return (
      <div className="min-h-screen bg-gym-bg px-4 pt-4 pb-20">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="h-8 w-48 animate-pulse rounded bg-gym-surface-2" />
            <div className="h-4 w-72 animate-pulse rounded bg-gym-surface-2" />
          </div>
          <div className="h-12 w-52 animate-pulse rounded-xl bg-gym-surface-2" />
          <div className="card h-24 animate-pulse" />
          <div className="flex flex-col gap-3">
            <div className="card-elevated h-32 animate-pulse" />
            <div className="card-elevated h-32 animate-pulse" />
            <div className="card-elevated h-32 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!hasOnboardingData) {
    return (
      <div className="min-h-screen bg-gym-bg pb-20">
        <div className="card-elevated mx-4 mt-8">
          <EmptyState
            Icon={ClipboardList}
            title={t('planOverviewMissingSetup')}
            message={t('planOverviewMissingSetupDescription')}
            action={
              <Link
                href="/onboarding/goal"
                className="focus-ring inline-flex items-center gap-1.5 rounded-xl bg-gym-accent px-4 py-2.5 text-sm font-semibold text-white"
              >
                {t('planOverviewContinueOnboarding')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  if (!activePlan) {
    return (
      <div className="min-h-screen bg-gym-bg pb-20">
        <div className="px-4 pt-4">
          <h1 className="heading text-2xl text-gym-text">{t('planOverviewTitle')}</h1>
          <p className="mt-1 text-sm text-gym-muted">{t('planOverviewSubtitle')}</p>
        </div>
        <div className="card-elevated mx-4 mt-6">
          <EmptyState
            Icon={ClipboardList}
            title={t('planOverviewNoPlan')}
            message={t('planOverviewNoPlanDescription')}
            action={
              <Link
                href="/plans/new"
                className="glow-accent focus-ring inline-flex items-center gap-1.5 rounded-xl bg-gym-accent px-4 py-2.5 text-sm font-semibold text-white"
              >
                {t('planOverviewCreatePlan')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  const suggestedDay = days.find((d) => d.id === suggestedDayId)
  const restCount = Math.max(0, 7 - days.length)
  const estimatedMinutes = prefs?.session_duration_minutes ?? undefined

  return (
    <div className="min-h-screen bg-gym-bg pb-20">
      <div className="flex flex-col gap-6 px-4 pb-8 pt-4">
        <PlanHeader
          planId={activePlan.id}
          planName={activePlan.name}
          suggestedDayId={suggestedDayId}
          suggestedDayName={suggestedDay?.name ?? null}
        />

        <WeeklyMiniGrid days={weekGrid} isLoading={false} />

        <section aria-label={t('planOverviewWorkoutsTitle')}>
          <SectionLabel className="mb-3">{t('planOverviewWorkoutsTitle')}</SectionLabel>
          <div className="flex flex-col gap-3">
            {days.map((day) => {
              const status =
                completedDayIds.has(day.id)
                  ? 'completed'
                  : inProgressDayId === day.id
                  ? 'in-progress'
                  : 'not-started'

              const isNext = day.id === suggestedDayId && status !== 'completed'

              return (
                <WorkoutDayCard
                  key={day.id}
                  day={day}
                  status={status}
                  isNext={isNext}
                  estimatedMinutes={estimatedMinutes}
                />
              )
            })}
            {restCount > 0 && <RestDayCard count={restCount} />}
          </div>
        </section>

        <PlanSummaryCard prefs={prefs} equipment={equipment} />
      </div>
    </div>
  )
}
