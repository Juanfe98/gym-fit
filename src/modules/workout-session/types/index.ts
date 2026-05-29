export type SetType = 'normal' | 'warmup' | 'dropset'
export type WeightUnit = 'kg' | 'lbs'
export type SessionStatus = 'in_progress' | 'completed' | 'cancelled' | 'discarded'
export type SyncStatus = 'local' | 'pending_sync' | 'syncing' | 'synced' | 'sync_failed'

export interface SetInput {
  weight: number
  weightUnit: WeightUnit
  reps: number
  setType: SetType
  rpe?: number
  notes?: string
}

export interface SetLogDraft extends SetInput {
  id: string
  setNumber: number
  isPr: boolean
  loggedAt: number
}

export interface SessionExerciseDraft {
  id: string
  exerciseId: string
  exerciseNameSnapshot: string
  displayOrder: number
  notes?: string
  sets: SetLogDraft[]
  targetSets?: number
  targetReps?: number
  targetRepRangeMin?: number
  targetRepRangeMax?: number
  targetWeight?: number
}

export interface ActiveSessionDraft {
  id: string
  userId: string
  startedAt: number
  status: 'in_progress'
  exercises: SessionExerciseDraft[]
  notes?: string
  sourcePlanId?: string
  sourceWorkoutDayId?: string
  sourcePlanName?: string
  sourceDayName?: string
  syncStatus: SyncStatus
}

export interface FinishedSession extends Omit<ActiveSessionDraft, 'status'> {
  status: 'completed'
  finishedAt: number
  durationSeconds: number
  totalVolume: number
  prCount: number
}

export interface PrMap {
  [exerciseId: string]: {
    maxWeight: number
    maxWeightUnit: WeightUnit
  }
}
