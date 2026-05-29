import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { fetchHistoryList } from '@/modules/workout-history/services/history-supabase'

export function useRecentWorkout(userId: string) {
  const supabase = useMemo(() => createClient(), [])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['home', 'recent-workout', userId],
    queryFn: async () => {
      const result = await fetchHistoryList({ supabase, userId, limit: 1 })
      if (result.error) throw new Error(result.error)
      return result.data?.[0] ?? null
    },
  })

  return { data, isLoading, isError, refetch }
}
