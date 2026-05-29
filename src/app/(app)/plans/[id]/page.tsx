'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/i18n/client'
import { usePlan, usePlanDays } from '@/modules/workout-plans/hooks/use-plans'
import { useDayMutations } from '@/modules/workout-plans/hooks/use-day-mutations'
import { usePlanMutations } from '@/modules/workout-plans/hooks/use-plan-mutations'
import { PlanDayList } from '@/modules/workout-plans/components/PlanDayList'
import { ActivateButton } from '@/modules/workout-plans/components/ActivateButton'
import { PlanActions } from '@/modules/workout-plans/components/PlanActions'

export default function PlanDetailPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { id: planId } = useParams<{ id: string }>()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => setUserId(user?.id ?? null))
  }, [])

  const { plan, isLoading: planLoading } = usePlan(planId)
  const { days, isLoading: daysLoading } = usePlanDays(planId)
  const { addDay, removeDay } = useDayMutations(planId)
  const { activatePlan, deactivatePlan, duplicatePlan, archivePlan, isActivating, isDeactivating, isDuplicating, isArchiving } = usePlanMutations(userId)

  const hasValidStructure =
    (days?.length ?? 0) > 0 && (days ?? []).every((d) => d.exerciseCount > 0)
  const activationError = !days?.length
    ? t('activationErrorNoDays')
    : t('activationErrorNoExercises')

  if (!planLoading && !plan) {
    return (
      <div className="px-4 pt-4">
        <p className="text-gym-muted text-sm">Plan not found</p>
        <button onClick={() => router.back()} className="mt-2 text-gym-accent text-sm underline">
          Go back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gym-bg pb-32">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <button
          onClick={() => router.back()}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gym-muted"
        >
          ←
        </button>
        <h1 className="flex-1 text-lg font-semibold text-gym-text truncate">{plan?.name}</h1>
        <Link
          href={`/plans/${planId}/edit`}
          className="text-sm text-gym-accent font-medium px-2 py-1"
        >
          Edit
        </Link>
      </div>

      {plan && (
        <div className="flex gap-2 px-4 pb-3">
          <span className="text-xs text-gym-muted bg-gym-surface-2 rounded px-2 py-0.5">
            {plan.goal}
          </span>
          <span className="text-xs text-gym-muted bg-gym-surface-2 rounded px-2 py-0.5">
            {plan.level}
          </span>
        </div>
      )}

      {!daysLoading && (
        <PlanDayList
          days={days}
          onAddDay={() =>
            addDay({
              name: `Day ${(days?.length ?? 0) + 1}`,
              dayOrder: days?.length ?? 0,
              targetMuscleGroups: [],
            })
          }
          onEditDay={(dayId) => router.push(`/plans/${planId}/days/${dayId}`)}
          onRemoveDay={(dayId) => removeDay(dayId)}
        />
      )}

      <PlanActions
        onDuplicate={() => duplicatePlan(planId, { onSuccess: () => router.push('/plans') })}
        onArchive={() => archivePlan(planId, { onSuccess: () => router.push('/plans') })}
        isDuplicating={isDuplicating}
        isArchiving={isArchiving}
      />

      {plan && (
        <div className="sticky bottom-16 p-4 bg-gym-surface border-t border-gym-border">
          <ActivateButton
            isActive={plan.isActive}
            hasValidStructure={hasValidStructure}
            onActivate={() => activatePlan(planId)}
            onDeactivate={() => deactivatePlan(planId)}
            activationError={hasValidStructure ? null : activationError}
            isLoading={isActivating || isDeactivating}
          />
        </div>
      )}
    </div>
  )
}
