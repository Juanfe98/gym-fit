'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Dumbbell, RotateCcw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { db } from '@/lib/offline-db'
import { useWorkoutSessionStore } from '@/modules/workout-session/stores/workout-session-store'
import { ActiveWorkoutScreen } from '@/modules/workout-session/components/ActiveWorkoutScreen'
import { useI18n } from '@/i18n/client'
import { getPlanExercises } from '@/modules/workout-plans/services/exercises-service'
import { EXERCISE_CATALOG } from '@/data/exercises/catalog'
import type { OfflineWorkoutSession } from '@/lib/offline-db'
import type { ExerciseKey } from '@/types'

type PageStatus = 'checking' | 'plan_loading' | 'idle' | 'recovered' | 'active'

export default function WorkoutPage() {
  const { t } = useI18n()
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <span className="text-sm text-gym-muted">{t('loading')}</span>
        </div>
      }
    >
      <WorkoutPageContent />
    </Suspense>
  )
}

function WorkoutPageContent() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const router = useRouter()
  const session = useWorkoutSessionStore((s) => s.session)
  const startSession = useWorkoutSessionStore((s) => s.startSession)
  const addExercise = useWorkoutSessionStore((s) => s.addExercise)
  const recoverSession = useWorkoutSessionStore((s) => s.recoverSession)
  const discardSession = useWorkoutSessionStore((s) => s.discardSession)

  const [status, setStatus] = useState<PageStatus>('checking')
  const [recoverable, setRecoverable] = useState<OfflineWorkoutSession | null>(null)
  const startedRef = useRef(false)

  const planId = searchParams.get('planId')
  const dayId = searchParams.get('dayId')
  const planName = searchParams.get('planName')
  const dayName = searchParams.get('dayName')

  async function handlePlanDayStart(
    pId: string,
    dId: string,
    pName: string,
    dName: string,
  ) {
    if (startedRef.current) return
    startedRef.current = true
    setStatus('plan_loading')
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setStatus('idle'); return }
      const exercises = await getPlanExercises(dId)
      if (exercises.length === 0) { setStatus('idle'); return }
      await startSession(user.id, {
        sourcePlanId: pId,
        sourceWorkoutDayId: dId,
        sourcePlanName: pName,
        sourceDayName: dName,
      })
      for (const ex of exercises) {
        await addExercise({
          exerciseId: ex.exerciseId,
          exerciseNameSnapshot:
            EXERCISE_CATALOG[ex.exerciseId as ExerciseKey]?.displayName ?? ex.exerciseId,
          targetSets: ex.targetSets ?? undefined,
          targetReps: ex.targetReps ?? undefined,
          targetRepRangeMin: ex.targetRepRangeMin ?? undefined,
          targetRepRangeMax: ex.targetRepRangeMax ?? undefined,
          targetWeight: ex.targetWeight ?? undefined,
        })
      }
      router.replace('/workout')
      setStatus('active')
    } catch {
      setStatus('idle')
    }
  }

  useEffect(() => {
    if (session) {
      setStatus('active')
      return
    }

    if (planId && dayId && planName && dayName) {
      db.workoutSessions
        .where('status')
        .equals('in_progress')
        .first()
        .then((found) => {
          if (found) {
            setRecoverable(found)
            setStatus('recovered')
          } else {
            handlePlanDayStart(planId, dayId, planName, dayName)
          }
        })
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (status === 'checking' || status === 'plan_loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-sm text-gym-muted">
          {status === 'plan_loading' ? t('loadingPlanExercises') : t('loading')}
        </span>
      </div>
    )
  }

  if (status === 'active' || session) {
    return <ActiveWorkoutScreen />
  }

  if (status === 'recovered' && recoverable) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 px-6">
        <div className="card-elevated flex w-full max-w-xs flex-col items-center gap-5 p-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gym-accent-subtle text-gym-accent">
            <RotateCcw className="h-7 w-7" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="heading text-xl text-gym-text">{t('resumeWorkoutTitle')}</h2>
            <p className="text-sm text-gym-muted">{t('resumeWorkoutMessage')}</p>
          </div>
          <div className="flex w-full flex-col gap-3">
            <button
              type="button"
              onClick={handleResume}
              className="glow-accent h-11 rounded-lg bg-gym-accent font-semibold text-white transition-all hover:bg-orange-600 active:scale-[0.98]"
            >
              {t('resume')}
            </button>
            <button
              type="button"
              onClick={handleDiscard}
              className="h-11 rounded-lg border border-gym-border text-sm font-medium text-gym-muted transition-colors active:bg-gym-surface-2"
            >
              {t('discard')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-8 px-8 text-center">
      <div className="flex flex-col items-center gap-5">
        <span className="glow-accent flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-orange-700">
          <Dumbbell className="h-10 w-10 text-white" strokeWidth={2} aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="heading text-4xl text-gym-text">{t('readyToTrain')}</h1>
          <p className="max-w-xs text-sm text-gym-muted">{t('workoutIdleSubtitle')}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleStart}
        className="glow-accent h-12 w-full max-w-xs rounded-xl bg-gym-accent text-base font-semibold text-white transition-all hover:bg-orange-600 active:scale-[0.98]"
      >
        {t('startWorkout')}
      </button>
    </div>
  )
}
