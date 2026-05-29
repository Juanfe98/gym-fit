'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/i18n/client'
import { PlanForm } from '@/modules/workout-plans/components/PlanForm'
import { usePlan } from '@/modules/workout-plans/hooks/use-plans'
import { usePlanMutations } from '@/modules/workout-plans/hooks/use-plan-mutations'
import type { PlanFormValues } from '@/modules/workout-plans/validation/plan-schema'

export default function EditPlanPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { id: planId } = useParams<{ id: string }>()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => setUserId(user?.id ?? null))
  }, [])

  const { plan, isLoading } = usePlan(planId)
  const { updatePlan, isUpdating } = usePlanMutations(userId)

  if (!isLoading && !plan) {
    return (
      <div className="px-4 pt-4">
        <p className="text-gym-muted text-sm">Plan not found</p>
        <button onClick={() => router.back()} className="mt-2 text-gym-accent text-sm underline">
          Go back
        </button>
      </div>
    )
  }

  const defaultValues: Partial<PlanFormValues> = plan
    ? {
        name: plan.name,
        goal: plan.goal,
        level: plan.level,
        durationWeeks: plan.durationWeeks,
        daysPerWeek: plan.daysPerWeek,
        description: plan.description,
      }
    : {}

  return (
    <div className="min-h-screen bg-gym-bg pb-16">
      <h1 className="text-lg font-semibold text-gym-text px-4 pt-4">{t('editPlan')}</h1>
      <PlanForm
        key={plan?.id}
        defaultValues={defaultValues}
        isLoading={isUpdating}
        submitLabel={t('editPlan')}
        onSubmit={async (values) => {
          await updatePlan({ planId, data: values })
          router.back()
        }}
      />
    </div>
  )
}
