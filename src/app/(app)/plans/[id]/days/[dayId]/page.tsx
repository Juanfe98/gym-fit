'use client'

import { useParams, useRouter } from 'next/navigation'
import { usePlanDays } from '@/modules/workout-plans/hooks/use-plans'
import { WorkoutDayEditor } from '@/modules/workout-plans/components/WorkoutDayEditor'

export default function DayEditorPage() {
  const router = useRouter()
  const { id: planId, dayId } = useParams<{ id: string; dayId: string }>()
  const { days, isLoading } = usePlanDays(planId)
  const day = days?.find((d) => d.id === dayId)

  if (isLoading) {
    return <div className="px-4 pt-4 text-sm text-gym-muted">Loading…</div>
  }

  if (!day) {
    return (
      <div className="px-4 pt-4">
        <p className="text-gym-muted text-sm">Day not found</p>
        <button onClick={() => router.back()} className="mt-2 text-gym-accent text-sm underline">
          Go back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gym-bg pb-20">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <button
          onClick={() => router.back()}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gym-muted"
        >
          ←
        </button>
      </div>
      <WorkoutDayEditor day={day} planId={planId} />
    </div>
  )
}
