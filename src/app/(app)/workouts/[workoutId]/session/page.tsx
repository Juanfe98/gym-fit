'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { EmptyState } from '@/components/ui'
import { useI18n } from '@/i18n/client'
import { useWorkoutDetail } from '@/modules/workout-detail'

export default function WorkoutSessionPage() {
  const { workoutId } = useParams<{ workoutId: string }>()
  const router = useRouter()
  const { t } = useI18n()
  const { detail, isLoading, isError, refetch } = useWorkoutDetail(workoutId)

  useEffect(() => {
    if (!detail) return
    const { plan, day } = detail
    const params = new URLSearchParams({
      planId: plan.id,
      dayId: day.id,
      planName: plan.name,
      dayName: day.name,
    })
    router.replace(`/workout?${params.toString()}`)
  }, [detail, router])

  if (isError) {
    return (
      <div className="min-h-screen bg-gym-bg pb-20 pt-10">
        <EmptyState
          Icon={AlertCircle}
          title={t('workoutSessionLoadErrorTitle')}
          message={t('workoutSessionLoadErrorMessage')}
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gym-bg">
      <span className="text-sm text-gym-muted">
        {isLoading ? t('loading') : t('startingWorkout')}
      </span>
    </div>
  )
}
