import { create } from 'zustand'
import { db } from '@/lib/offline-db'
import { generateId } from '../utils/idempotency'
import { calculateTotalVolume } from '../utils/volume'
import type {
  ActiveSessionDraft,
  FinishedSession,
  SetInput,
} from '../types'

interface StartSessionOptions {
  sourcePlanId?: string
  sourceWorkoutDayId?: string
}

interface ExerciseRef {
  exerciseId: string
  exerciseNameSnapshot: string
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
  logSet: (sessionExerciseId: string, input: SetInput) => Promise<string>
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
              },
            ],
          }
        : null,
    }))
  },

  removeExercise: async (sessionExerciseId) => {
    const { session } = get()
    if (!session) throw new Error('No active session')
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

  logSet: async (sessionExerciseId, input) => {
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
      isPr: false,
      notes: input.notes,
      loggedAt,
      syncStatus: 'local',
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
                      { id, setNumber, isPr: false, loggedAt, ...input },
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
