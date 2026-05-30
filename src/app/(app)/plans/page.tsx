'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/i18n/client'
import { PlanCard } from '@/modules/workout-plans/components/PlanCard'
import { getPlansWithDayCount } from '@/modules/workout-plans/services/plans-service'

export default function PlansPage() {
  const { t } = useI18n()
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [showArchived, setShowArchived] = useState(false)

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => setUserId(user?.id ?? null))
  }, [])

  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans', 'list', userId],
    queryFn: () => getPlansWithDayCount(userId!),
    enabled: !!userId,
  })

  const activePlan = plans?.find((p) => p.isActive)
  const visiblePlans = showArchived
    ? (plans ?? [])
    : (plans ?? []).filter((p) => !p.isArchived)
  const inactivePlans = visiblePlans.filter((p) => !p.isActive)

  return (
    <div className="min-h-screen bg-gym-bg pb-20">
      <div className="px-4 pt-4">
        <Link
          href="/plan"
          aria-label="Back to plan overview"
          className="focus-ring inline-flex items-center gap-1 text-xs font-semibold text-gym-muted transition-colors hover:text-gym-text"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {t('planOverviewTitle')}
        </Link>
      </div>
      <div className="flex items-center justify-between px-4 pt-2 pb-2">
        <h1 className="text-lg font-semibold text-gym-text">{t('plansTitle')}</h1>
        <button
          onClick={() => router.push('/plans/new')}
          className="h-9 px-3 rounded-lg bg-gym-accent text-white text-sm font-semibold"
        >
          + {t('newPlan')}
        </button>
      </div>

      {isLoading && (
        <div className="px-4 py-6 text-sm text-gym-muted text-center">Loading…</div>
      )}

      {!isLoading && (!plans || plans.length === 0) && (
        <div className="flex flex-col items-center gap-4 px-4 py-12">
          <p className="text-sm text-gym-muted text-center">{t('plansEmpty')}</p>
          <button
            onClick={() => router.push('/plans/new')}
            className="glow-accent h-11 px-6 rounded-lg bg-gym-accent text-white font-semibold"
          >
            {t('newPlan')}
          </button>
        </div>
      )}

      {activePlan && (
        <div>
          <h2 className="text-xs font-semibold text-gym-muted px-4 pt-4 pb-1 uppercase tracking-wide">
            {t('planStatusActive')}
          </h2>
          <PlanCard
            plan={activePlan}
            dayCount={activePlan.dayCount}
            onClick={() => router.push(`/plans/${activePlan.id}`)}
          />
        </div>
      )}

      {inactivePlans.length > 0 && (
        <div>
          {activePlan && (
            <h2 className="text-xs font-semibold text-gym-muted px-4 pt-4 pb-1 uppercase tracking-wide">
              {t('myPlans')}
            </h2>
          )}
          {inactivePlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              dayCount={plan.dayCount}
              onClick={() => router.push(`/plans/${plan.id}`)}
              showArchivedBadge={plan.isArchived}
            />
          ))}
        </div>
      )}

      {plans && plans.some((p) => p.isArchived) && (
        <div className="px-4 pt-4">
          <button
            onClick={() => setShowArchived((v) => !v)}
            className="text-sm text-gym-muted underline"
          >
            {showArchived ? 'Hide archived' : 'Show archived'}
          </button>
        </div>
      )}
    </div>
  )
}
