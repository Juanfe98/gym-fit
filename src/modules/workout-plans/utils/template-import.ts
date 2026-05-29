import { ROUTINES } from '@/data/routines'
import type { Goal } from '@/types'

type DayPayload = {
  name: string
  dayOrder: number
  targetMuscleGroups: string[]
  exercises: Array<{
    exerciseId: string
    displayOrder: number
    targetSets: number
    targetReps: number
  }>
}

export function buildTemplatePayload(goal: Goal, daysPerWeek: number): DayPayload[] {
  const routine = ROUTINES[goal]
  return routine.days.slice(0, daysPerWeek).map((day, index) => ({
    name: day.focus,
    dayOrder: index,
    targetMuscleGroups: [],
    exercises: day.exercises.map((ex, i) => ({
      exerciseId: ex.exerciseKey,
      displayOrder: i,
      targetSets: 3,
      targetReps: 10,
    })),
  }))
}
