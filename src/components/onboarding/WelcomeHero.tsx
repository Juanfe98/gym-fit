'use client'

import type { ReactNode } from 'react'
import { CheckCircle2, Dumbbell, Flame, TrendingUp } from 'lucide-react'
import { useI18n } from '@/i18n/client'

type PreviewWorkout = {
  dayKey: 'onboardingPreviewDayMon' | 'onboardingPreviewDayWed' | 'onboardingPreviewDayFri' | 'onboardingPreviewDaySun'
  nameKey: 'onboardingPreviewWorkoutUpper' | 'onboardingPreviewWorkoutLower' | 'onboardingPreviewWorkoutPush' | 'onboardingPreviewWorkoutConditioning'
  focusKey: 'onboardingPreviewFocusUpper' | 'onboardingPreviewFocusLower' | 'onboardingPreviewFocusPush' | 'onboardingPreviewFocusConditioning'
  status: 'done' | 'next' | 'planned'
}

const previewWorkouts: PreviewWorkout[] = [
  {
    dayKey: 'onboardingPreviewDayMon',
    nameKey: 'onboardingPreviewWorkoutUpper',
    focusKey: 'onboardingPreviewFocusUpper',
    status: 'done',
  },
  {
    dayKey: 'onboardingPreviewDayWed',
    nameKey: 'onboardingPreviewWorkoutLower',
    focusKey: 'onboardingPreviewFocusLower',
    status: 'done',
  },
  {
    dayKey: 'onboardingPreviewDayFri',
    nameKey: 'onboardingPreviewWorkoutPush',
    focusKey: 'onboardingPreviewFocusPush',
    status: 'next',
  },
  {
    dayKey: 'onboardingPreviewDaySun',
    nameKey: 'onboardingPreviewWorkoutConditioning',
    focusKey: 'onboardingPreviewFocusConditioning',
    status: 'planned',
  },
]

export function WelcomeHero({ children }: { children: ReactNode }) {
  const { t } = useI18n()

  return (
    <section className="flex flex-col gap-8" aria-labelledby="welcome-heading">
      <div className="flex flex-col gap-5">
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.24em] text-orange-400">
          {t('onboardingWelcomeEyebrow')}
        </p>
        <div className="flex flex-col gap-4">
          <h1
            id="welcome-heading"
            className="font-heading text-5xl font-semibold uppercase leading-[0.92] tracking-tight text-gym-text sm:text-6xl lg:text-7xl"
          >
            {t('onboardingWelcomeHeadline')}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-gym-muted sm:text-lg sm:leading-8">
            {t('onboardingWelcomeCopy')}
          </p>
        </div>
      </div>

      {children}
    </section>
  )
}

export function WelcomePreviewCard() {
  const { t } = useI18n()

  return (
    <aside
      className="relative overflow-hidden rounded-2xl border border-gym-border bg-gym-surface-2/90 p-5"
      aria-label={t('onboardingPreviewAria')}
    >
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gym-accent-subtle blur-2xl" aria-hidden="true" />

      <div className="relative flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-heading text-sm font-semibold uppercase tracking-[0.22em] text-orange-400">
              {t('onboardingPreviewWeek')}
            </p>
            <h2 className="mt-2 font-heading text-2xl font-semibold uppercase tracking-wide text-gym-text">
              {t('onboardingPreviewTitle')}
            </h2>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gym-surface-3 text-orange-400" aria-hidden="true">
            <Dumbbell className="h-5 w-5" />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-gym-border bg-gym-surface p-4">
            <p className="text-sm text-gym-muted">{t('onboardingPreviewCompleted')}</p>
            <p className="metric mt-3 text-4xl text-gym-text">3</p>
          </div>
          <div className="rounded-lg border border-gym-border bg-gym-surface p-4">
            <p className="text-sm text-gym-muted">{t('onboardingPreviewPlanned')}</p>
            <p className="metric mt-3 text-4xl text-gym-text">4</p>
          </div>
        </div>

        <div className="rounded-lg border border-gym-border bg-gym-surface p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-gym-text">{t('onboardingPreviewProgress')}</p>
            <p className="text-sm text-gym-muted">{t('onboardingPreviewProgressLabel')}</p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gym-surface-3" aria-hidden="true">
            <div className="h-full w-3/4 rounded-full bg-orange-500" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {previewWorkouts.map((workout) => (
            <div
              key={workout.dayKey}
              className="flex items-center gap-3 rounded-lg border border-gym-border bg-gym-surface p-3"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gym-surface-3 font-heading text-base font-semibold uppercase text-gym-text">
                {t(workout.dayKey)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading text-lg font-semibold uppercase tracking-wide text-gym-text">
                  {t(workout.nameKey)}
                </p>
                <p className="truncate text-sm text-gym-muted">{t(workout.focusKey)}</p>
              </div>
              <WorkoutStatusIcon status={workout.status} />
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

function WorkoutStatusIcon({ status }: { status: PreviewWorkout['status'] }) {
  const { t } = useI18n()

  if (status === 'done') {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success" aria-label={t('onboardingPreviewStatusCompleted')}>
        <CheckCircle2 className="h-4 w-4" />
      </span>
    )
  }

  if (status === 'next') {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gym-accent-subtle text-orange-400" aria-label={t('onboardingPreviewStatusNext')}>
        <Flame className="h-4 w-4" />
      </span>
    )
  }

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gym-surface-3 text-gym-muted" aria-label={t('onboardingPreviewStatusPlanned')}>
      <TrendingUp className="h-4 w-4" />
    </span>
  )
}
