'use client'

import { useI18n } from '@/i18n/client'
import { PrBadge } from '@/modules/workout-session/components/PrBadge'
import type { WorkoutHistoryExercise } from '../types'

interface ExerciseSetGroupProps {
  exercise: WorkoutHistoryExercise
}

export function ExerciseSetGroup({ exercise }: ExerciseSetGroupProps) {
  const { t } = useI18n()
  return (
    <div className="flex flex-col gap-2">
      <div>
        <h4 className="text-sm font-semibold">{exercise.exerciseNameSnapshot}</h4>
        {exercise.wasReplaced && (
          <p className="text-xs text-gym-muted">{t('historyDetailReplaced')}</p>
        )}
        {exercise.notes && (
          <p className="text-xs text-gym-muted">{exercise.notes}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        {exercise.sets.map((set) => {
          const isWarmup = set.setType === 'warmup'
          return (
            <div
              key={set.id}
              className={`flex items-center gap-3 text-xs ${isWarmup ? 'opacity-60' : ''}`}
            >
              <span className="w-5 shrink-0 text-center text-gym-muted">{set.setNumber}</span>
              {isWarmup && (
                <span className="rounded bg-gym-border px-1.5 py-0.5 text-[10px] text-gym-muted">
                  {t('historyDetailWarmup')}
                </span>
              )}
              <span className="w-20 shrink-0">
                {set.weight != null ? `${set.weight} ${set.weightUnit}` : '—'}
              </span>
              <span className="w-14 shrink-0">
                {set.reps != null ? `${set.reps} ${t('historyDetailReps')}` : '—'}
              </span>
              {set.rpe != null && (
                <span className="text-gym-muted">{t('historyDetailRpe')} {set.rpe}</span>
              )}
              {set.isPr && <PrBadge isNew={false} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
