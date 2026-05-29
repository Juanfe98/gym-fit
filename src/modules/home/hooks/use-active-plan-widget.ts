import { useQuery } from '@tanstack/react-query'
import { getActivePlan, getLastCompletedPlanSession } from '@/modules/workout-plans/services/plans-service'
import { getDaysWithCount } from '@/modules/workout-plans/services/days-service'
import type { WorkoutPlan } from '@/modules/workout-plans/types'
import type { WorkoutDayWithCount } from '@/modules/workout-plans/types'

export function useActivePlanWidget(userId: string): {
  activePlan: WorkoutPlan | null
  days: WorkoutDayWithCount[]
  suggestedDayId: string | null
  isLoading: boolean
} {
  const planQuery = useQuery({
    queryKey: ['plans', 'active', userId],
    queryFn: () => getActivePlan(userId),
    enabled: !!userId,
  })

  const activePlan = planQuery.data ?? null

  const daysQuery = useQuery({
    queryKey: ['plans', 'days', activePlan?.id],
    queryFn: () => getDaysWithCount(activePlan!.id),
    enabled: !!activePlan,
  })

  const lastSessionQuery = useQuery({
    queryKey: ['plans', 'lastSession', activePlan?.id],
    queryFn: () => getLastCompletedPlanSession(userId, activePlan!.id),
    enabled: !!activePlan,
  })

  const days = daysQuery.data ?? []

  let suggestedDayId: string | null = null
  if (days.length > 0) {
    const lastDayId = lastSessionQuery.data?.sourceWorkoutDayId ?? null
    const lastDayOrder = lastDayId
      ? (days.find((d) => d.id === lastDayId)?.dayOrder ?? -1)
      : -1
    const nextIndex = lastDayOrder === -1 ? 0 : (lastDayOrder + 1) % days.length
    suggestedDayId = days[nextIndex]?.id ?? null
  }

  return {
    activePlan,
    days,
    suggestedDayId,
    isLoading: planQuery.isLoading || daysQuery.isLoading,
  }
}
