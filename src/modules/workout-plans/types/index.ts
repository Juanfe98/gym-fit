import type { Goal } from '@/types'

export type PlanGoal = Goal | 'general'
export type PlanLevel = 'beginner' | 'intermediate' | 'advanced'

export interface WorkoutPlan {
  id: string
  userId: string
  name: string
  description: string | null
  goal: PlanGoal
  level: PlanLevel
  durationWeeks: number | null
  daysPerWeek: number
  isActive: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface WorkoutDay {
  id: string
  planId: string
  name: string
  dayOrder: number
  targetMuscleGroups: string[]
}

export interface PlanExercise {
  id: string
  dayId: string
  exerciseId: string
  displayOrder: number
  targetSets: number | null
  targetReps: number | null
  targetRepRangeMin: number | null
  targetRepRangeMax: number | null
  targetWeight: number | null
  restSeconds: number | null
  tempo: string | null
  targetRpe: number | null
  notes: string | null
}

export interface WorkoutDayWithCount extends WorkoutDay {
  exerciseCount: number
}
