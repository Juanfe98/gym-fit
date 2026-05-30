'use client'

import { useQuery } from '@tanstack/react-query'
import { getDayById } from '@/modules/workout-plans/services/days-service'
import { getPlan } from '@/modules/workout-plans/services/plans-service'
import { getPlanExercises } from '@/modules/workout-plans/services/exercises-service'
import type { WorkoutDetail } from '../types'

async function fetchWorkoutDetail(dayId: string): Promise<WorkoutDetail | null> {
  const day = await getDayById(dayId)
  if (!day) return null
  const [plan, exercises] = await Promise.all([
    getPlan(day.planId),
    getPlanExercises(day.id),
  ])
  if (!plan) return null
  return { day, plan, exercises }
}

export function useWorkoutDetail(dayId: string | null) {
  const query = useQuery({
    queryKey: ['workout-detail', dayId],
    queryFn: () => fetchWorkoutDetail(dayId!),
    enabled: !!dayId,
  })
  return {
    detail: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  }
}
