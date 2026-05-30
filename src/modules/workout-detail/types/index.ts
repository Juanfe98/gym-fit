import type { WorkoutPlan, WorkoutDay, PlanExercise } from '@/modules/workout-plans/types'

export interface WorkoutDetail {
  day: WorkoutDay
  plan: WorkoutPlan
  exercises: PlanExercise[]
}

export interface ResolvedExercise extends PlanExercise {
  displayName: string
}
