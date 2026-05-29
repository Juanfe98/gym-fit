import { create } from 'zustand'
import { db } from '@/lib/offline-db'
import { generateId } from '../utils/idempotency'
import { calculateTotalVolume } from '../utils/volume'
import { useOfflineQueueStore } from './offline-queue-store'
import type {
  ActiveSessionDraft,
  FinishedSession,
  SetInput,
} from '../types'

interface StartSessionOptions {
  sourcePlanId?: string
  sourceWorkoutDayId?: string
  sourcePlanName?: string
  sourceDayName?: string
}

interface ExerciseRef {
  exerciseId: string
  exerciseNameSnapshot: string
  targetSets?: number
  targetReps?: number
  targetRepRangeMin?: number
  targetRepRangeMax?: number
  targetWeight?: number
}

interface WorkoutSessionState {
  session: ActiveSessionDraft | null
  startSession: (userId: string, opts?: StartSessionOptions) => Promise<void>
  recoverSession: (sessionId: string) => Promise<void>
  addExercise: (exercise: ExerciseRef) => Promise<void>
  removeExercise: (sessionExerciseId: string) => Promise<void>
  replaceExercise: (sessionExerciseId: string, newExercise: ExerciseRef) => Promise<void>
  reorderExercises: (orderedIds: string[]) => Promise<void>
  updateExerciseNotes: (sessionExerciseId: string, notes: string) => Promise<void>
  logSet: (sessionExerciseId: string, input: SetInput, isPr?: boolean) => Promise<string>
  editSet: (setId: string, input: SetInput) => Promise<void>
  deleteSet: (setId: string) => Promise<void>
  updateSessionNotes: (notes: string) => Promise<void>
  finishSession: () => Promise<FinishedSession>
  discardSession: () => Promise<void>
}

