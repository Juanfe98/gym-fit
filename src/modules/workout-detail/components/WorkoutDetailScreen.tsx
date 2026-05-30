'use client'

import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowLeft, Dumbbell, Plus } from 'lucide-react'
import Link from 'next/link'
import { EmptyState, SectionLabel } from '@/components/ui'
import { useI18n } from '@/i18n/client'
import { useWorkoutDetail } from '../hooks/use-workout-detail'
import { WorkoutHeader } from './WorkoutHeader'
import { ExerciseListItem } from './ExerciseListItem'

interface WorkoutDetailScreenProps {
  workoutId: string
}

const DEFAULT_REST_SECONDS = 90
const DEFAULT_SECONDS_PER_SET = 35

function estimateMinutes(exercises: Array<{ targetSets: number | null; restSeconds: number | null }>): number {
  if (exercises.length === 0) return 0
  const total = exercises.reduce((acc, ex) => {
    const sets = ex.targetSets ?? 3
    const rest = ex.restSeconds ?? DEFAULT_REST_SECONDS
    return acc + sets * DEFAULT_SECONDS_PER_SET + Math.max(sets - 1, 0) * rest
  }, 0)
  return Math.max(1, Math.round(total / 60))
}

export function WorkoutDetailScreen({ workoutId }: WorkoutDetailScreenProps) {
  const { t } = useI18n()
  const router = useRouter()
  const { detail, isLoading, isError, refetch } = useWorkoutDetail(workoutId)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gym-bg px-4 pt-6 text-sm text-gym-muted">
        {t('loading')}
      </div>
    )
  }

  if (isError || !detail) {
    return (
      <div className="min-h-screen bg-gym-bg pb-20">
        <div className="flex items-center gap-2 px-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-gym-muted"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
        <EmptyState
          Icon={AlertCircle}
          title={t('workoutDetailLoadErrorTitle')}
          message={t('workoutDetailLoadErrorMessage')}
          action={
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-full bg-gym-accent px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              {t('retry')}
            </button>
          }
        />
      </div>
    )
  }

  const { day, plan, exercises } = detail
  const estimatedMinutes = estimateMinutes(exercises)
  const hasExercises = exercises.length > 0

  return (
    <div className="min-h-screen bg-gym-bg pb-24">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center text-gym-muted"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <WorkoutHeader detail={detail} estimatedMinutes={estimatedMinutes} />

      {plan.description && (
        <section className="mt-6 flex flex-col gap-2 px-4">
          <SectionLabel>{t('workoutDetailOverview')}</SectionLabel>
          <p className="text-sm leading-relaxed text-gym-text">{plan.description}</p>
        </section>
      )}

      <section className="mt-6 flex flex-col gap-3 px-4">
        <div className="flex items-center justify-between">
          <SectionLabel>{t('workoutDetailMainWorkout')}</SectionLabel>
          {hasExercises && (
            <span className="text-xs text-gym-muted">
              {exercises.length} {t('exercises')}
            </span>
          )}
        </div>
        {hasExercises ? (
          <div className="flex flex-col gap-2">
            {exercises.map((ex, i) => (
              <ExerciseListItem key={ex.id} exercise={ex} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            Icon={Dumbbell}
            title={t('workoutDetailNoExercisesTitle')}
            message={t('workoutDetailNoExercisesMessage')}
            action={
              <Link
                href={`/plans/${plan.id}/days/${day.id}`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gym-accent px-4 text-sm font-semibold text-white hover:bg-orange-600"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                {t('workoutDetailAddExercises')}
              </Link>
            }
          />
        )}
      </section>
    </div>
  )
}
