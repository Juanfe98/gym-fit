import Dexie, { type EntityTable } from 'dexie'

export interface OfflineWorkoutSession {
  id: string
  userId: string
  status: 'in_progress' | 'completed' | 'cancelled' | 'discarded'
  startedAt: number
  finishedAt?: number
  notes?: string
  sourcePlanId?: string
  sourceWorkoutDayId?: string
  syncStatus: 'local' | 'pending_sync' | 'syncing' | 'synced' | 'sync_failed'
}

export interface OfflineSessionExercise {
  id: string
  sessionId: string
  exerciseId: string
  exerciseNameSnapshot: string
  displayOrder: number
  notes?: string
  wasReplaced: boolean
  originalExerciseId?: string
}

export interface OfflineSetLog {
  id: string
  sessionExerciseId: string
  setNumber: number
  weight?: number
  weightUnit: 'kg' | 'lbs'
  reps?: number
  setType: 'normal' | 'warmup' | 'dropset'
  rpe?: number
  isCompleted: boolean
  isPr: boolean
  notes?: string
  loggedAt: number
  syncStatus: 'local' | 'pending_sync' | 'synced' | 'sync_failed'
}

export interface OfflineQueueItem {
  id?: number
  table: 'workout_sessions' | 'session_exercises' | 'set_logs' | 'personal_records'
  operation: 'upsert' | 'delete'
  payload: Record<string, unknown>
  idempotencyKey: string
  createdAt: number
  attempts: number
  lastAttemptAt?: number
}

export class GymPlannerDB extends Dexie {
  workoutSessions!: EntityTable<OfflineWorkoutSession, 'id'>
  sessionExercises!: EntityTable<OfflineSessionExercise, 'id'>
  setLogs!: EntityTable<OfflineSetLog, 'id'>
  offlineQueue!: EntityTable<OfflineQueueItem, 'id'>

  constructor() {
    super('GymPlannerDB')
    this.version(1).stores({
      workoutSessions: 'id, userId, status, syncStatus',
      sessionExercises: 'id, sessionId',
      setLogs: 'id, sessionExerciseId, syncStatus',
      offlineQueue: '++id, table, idempotencyKey, createdAt',
    })
  }
}

export const db =
  typeof window !== 'undefined' ? new GymPlannerDB() : (null as unknown as GymPlannerDB)
