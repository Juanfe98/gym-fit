/**
 * CONTRACT: Workout Session Zustand Store Interface
 *
 * This file defines the public interface of the workout session store.
 * Implementations must satisfy this contract exactly.
 * All mutating actions write to Dexie (IndexedDB) before updating in-memory state.
 */

import type {
  ActiveSessionDraft,
  FinishedSession,
  SetInput,
  WeightUnit,
} from '../types'

// ---------------------------------------------------------------------------
// Session Store
// ---------------------------------------------------------------------------

export interface WorkoutSessionStore {
  /** Currently active session draft. Null when no session is in progress. */
  session: ActiveSessionDraft | null

  /**
   * Start a new workout session.
   * Creates a new session in Dexie and sets it as the active session.
   * Throws if a session is already in progress.
   */
  startSession: (userId: string, opts?: StartSessionOptions) => Promise<void>

  /**
   * Recover an in-progress session from Dexie (after crash/force-quit).
   * Replaces current session state with the recovered session.
   */
  recoverSession: (sessionId: string) => Promise<void>

  /**
   * Add an exercise to the active session.
   * Appended to the end of the exercise list.
   * Throws if no active session.
   */
  addExercise: (exercise: ExerciseRef) => Promise<void>

  /**
   * Remove an exercise and all its sets from the active session.
   * Requires confirmation at the UI layer before calling.
   * Throws if no active session or exercise not found.
   */
  removeExercise: (sessionExerciseId: string) => Promise<void>

  /**
   * Replace an exercise with a different one, clearing the original's sets.
   * Marks the new exercise with wasReplaced=true and originalExerciseId.
   * Requires confirmation at the UI layer before calling.
   */
  replaceExercise: (sessionExerciseId: string, newExercise: ExerciseRef) => Promise<void>

  /**
   * Reorder exercises in the active session.
   * Provide the new ordered array of sessionExerciseIds.
   */
  reorderExercises: (orderedIds: string[]) => Promise<void>

  /**
   * Update the notes for an exercise within the active session.
   */
  updateExerciseNotes: (sessionExerciseId: string, notes: string) => Promise<void>

  /**
   * Log a new set for an exercise.
   * Writes to Dexie first, then updates in-memory state.
   * Returns the set id (UUID) that was assigned.
   * Queues a Supabase upsert in the offline queue.
   */
  logSet: (sessionExerciseId: string, input: SetInput) => Promise<string>

  /**
   * Edit an existing logged set.
   * Overwrites Dexie record, updates in-memory state, re-queues sync.
   */
  editSet: (setId: string, input: SetInput) => Promise<void>

  /**
   * Delete a logged set.
   * Removes from Dexie, updates in-memory state, queues a delete sync op.
   */
  deleteSet: (setId: string) => Promise<void>

  /**
   * Update the session-level notes.
   */
  updateSessionNotes: (notes: string) => Promise<void>

  /**
   * Finish the active session.
   * Validates at least one set exists (throws otherwise).
   * Computes duration, total volume, PR count.
   * Transitions session status to 'completed' in Dexie.
   * Does NOT write to Supabase — caller is responsible for triggering sync.
   * Clears active session from store after returning the finished session.
   */
  finishSession: () => Promise<FinishedSession>

  /**
   * Discard the active session.
   * Transitions to 'cancelled' or 'discarded' based on whether sets exist.
   * Removes from Dexie. No Supabase write.
   * Clears active session from store.
   */
  discardSession: () => Promise<void>
}

// ---------------------------------------------------------------------------
// Timer Store
// ---------------------------------------------------------------------------

export interface TimerStore {
  /** Elapsed session timer in seconds. Updated every second while session is active. */
  elapsedSeconds: number

  /** Rest timer state. Null when no rest timer is active. */
  restTimer: RestTimerState | null

  startSessionTimer: () => void
  stopSessionTimer: () => void
  pauseSessionTimer: () => void
  resumeSessionTimer: () => void

  startRestTimer: (durationSeconds: number) => void
  skipRestTimer: () => void
  clearRestTimer: () => void
}

export interface RestTimerState {
  durationSeconds: number
  startedAt: number     // Date.now()
  isPaused: boolean
  pausedAt?: number     // Date.now() when paused
}

// ---------------------------------------------------------------------------
// Offline Queue Store
// ---------------------------------------------------------------------------

export interface OfflineQueueStore {
  /** Whether the app currently has network connectivity. */
  isOnline: boolean

  /** Sync status across all pending items. */
  syncStatus: 'idle' | 'syncing' | 'error'

  /** Number of items pending sync. */
  pendingCount: number

  setOnline: (online: boolean) => void

  /**
   * Drain the offline queue — attempt to sync all pending items to Supabase.
   * Called automatically when isOnline transitions to true.
   */
  drainQueue: () => Promise<void>
}

// ---------------------------------------------------------------------------
// Supporting Types
// ---------------------------------------------------------------------------

export interface StartSessionOptions {
  sourcePlanId?: string
  sourceWorkoutDayId?: string
}

export interface ExerciseRef {
  exerciseId: string
  exerciseNameSnapshot: string
}
