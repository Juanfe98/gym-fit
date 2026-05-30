'use client'

import { Dumbbell } from 'lucide-react'
import { EXERCISE_CATALOG } from '@/data/exercises/catalog'
import { useI18n } from '@/i18n/client'
import { exerciseDisplayNames } from '@/i18n/content'
import type { PlanExercise } from '@/modules/workout-plans/types'
import type { ExerciseKey } from '@/types'

interface ExerciseListItemProps {
  exercise: PlanExercise
  index: number
}

function formatRepRange(ex: PlanExercise): string | null {
  if (ex.targetRepRangeMin != null && ex.targetRepRangeMax != null) {
    return `${ex.targetRepRangeMin}–${ex.targetRepRangeMax}`
  }
  if (ex.targetReps != null) return String(ex.targetReps)
  return null
}

export function ExerciseListItem({ exercise, index }: ExerciseListItemProps) {
  const { t, lang } = useI18n()
  const key = exercise.exerciseId as ExerciseKey
  const localized = exerciseDisplayNames[lang]?.[key]
  const catalog = EXERCISE_CATALOG[key]
  const displayName = localized ?? catalog?.displayName ?? exercise.exerciseId
  const reps = formatRepRange(exercise)
  const sets = exercise.targetSets ?? null

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-gym-surface-2 p-3">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gym-surface-3 text-gym-muted"
        aria-hidden="true"
      >
        <Dumbbell className="h-5 w-5" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold text-gym-muted">{String(index + 1).padStart(2, '0')}</span>
          <p className="truncate text-sm font-semibold text-gym-text">{displayName}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gym-muted">
          {sets != null && reps != null && (
            <span>
              {sets} {t('sets')} × {reps} {t('reps').toLowerCase()}
            </span>
          )}
          {sets != null && reps == null && (
            <span>
              {sets} {t('sets')}
            </span>
          )}
          {exercise.targetWeight != null && <span>{exercise.targetWeight} kg</span>}
          {exercise.restSeconds != null && (
            <span>
              {t('rest')} {exercise.restSeconds}s
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
