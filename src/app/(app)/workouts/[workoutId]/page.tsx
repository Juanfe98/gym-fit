'use client'

import { useParams } from 'next/navigation'
import { WorkoutDetailScreen } from '@/modules/workout-detail'

export default function WorkoutDetailPage() {
  const { workoutId } = useParams<{ workoutId: string }>()
  return <WorkoutDetailScreen workoutId={workoutId} />
}
