'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { db } from '@/lib/offline-db'
import { useWorkoutSessionStore } from '@/modules/workout-session/stores/workout-session-store'
import { ActiveWorkoutScreen } from '@/modules/workout-session/components/ActiveWorkoutScreen'
import type { OfflineWorkoutSession } from '@/lib/offline-db'

type PageStatus = 'checking' | 'idle' | 'recovered' | 'active'

export default function WorkoutPage() {
  const session = useWorkoutSessionStore((s) => s.session)
  const startSession = useWorkoutSessionStore((s) => s.startSession)
  const recoverSession = useWorkoutSessionStore((s) => s.recoverSession)
  const discardSession = useWorkoutSessionStore((s) => s.discardSession)

  const [status, setStatus] = useState<PageStatus>('checking')
  const [recoverable, setRecoverable] = useState<OfflineWorkoutSession | null>(null)

  useEffect(() => {
    if (session) {
      setStatus('active')
      return
    }

    db.workoutSessions
      .where('status')
      .equals('in_progress')
      .first()
      .then((found) => {
        if (found) {
          setRecoverable(found)
          setStatus('recovered')
        } else {
          setStatus('idle')
        }
      })
  }, [session])

  async function handleStart() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await startSession(user.id)
    setStatus('active')
  }

  async function handleResume() {
    if (!recoverable) return
    await recoverSession(recoverable.id)
    setStatus('active')
  }

  async function handleDiscard() {
    if (!recoverable) return
    await db.workoutSessions.update(recoverable.id, { status: 'discarded' })
    setRecoverable(null)
    setStatus('idle')
  }

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-sm text-gym-muted">Loading…</span>
      </div>
    )
  }

  if (status === 'active' || session) {
    return <ActiveWorkoutScreen />
  }

  if (status === 'recovered' && recoverable) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-8 text-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Resume workout?</h2>
          <p className="text-sm text-gym-muted">
            An unfinished session was found. Resume where you left off or discard it.
          </p>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-3">
          <button
            type="button"
            onClick={handleResume}
            className="h-11 rounded bg-orange-500 font-semibold text-white"
          >
            Resume
          </button>
          <button
            type="button"
            onClick={handleDiscard}
            className="h-11 rounded border border-gym-border text-sm text-gym-muted"
          >
            Discard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-8">
      <h1 className="text-2xl font-bold">Ready to train?</h1>
      <button
        type="button"
        onClick={handleStart}
        className="h-11 w-full max-w-xs rounded bg-orange-500 font-semibold text-white"
      >
        Start Workout
      </button>
    </div>
  )
}
