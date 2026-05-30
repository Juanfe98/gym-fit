import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { fetchHistoryList } from '@/modules/workout-history/services/history-supabase'
import type { WorkoutHistorySummary } from '@/modules/workout-history/types'

export function useRecentWorkoutsList(userId: string, limit = 5): {
  data: WorkoutHistorySummary[] | undefined
  isLoading: boolean
  isError: boolean
  refetch: () => void
} {
  const supabase = useMemo(() => createClient(), [])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard', 'recent-workouts', userId, limit],
    queryFn: async () => {
      const result = await fetchHistoryList({ supabase, userId, limit })
      if (result.error) throw new Error(result.error)
      return result.data ?? []
    },
    enabled: !!userId,
  })

  return { data, isLoading, isError, refetch }
}
