'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dumbbell } from 'lucide-react'
import { useWorkoutSessionStore } from '../stores/workout-session-store'
import { useTimerStore } from '../stores/timer-store'
import { useOfflineSync } from '../hooks/use-offline-sync'
import { SessionTimer } from './SessionTimer'
import { SyncStatusBar } from './SyncStatusBar'
import { ExerciseList } from './ExerciseList'
import { ExercisePicker } from './ExercisePicker'
import { RestTimer } from './RestTimer'
import { CancelSessionDialog } from './CancelSessionDialog'

export function ActiveWorkoutScreen() {
  const session = useWorkoutSessionStore((s) => s.session)
  const addExercise = useWorkoutSessionStore((s) => s.addExercise)
  const finishSession = useWorkoutSessionStore((s) => s.finishSession)
  const discardSession = useWorkoutSessionStore((s) => s.discardSession)
  const startSessionTimer = useTimerStore((s) => s.startSessionTimer)
  const stopSessionTimer = useTimerStore((s) => s.stopSessionTimer)

  useOfflineSync()

  const [showPicker, setShowPicker] = useState(false)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const router = useRouter()

  useEffect(() => {
    startSessionTimer()
    return () => stopSessionTimer()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalSets = session?.exercises.reduce((n, e) => n + e.sets.length, 0) ?? 0

  async function handleFinish() {
    if (totalSets === 0) return
    const finished = await finishSession()
    sessionStorage.setItem('finishedSession', JSON.stringify(finished))
    router.push('/workout/summary')
  }

  function handleCancelPress() {
    if (totalSets === 0) {
      void discardSession().then(() => router.push('/'))
    } else {
      setShowDiscardDialog(true)
    }
  }

  async function handleDiscardConfirm() {
    await discardSession()
    setShowDiscardDialog(false)
    router.push('/')
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gym-border px-4 py-2">
        <SessionTimer />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancelPress}
            className="flex min-h-[44px] items-center px-3 text-sm text-gym-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleFinish}
            disabled={totalSets === 0}
            className="glow-accent flex min-h-[44px] items-center rounded-lg bg-gym-accent px-4 text-sm font-semibold text-white transition-all hover:bg-orange-600 active:scale-[0.97] disabled:opacity-40 disabled:shadow-none"
            title={totalSets === 0 ? 'Add at least one set to finish' : undefined}
          >
            Finish
          </button>
        </div>
      </header>

      <SyncStatusBar />

      {totalSets === 0 && (session?.exercises.length ?? 0) > 0 && (
        <p className="bg-gym-surface px-4 py-1.5 text-center text-xs text-gym-muted">
          Add at least one set to finish
        </p>
      )}

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        {session?.exercises.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gym-surface-2 text-gym-muted">
              <Dumbbell className="h-10 w-10" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold">Add your first exercise</p>
              <p className="text-sm text-gym-muted">Tap below to search the exercise library</p>
            </div>
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="glow-accent h-12 rounded-lg bg-gym-accent px-8 font-semibold text-white transition-all hover:bg-orange-600 active:scale-[0.97]"
            >
              Add Exercise
            </button>
          </div>
        ) : (
          <ExerciseList />
        )}
      </main>

      {/* Floating add button — visible once at least one exercise exists */}
      {session && session.exercises.length > 0 && (
        <div className="fixed bottom-20 right-4">
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="glow-accent flex h-14 w-14 items-center justify-center rounded-full bg-gym-accent text-2xl font-light text-white shadow-lg transition-all hover:bg-orange-600 active:scale-95"
            aria-label="Add exercise"
          >
            +
          </button>
        </div>
      )}

      {showPicker && (
        <ExercisePicker
          onSelect={async (ref) => {
            await addExercise(ref)
            setShowPicker(false)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}

      <RestTimer />

      {showDiscardDialog && (
        <CancelSessionDialog
          title="Discard workout?"
          message="All logged sets will be lost. This session will not be saved."
          confirmLabel="Discard Workout"
          onConfirm={handleDiscardConfirm}
          onCancel={() => setShowDiscardDialog(false)}
        />
      )}
    </div>
  )
}
