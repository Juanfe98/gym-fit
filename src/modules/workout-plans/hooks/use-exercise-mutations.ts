'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  addPlanExercise,
  updatePlanExercise,
  removePlanExercise,
  reorderPlanExercises,
} from '../services/exercises-service'
import type { PlanExercise } from '../types'

export function useExerciseMutations(dayId: string | null, planId: string | null) {
  const queryClient = useQueryClient()

  const { mutate: addExercise } = useMutation({
    mutationFn: (data: Omit<PlanExercise, 'id' | 'dayId'>) => addPlanExercise(dayId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans', 'exercises', dayId] })
      queryClient.invalidateQueries({ queryKey: ['plans', 'days', planId] })
    },
  })

  const { mutate: updateExercise } = useMutation({
    mutationFn: ({ exerciseId, data }: { exerciseId: string; data: Partial<PlanExercise> }) =>
      updatePlanExercise(exerciseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans', 'exercises', dayId] })
    },
  })

  const { mutate: removeExercise } = useMutation({
    mutationFn: (exerciseId: string) => removePlanExercise(exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans', 'exercises', dayId] })
      queryClient.invalidateQueries({ queryKey: ['plans', 'days', planId] })
    },
  })

  const { mutate: reorderExercises } = useMutation({
    mutationFn: ({
      exercises,
      fromIndex,
      toIndex,
    }: {
      exercises: PlanExercise[]
      fromIndex: number
      toIndex: number
    }) => {
      const reordered = [...exercises]
      const [moved] = reordered.splice(fromIndex, 1)
      reordered.splice(toIndex, 0, moved)
      const updates = reordered.map((ex, i) => ({ id: ex.id, displayOrder: i }))
      queryClient.setQueryData(['plans', 'exercises', dayId], reordered.map((ex, i) => ({ ...ex, displayOrder: i })))
      return reorderPlanExercises(updates)
    },
    onError: (_err, { exercises }) => {
      queryClient.setQueryData(['plans', 'exercises', dayId], exercises)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['plans', 'exercises', dayId] })
    },
  })

  return {
    addExercise,
    updateExercise: (exerciseId: string, data: Partial<PlanExercise>) =>
      updateExercise({ exerciseId, data }),
    removeExercise,
    reorderExercises,
  }
}
