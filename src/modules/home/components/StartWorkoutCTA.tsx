'use client'

import Link from 'next/link'
import { Dumbbell, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useI18n } from '@/i18n/client'
import { getActivePlan } from '@/modules/workout-plans/services/plans-service'

interface StartWorkoutCTAProps {
  userId?: string
}

export function StartWorkoutCTA({ userId }: StartWorkoutCTAProps) {
  const { t } = useI18n()

  const { data: activePlan } = useQuery({
    queryKey: ['plans', 'active', userId],
    queryFn: () => getActivePlan(userId!),
    enabled: !!userId,
  })

  return (
    <div className="flex flex-col gap-2">
      <Link
        href="/workout"
        className="glow-accent group flex items-center gap-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 p-5 transition-transform active:scale-[0.98]"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <Dumbbell className="h-6 w-6 text-white" strokeWidth={2.25} aria-hidden="true" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="heading text-xl text-white">{t('homeStartTitle')}</span>
          {activePlan ? (
            <span className="text-sm text-white/80">{activePlan.name}</span>
          ) : (
            <span className="text-sm text-white/80">{t('homeStartSubtitle')}</span>
          )}
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 text-white/70" aria-hidden="true" />
      </Link>

      {!activePlan && userId && (
        <Link
          href="/plans/new"
          className="text-sm text-gym-muted underline text-center"
        >
          {t('createPlanCta')}
        </Link>
      )}
    </div>
  )
}
