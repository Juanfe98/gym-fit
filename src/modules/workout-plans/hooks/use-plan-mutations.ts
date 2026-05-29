'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createPlan,
  updatePlan,
  activatePlan as activatePlanService,
  deactivatePlan as deactivatePlanService,
  archivePlan as archivePlanService,
  duplicatePlan as duplicatePlanService,
} from '../services/plans-service'
import { getDays } from '../services/days-service'
import { getPlanExercises, addPlanExercise } from '../services/exercises-service'
import { addDay } from '../services/days-service'
import { buildTemplatePayload } from '../utils/template-import'
import type { PlanFormValues } from '../validation/plan-schema'
import type { PlanGoal } from '../types'
import type { Goal } from '@/types'

interface CreatePlanPayload {
  data: PlanFormValues
  templateGoal?: PlanGoal
  daysPerWeek?: number
}

export function usePlanMutations(userId: string | null) {
  const queryClient = useQueryClient()

  const { mutateAsync: createPlanMutation, isPending: isCreating } = useMutation({
    mutationFn: async ({ data, templateGoal, daysPerWeek }: CreatePlanPayload) => {
      const plan = await createPlan(userId!, {
        name: data.name,
        description: data.description,
        goal: data.goal,
        level: data.level,
        durationWeeks: data.durationWeeks,
        daysPerWeek: data.daysPerWeek,
        isActive: false,
        isArchived: false,
      })

      if (templateGoal && templateGoal !== 'general' && daysPerWeek) {
        const dayPayloads = buildTemplatePayload(templateGoal as Goal, daysPerWeek)
        for (const dayPayload of dayPayloads) {
          const day = await addDay(plan.id, {
            name: dayPayload.name,
            dayOrder: dayPayload.dayOrder,
            targetMuscleGroups: dayPayload.targetMuscleGroups,
          })
          for (const ex of dayPayload.exercises) {
            await addPlanExercise(day.id, {
              exerciseId: ex.exerciseId,
              displayOrder: ex.displayOrder,
              targetSets: ex.targetSets,
              targetReps: ex.targetReps,
              targetRepRangeMin: null,
              targetRepRangeMax: null,
              targetWeight: null,
              restSeconds: null,
              tempo: null,
              targetRpe: null,
              notes: null,
            })
          }
        }
      }

      return plan
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans', 'list', userId] })
    },
  })

  const { mutateAsync: updatePlanMutation, isPending: isUpdating } = useMutation({
    mutationFn: async ({ planId, data }: { planId: string; data: PlanFormValues }) => {
      await updatePlan(planId, {
        name: data.name,
        description: data.description,
        goal: data.goal,
        level: data.level,
        durationWeeks: data.durationWeeks,
        daysPerWeek: data.daysPerWeek,
      })
      return planId
    },
    onSuccess: (planId) => {
      queryClient.invalidateQueries({ queryKey: ['plans', 'detail', planId] })
      queryClient.invalidateQueries({ queryKey: ['plans', 'list', userId] })
    },
  })

  const { mutate: activatePlanMutation, isPending: isActivating } = useMutation({
    mutationFn: async (planId: string) => {
      await activatePlanService(userId!, planId)
      return planId
    },
    onSuccess: (planId) => {
      queryClient.invalidateQueries({ queryKey: ['plans', 'list', userId] })
      queryClient.invalidateQueries({ queryKey: ['plans', 'detail', planId] })
    },
  })

  const { mutate: deactivatePlanMutation, isPending: isDeactivating } = useMutation({
    mutationFn: async (planId: string) => {
      await deactivatePlanService(planId)
      return planId
    },
    onSuccess: (planId) => {
      queryClient.invalidateQueries({ queryKey: ['plans', 'list', userId] })
      queryClient.invalidateQueries({ queryKey: ['plans', 'detail', planId] })
    },
  })

  const { mutate: duplicatePlanMutation, isPending: isDuplicating } = useMutation({
    mutationFn: async (planId: string) => {
      const newPlan = await duplicatePlanService(userId!, planId)
      const days = await getDays(planId)
      for (const day of days) {
        const newDay = await addDay(newPlan.id, {
          name: day.name,
          dayOrder: day.dayOrder,
          targetMuscleGroups: day.targetMuscleGroups,
        })
        const exercises = await getPlanExercises(day.id)
        for (const ex of exercises) {
          await addPlanExercise(newDay.id, {
            exerciseId: ex.exerciseId,
            displayOrder: ex.displayOrder,
            targetSets: ex.targetSets,
            targetReps: ex.targetReps,
            targetRepRangeMin: ex.targetRepRangeMin,
            targetRepRangeMax: ex.targetRepRangeMax,
            targetWeight: ex.targetWeight,
            restSeconds: ex.restSeconds,
            tempo: ex.tempo,
            targetRpe: ex.targetRpe,
            notes: ex.notes,
          })
        }
      }
      return newPlan
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans', 'list', userId] })
    },
  })

  const { mutate: archivePlanMutation, isPending: isArchiving } = useMutation({
    mutationFn: async (planId: string) => {
      await archivePlanService(planId)
      return planId
    },
    onSuccess: (planId) => {
      queryClient.invalidateQueries({ queryKey: ['plans', 'list', userId] })
      queryClient.invalidateQueries({ queryKey: ['plans', 'detail', planId] })
    },
  })

  return {
    createPlan: createPlanMutation,
    updatePlan: updatePlanMutation,
    activatePlan: activatePlanMutation,
    deactivatePlan: deactivatePlanMutation,
    duplicatePlan: duplicatePlanMutation,
    archivePlan: archivePlanMutation,
    isCreating,
    isUpdating,
    isActivating,
    isDeactivating,
    isDuplicating,
    isArchiving,
  }
}