export const useWorkoutSessionStore = create<WorkoutSessionState>((set, get) => ({
  session: null,

  startSession: async (userId, opts) => {
    if (get().session) throw new Error('Session already in progress')
    const id = generateId()
    const now = Date.now()
    const draft: ActiveSessionDraft = {
      id,
      userId,
      startedAt: now,
      status: 'in_progress',
      exercises: [],
      syncStatus: 'local',
      ...opts,
    }
    await db.workoutSessions.add({
      id,
      userId,
      status: 'in_progress',
      startedAt: now,
      syncStatus: 'local',
      ...opts,
    })
    set({ session: draft })
  },

  recoverSession: async (sessionId) => {
    const stored = await db.workoutSessions.get(sessionId)
    if (!stored) throw new Error(`Session ${sessionId} not found in Dexie`)

    const storedExercises = await db.sessionExercises
      .where('sessionId')
      .equals(sessionId)
      .sortBy('displayOrder')

    const exercises = await Promise.all(
      storedExercises.map(async (ex) => {
        const storedSets = await db.setLogs
          .where('sessionExerciseId')
          .equals(ex.id)
          .sortBy('setNumber')

        return {
          id: ex.id,
          exerciseId: ex.exerciseId,
          exerciseNameSnapshot: ex.exerciseNameSnapshot,
          displayOrder: ex.displayOrder,
          notes: ex.notes,
          targetSets: ex.targetSets,
          targetReps: ex.targetReps,
          targetRepRangeMin: ex.targetRepRangeMin,
          targetRepRangeMax: ex.targetRepRangeMax,
          targetWeight: ex.targetWeight,
          sets: storedSets.map((s) => ({
            id: s.id,
            setNumber: s.setNumber,
            weight: s.weight ?? 0,
            weightUnit: s.weightUnit,
            reps: s.reps ?? 0,
            setType: s.setType,
            rpe: s.rpe,
            notes: s.notes,
            isPr: s.isPr,
            loggedAt: s.loggedAt,
          })),
        }
      })
    )

    set({
      session: {
        id: stored.id,
        userId: stored.userId,
        startedAt: stored.startedAt,
        status: 'in_progress',
        exercises,
        notes: stored.notes,
        sourcePlanId: stored.sourcePlanId,
        sourceWorkoutDayId: stored.sourceWorkoutDayId,
        syncStatus: stored.syncStatus,
      },
    })
  },

  addExercise: async (exercise) => {
    const { session } = get()
    if (!session) throw new Error('No active session')
    const id = generateId()
    const displayOrder = session.exercises.length
    await db.sessionExercises.add({
      id,
      sessionId: session.id,
      exerciseId: exercise.exerciseId,
      exerciseNameSnapshot: exercise.exerciseNameSnapshot,
      displayOrder,
      wasReplaced: false,
      targetSets: exercise.targetSets,
      targetReps: exercise.targetReps,
      targetRepRangeMin: exercise.targetRepRangeMin,
      targetRepRangeMax: exercise.targetRepRangeMax,
      targetWeight: exercise.targetWeight,
    })
    set((state) => ({
      session: state.session
        ? {
            ...state.session,
            exercises: [
              ...state.session.exercises,
              {
                id,
                exerciseId: exercise.exerciseId,
                exerciseNameSnapshot: exercise.exerciseNameSnapshot,
                displayOrder,
                sets: [],
                targetSets: exercise.targetSets,
                targetReps: exercise.targetReps,
                targetRepRangeMin: exercise.targetRepRangeMin,
                targetRepRangeMax: exercise.targetRepRangeMax,
                targetWeight: exercise.targetWeight,
              },
            ],
          }
        : null,
    }))
  },

  removeExercise: async (sessionExerciseId) => {
    const { session } = get()
    if (!session) throw new Error('No active session')

    const syncedSets = await db.setLogs
      .where('sessionExerciseId')
      .equals(sessionExerciseId)
      .filter((s) => s.syncStatus === 'synced')
      .toArray()

    for (const s of syncedSets) {
      await useOfflineQueueStore.getState().enqueue({
        table: 'set_logs',
        operation: 'delete',
        payload: { id: s.id },
        idempotencyKey: `delete-${s.id}`,
      })
    }

    await db.transaction('rw', [db.sessionExercises, db.setLogs], async () => {
      await db.setLogs.where('sessionExerciseId').equals(sessionExerciseId).delete()
      await db.sessionExercises.delete(sessionExerciseId)
    })
    set((state) => ({
      session: state.session
        ? {
            ...state.session,
            exercises: state.session.exercises.filter((e) => e.id !== sessionExerciseId),
          }
        : null,
    }))
  },

  replaceExercise: async (sessionExerciseId, newExercise) => {
    const { session } = get()
    if (!session) throw new Error('No active session')
    const existing = session.exercises.find((e) => e.id === sessionExerciseId)
    if (!existing) throw new Error(`Exercise ${sessionExerciseId} not found`)

    const newId = generateId()
    await db.transaction('rw', [db.sessionExercises, db.setLogs], async () => {
      await db.setLogs.where('sessionExerciseId').equals(sessionExerciseId).delete()
      await db.sessionExercises.delete(sessionExerciseId)
      await db.sessionExercises.add({
        id: newId,
        sessionId: session.id,
        exerciseId: newExercise.exerciseId,
        exerciseNameSnapshot: newExercise.exerciseNameSnapshot,
        displayOrder: existing.displayOrder,
        wasReplaced: true,
        originalExerciseId: existing.exerciseId,
      })
    })

    set((state) => ({
      session: state.session
        ? {
            ...state.session,
            exercises: state.session.exercises.map((e) =>
              e.id === sessionExerciseId
                ? {
                    id: newId,
                    exerciseId: newExercise.exerciseId,
                    exerciseNameSnapshot: newExercise.exerciseNameSnapshot,
                    displayOrder: e.displayOrder,
                    wasReplaced: true,
                    originalExerciseId: e.exerciseId,
                    sets: [],
                  }
                : e
            ),
          }
        : null,
    }))
  },

  reorderExercises: async (orderedIds) => {
    const { session } = get()
    if (!session) throw new Error('No active session')
    await db.transaction('rw', db.sessionExercises, async () => {
      await Promise.all(
        orderedIds.map((id, index) =>
          db.sessionExercises.update(id, { displayOrder: index })
        )
      )
    })
    set((state) => {
      if (!state.session) return state
      const reordered = orderedIds
        .map((id, index) => {
          const ex = state.session!.exercises.find((e) => e.id === id)
          return ex ? { ...ex, displayOrder: index } : null
        })
        .filter(Boolean) as typeof state.session.exercises
      return { session: { ...state.session, exercises: reordered } }
    })
  },

  updateExerciseNotes: async (sessionExerciseId, notes) => {
    await db.sessionExercises.update(sessionExerciseId, { notes })
    set((state) => ({
      session: state.session
        ? {
            ...state.session,
            exercises: state.session.exercises.map((e) =>
              e.id === sessionExerciseId ? { ...e, notes } : e
            ),
          }
        : null,
    }))
  },

  logSet: async (sessionExerciseId, input, isPr = false) => {
    const { session } = get()
    if (!session) throw new Error('No active session')
    const exercise = session.exercises.find((e) => e.id === sessionExerciseId)
    if (!exercise) throw new Error(`Exercise ${sessionExerciseId} not found`)

    const id = generateId()
    const setNumber = exercise.sets.length + 1
    const loggedAt = Date.now()

    await db.setLogs.add({
      id,
      sessionExerciseId,
      setNumber,
      weight: input.weight,
      weightUnit: input.weightUnit,
      reps: input.reps,
      setType: input.setType,
      rpe: input.rpe,
      isCompleted: true,
      isPr,
      notes: input.notes,
      loggedAt,
      syncStatus: 'local',
    })

    await useOfflineQueueStore.getState().enqueue({
      table: 'set_logs',
      operation: 'upsert',
      payload: {
        id,
        session_exercise_id: sessionExerciseId,
        set_number: setNumber,
        weight: input.weight ?? null,
        weight_unit: input.weightUnit,
        reps: input.reps ?? null,
        set_type: input.setType,
        rpe: input.rpe ?? null,
        is_completed: true,
        is_pr: isPr,
        notes: input.notes ?? null,
        logged_at: new Date(loggedAt).toISOString(),
      },
      idempotencyKey: id,
    })

    set((state) => ({
      session: state.session
        ? {
            ...state.session,
            exercises: state.session.exercises.map((e) =>
              e.id === sessionExerciseId
                ? {
                    ...e,
                    sets: [
                      ...e.sets,
                      { id, setNumber, isPr, loggedAt, ...input },
                    ],
                  }
                : e
            ),
          }
        : null,
    }))

    return id
  },

  editSet: async (setId, input) => {
    await db.setLogs.update(setId, {
      weight: input.weight,
      weightUnit: input.weightUnit,
      reps: input.reps,
      setType: input.setType,
      rpe: input.rpe,
      notes: input.notes,
      syncStatus: 'local',
    })

    const updated = await db.setLogs.get(setId)
    if (updated) {
      await useOfflineQueueStore.getState().enqueue({
        table: 'set_logs',
        operation: 'upsert',
        payload: {
          id: updated.id,
          session_exercise_id: updated.sessionExerciseId,
          set_number: updated.setNumber,
          weight: updated.weight ?? null,
          weight_unit: updated.weightUnit,
          reps: updated.reps ?? null,
          set_type: updated.setType,
          rpe: updated.rpe ?? null,
          is_completed: updated.isCompleted,
          is_pr: updated.isPr,
          notes: updated.notes ?? null,
          logged_at: new Date(updated.loggedAt).toISOString(),
        },
        idempotencyKey: setId,
      })
    }

    set((state) => ({
      session: state.session
        ? {
            ...state.session,
            exercises: state.session.exercises.map((e) => ({
              ...e,
              sets: e.sets.map((s) =>
                s.id === setId ? { ...s, ...input } : s
              ),
            })),
          }
        : null,
    }))
  },

  deleteSet: async (setId) => {
    await useOfflineQueueStore.getState().enqueue({
      table: 'set_logs',
      operation: 'delete',
      payload: { id: setId },
      idempotencyKey: `delete-${setId}`,
    })
    await db.setLogs.delete(setId)
    set((state) => ({
      session: state.session
        ? {
            ...state.session,
            exercises: state.session.exercises.map((e) => ({
              ...e,
              sets: e.sets.filter((s) => s.id !== setId),
            })),
          }
        : null,
    }))
  },

  updateSessionNotes: async (notes) => {
    const { session } = get()
    if (!session) throw new Error('No active session')
    await db.workoutSessions.update(session.id, { notes })
    set((state) => ({
      session: state.session ? { ...state.session, notes } : null,
    }))
  },

  finishSession: async () => {
    const { session } = get()
    if (!session) throw new Error('No active session')

    const totalSets = session.exercises.reduce((n, e) => n + e.sets.length, 0)
    if (totalSets === 0) throw new Error('Add at least one set before finishing')

    const finishedAt = Date.now()
    const durationSeconds = Math.floor((finishedAt - session.startedAt) / 1000)
    const totalVolume = calculateTotalVolume(session.exercises, 'kg')
    const prCount = session.exercises
      .flatMap((e) => e.sets)
      .filter((s) => s.isPr).length

    await db.workoutSessions.update(session.id, {
      status: 'completed',
      finishedAt,
      syncStatus: 'pending_sync',
    })

    const finished: FinishedSession = {
      ...session,
      status: 'completed',
      finishedAt,
      durationSeconds,
      totalVolume,
      prCount,
    }

    set({ session: null })
    return finished
  },

  discardSession: async () => {
    const { session } = get()
    if (!session) return

    const totalSets = session.exercises.reduce((n, e) => n + e.sets.length, 0)
    const finalStatus = totalSets === 0 ? 'discarded' : 'cancelled'

    await db.transaction(
      'rw',
      [db.workoutSessions, db.sessionExercises, db.setLogs],
      async () => {
        const exerciseIds = session.exercises.map((e) => e.id)
        await db.setLogs
          .where('sessionExerciseId')
          .anyOf(exerciseIds)
          .delete()
        await db.sessionExercises.where('sessionId').equals(session.id).delete()
        await db.workoutSessions.update(session.id, { status: finalStatus })
      }
    )

    set({ session: null })
  },
}))
