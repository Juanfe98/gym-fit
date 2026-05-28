'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkoutSessionStore } from '../stores/workout-session-store'
import { useTimerStore } from '../stores/timer-store'
import { SessionTimer } from './SessionTimer'
import { SyncStatusBar } from './SyncStatusBar'
import { ExerciseList } from './ExerciseList'
import { ExercisePicker } from './ExercisePicker'

export function ActiveWorkoutScreen() {
  const session = useWorkoutSessionStore((s) => s.session)
  const addExercise = useWorkoutSessionStore((s) => s.addExercise)
  const finishSession = useWorkoutSessionStore((s) => s.finishSession)
  const discardSession = useWorkoutSessionStore((s) => s.discardSession)
  const startSessionTimer = useTimerStore((s) => s.startSessionTimer)
  const stopSessionTimer = useTimerStore((s) => s.stopSessionTimer)

  const [showPicker, setShowPicker] = useState(false)
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

  async function handleDiscard() {
    await discardSession()
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gym-border px-4 py-2">
        <SessionTimer />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDiscard}
            className="flex min-h-[44px] items-center px-3 text-sm text-gym-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleFinish}
            disabled={totalSets === 0}
            className="flex min-h-[44px] items-center rounded bg-orange-500 px-4 text-sm font-semibold text-white disabled:opacity-40"
            title={totalSets === 0 ? 'Add at least one set to finish' : undefined}
          >
            Finish
          </button>
        </div>
      </header>

      <SyncStatusBar />

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        {session?.exercises.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-gym-muted">Add your first exercise to get started</p>
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="h-11 rounded bg-orange-500 px-6 font-semibold text-white"
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
            className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-2xl text-white shadow-lg"
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
    </div>
  )
}
