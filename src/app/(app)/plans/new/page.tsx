'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/i18n/client'
import { PlanForm } from '@/modules/workout-plans/components/PlanForm'
import { TemplatePicker } from '@/modules/workout-plans/components/TemplatePicker'
import { usePlanMutations } from '@/modules/workout-plans/hooks/use-plan-mutations'
import type { PlanGoal } from '@/modules/workout-plans/types'
import type { Goal } from '@/types'

type Mode = 'choose' | 'manual' | 'template'

export default function NewPlanPage() {
  const { t } = useI18n()
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('choose')
  const [selectedGoal, setSelectedGoal] = useState<PlanGoal | null>(null)

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => setUserId(user?.id ?? null))
  }, [])

  const { createPlan, isCreating } = usePlanMutations(userId)

  return (
    <div className="min-h-screen bg-gym-bg pb-16">
      <h1 className="text-lg font-semibold text-gym-text px-4 pt-4">{t('newPlan')}</h1>

      {mode === 'choose' && (
        <div className="flex flex-col gap-3 px-4 pt-4">
          <button
            onClick={() => setMode('manual')}
            className="flex w-full items-center justify-between px-4 py-4 min-h-[44px] bg-gym-surface-2 rounded-lg border border-gym-border active:border-gym-accent"
          >
            <span className="text-sm font-medium text-gym-text">{t('planManual')}</span>
          </button>
          <button
            onClick={() => setMode('template')}
            className="flex w-full items-center justify-between px-4 py-4 min-h-[44px] bg-gym-surface-2 rounded-lg border border-gym-border active:border-gym-accent"
          >
            <span className="text-sm font-medium text-gym-text">{t('planFromTemplate')}</span>
          </button>
        </div>
      )}

      {mode === 'template' && (
        <TemplatePicker
          onSelect={(goal: Goal) => {
            setSelectedGoal(goal as PlanGoal)
            setMode('manual')
          }}
          onBack={() => setMode('choose')}
        />
      )}

      {mode === 'manual' && (
        <PlanForm
          defaultValues={selectedGoal ? { goal: selectedGoal } : undefined}
          isLoading={isCreating}
          onSubmit={async (values) => {
            const plan = await createPlan({
              data: values,
              templateGoal: selectedGoal ?? undefined,
              daysPerWeek: values.daysPerWeek,
            })
            router.push(`/plans/${plan.id}`)
          }}
        />
      )}
    </div>
  )
}
