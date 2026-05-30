'use client'

import Link from 'next/link'
import { Dumbbell, ChevronRight, Pencil, ClipboardList } from 'lucide-react'
import { useI18n } from '@/i18n/client'

interface Props {
  planId: string
  planName: string
  suggestedDayId: string | null
  suggestedDayName: string | null
}

export function PlanHeader({ planId, planName, suggestedDayId, suggestedDayName }: Props) {
  const { t } = useI18n()

  const startNextUrl = suggestedDayId
    ? `/workout?planId=${encodeURIComponent(planId)}&dayId=${encodeURIComponent(suggestedDayId)}&planName=${encodeURIComponent(planName)}&dayName=${encodeURIComponent(suggestedDayName ?? '')}`
    : null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="heading text-2xl text-gym-text">{t('planOverviewTitle')}</h1>
          <p className="mt-1 text-sm text-gym-muted">{t('planOverviewSubtitle')}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/plans"
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-gym-border px-3 py-2 text-xs font-semibold text-gym-muted transition-colors hover:border-gym-border-2 hover:text-gym-text"
          >
            <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
            {t('allPlans')}
          </Link>
          <Link
            href={`/plans/${planId}`}
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-gym-border px-3 py-2 text-xs font-semibold text-gym-muted transition-colors hover:border-gym-border-2 hover:text-gym-text"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            {t('editPlan')}
          </Link>
        </div>
      </div>
      {startNextUrl && (
        <Link
          href={startNextUrl}
          className="glow-accent focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-gym-accent px-5 py-3 text-sm font-semibold text-white transition-opacity active:opacity-80 sm:w-fit"
        >
          <Dumbbell className="h-4 w-4" aria-hidden="true" />
          {t('planOverviewStartNext')}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
