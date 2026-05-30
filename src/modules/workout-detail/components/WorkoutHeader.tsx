'use client'

import { useRouter } from 'next/navigation'
import { Clock, Dumbbell, Target, Zap } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import type { WorkoutDetail } from '../types'

interface WorkoutHeaderProps {
  detail: WorkoutDetail
  estimatedMinutes: number
}

const LEVEL_COLOR: Record<string, string> = {
  beginner: 'text-emerald-400',
  intermediate: 'text-yellow-400',
  advanced: 'text-gym-accent',
}

export function WorkoutHeader({ detail, estimatedMinutes }: WorkoutHeaderProps) {
  const { t } = useI18n()
  const router = useRouter()
  const { day, plan, exercises } = detail
  const exerciseCount = exercises.length

  function handleStart() {
    const params = new URLSearchParams({
      planId: plan.id,
      dayId: day.id,
      planName: plan.name,
      dayName: day.name,
    })
    router.push(`/workout?${params.toString()}`)
  }

  return (
    <section className="flex flex-col gap-4 px-4 pt-2">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-gym-muted">
          {plan.name}
        </p>
        <h1 className="heading text-3xl text-gym-text">{day.name}</h1>
        {day.targetMuscleGroups.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {day.targetMuscleGroups.map((m) => (
              <span
                key={m}
                className="inline-flex items-center rounded-full bg-gym-surface-2 px-3 py-1 text-xs font-medium text-gym-muted"
              >
                {m}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="card flex flex-col gap-1 p-3">
          <div className="flex items-center gap-1.5 text-gym-muted">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wide">
              {t('workoutDetailDuration')}
            </span>
          </div>
          <span className="metric text-2xl text-gym-text">
            {estimatedMinutes}
            <span className="ml-1 text-xs font-medium text-gym-muted">min</span>
          </span>
        </div>
        <div className="card flex flex-col gap-1 p-3">
          <div className="flex items-center gap-1.5 text-gym-muted">
            <Dumbbell className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wide">
              {t('exercises')}
            </span>
          </div>
          <span className="metric text-2xl text-gym-text">{exerciseCount}</span>
        </div>
        <div className="card flex flex-col gap-1 p-3">
          <div className="flex items-center gap-1.5 text-gym-muted">
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wide">
              {t('workoutDetailLevel')}
            </span>
          </div>
          <span
            className={`metric text-2xl ${LEVEL_COLOR[plan.level] ?? 'text-gym-text'}`}
          >
            {t(`level_${plan.level}` as 'level_beginner')}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleStart}
          disabled={exerciseCount === 0}
          className="glow-accent flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-gym-accent text-base font-semibold text-white transition-all hover:bg-orange-600 active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-gym-disabled disabled:text-gym-muted"
        >
          <Target className="h-4 w-4" aria-hidden="true" />
          {t('startWorkout')}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/plans/${plan.id}/days/${day.id}`)}
          className="flex min-h-[44px] items-center justify-center rounded-2xl bg-gym-surface-2 text-sm font-medium text-gym-text transition-colors hover:bg-gym-surface-3"
        >
          {t('workoutDetailEdit')}
        </button>
      </div>
    </section>
  )
}
