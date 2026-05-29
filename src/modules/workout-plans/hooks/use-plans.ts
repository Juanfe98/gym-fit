'use client'

import { useQuery } from '@tanstack/react-query'
import { getPlans, getPlan } from '../services/plans-service'
import { getDaysWithCount } from '../services/days-service'
import { getPlanExercises } from '../services/exercises-service'

export function usePlans(userId: string | null) {
  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans', 'list', userId],
    queryFn: () => getPlans(userId!),
    enabled: !!userId,
  })
  return { plans: plans ?? [], isLoading }
}

export function usePlan(planId: string | null) {
  const { data: plan, isLoading } = useQuery({
    queryKey: ['plans', 'detail', planId],
    queryFn: () => getPlan(planId!),
    enabled: !!planId,
  })
  return { plan: plan ?? null, isLoading }
}

export function usePlanDays(planId: string | null) {
  const { data: days, isLoading } = useQuery({
    queryKey: ['plans', 'days', planId],
    queryFn: () => getDaysWithCount(planId!),
    enabled: !!planId,
  })
  return { days: days ?? [], isLoading }
}

export function usePlanExercises(dayId: string | null) {
  const { data: exercises, isLoading } = useQuery({
    queryKey: ['plans', 'exercises', dayId],
    queryFn: () => getPlanExercises(dayId!),
    enabled: !!dayId,
  })
  return { exercises: exercises ?? [], isLoading }
}
