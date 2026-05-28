export type SetType = 'normal' | 'warmup' | 'dropset'
export type WeightUnit = 'kg' | 'lbs'
export type DateRangeFilter = '7d' | '30d' | '90d' | '180d' | '365d' | null

export interface HistoryFilters {
  dateRange: DateRangeFilter
  exerciseSearch: string
}

export interface WorkoutHistorySummary {
  id: string
  startedAt: string
  finishedAt: string
  durationSeconds: number
  totalVolume: number | null
  prCount: number
  totalSets: number
  exerciseCount: number
  notes: string | null
  sourcePlanId: string | null
}

export interface WorkoutHistoryDetail {
  id: string
  startedAt: string
  finishedAt: string
  durationSeconds: number
  totalVolume: number | null
  prCount: number
  notes: string | null
  sourcePlanId: string | null
  exercises: WorkoutHistoryExercise[]
}

export interface WorkoutHistoryExercise {
  id: string
  exerciseId: string
  exerciseNameSnapshot: string
  displayOrder: number
  notes: string | null
  wasReplaced: boolean
  originalExerciseId: string | null
  sets: WorkoutHistorySet[]
}

export interface WorkoutHistorySet {
  id: string
  setNumber: number
  weight: number | null
  weightUnit: WeightUnit
  reps: number | null
  setType: SetType
  rpe: number | null
  isCompleted: boolean
  isPr: boolean
  notes: string | null
}
