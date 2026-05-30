'use client'

import Link from 'next/link'
import { Dumbbell, ChevronRight } from 'lucide-react'
import { useI18n } from '@/i18n/client'

type Props = {
  displayName?: string
}

export function DashboardHero({ displayName }: Props) {
  const { t } = useI18n()

  const greeting = displayName
    ? t('dashboardGreetingWithName', { name: displayName })
    : t('dashboardGreeting')

  return (
    <section
      aria-label="Dashboard hero"
      className="relative overflow-hidden rounded-2xl border border-gym-border bg-[radial-gradient(circle_at_top_left,rgba(247,82,30,0.16)_0%,transparent_55%),linear-gradient(145deg,var(--color-gym-surface-2)_0%,var(--color-gym-surface-3)_100%)] p-6"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="heading text-2xl text-gym-text sm:text-3xl">{greeting}</h1>
          <p className="text-sm text-gym-muted">{t('dashboardMotivation')}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/workout"
            className="glow-accent focus-ring inline-flex items-center gap-2 rounded-xl bg-gym-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity active:opacity-80"
          >
            <Dumbbell className="h-4 w-4" aria-hidden="true" />
            {t('dashboardStartWorkout')}
          </Link>
          <Link
            href="/plans"
            className="focus-ring inline-flex items-center gap-1.5 rounded-xl border border-gym-border bg-gym-surface-2/80 px-5 py-2.5 text-sm font-semibold text-gym-text transition-colors hover:border-gym-border-strong"
          >
            {t('dashboardViewPlan')}
            <ChevronRight className="h-4 w-4 text-gym-muted" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
