'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addDay, updateDay, removeDay } from '../services/days-service'
import type { WorkoutDay } from '../types'

export function useDayMutations(planId: string | null) {
  const queryClient = useQueryClient()

  const invalidate = (planId: string) => {
    queryClient.invalidateQueries({ queryKey: ['plans', 'days', planId] })
    queryClient.invalidateQueries({ queryKey: ['plans', 'detail', planId] })
  }

  const { mutate: addDayMutation, isPending: isAdding } = useMutation({
    mutationFn: (data: Pick<WorkoutDay, 'name' | 'dayOrder' | 'targetMuscleGroups'>) =>
      addDay(planId!, data),
    onSuccess: () => planId && invalidate(planId),
  })

  const { mutate: updateDayMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({
      dayId,
      data,
    }: {
      dayId: string
      data: Partial<Pick<WorkoutDay, 'name' | 'dayOrder' | 'targetMuscleGroups'>>
    }) => updateDay(dayId, data),
    onSuccess: () => planId && invalidate(planId),
  })

  const { mutate: removeDayMutation, isPending: isRemoving } = useMutation({
    mutationFn: (dayId: string) => removeDay(dayId),
    onSuccess: () => planId && invalidate(planId),
  })

  return {
    addDay: addDayMutation,
    updateDay: (dayId: string, data: Partial<Pick<WorkoutDay, 'name' | 'dayOrder' | 'targetMuscleGroups'>>) =>
      updateDayMutation({ dayId, data }),
    removeDay: removeDayMutation,
    isAdding,
    isUpdating,
    isRemoving,
  }
}
