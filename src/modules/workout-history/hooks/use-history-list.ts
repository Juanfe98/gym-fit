import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { historyKeys } from './query-keys'
import { fetchHistoryList, type FetchHistoryListResult } from '../services/history-supabase'
import type { HistoryFilters } from '../types'

export function useHistoryList({
  userId,
  filters,
  sessionIds = null,
  initialData,
}: {
  userId: string
  filters: HistoryFilters
  sessionIds?: string[] | null
  initialData?: FetchHistoryListResult
}) {
  const supabase = useMemo(() => createClient(), [])

  // Key uses dateRange + sessionIds — not exerciseSearch — to avoid refetch
  // while the debounce/search is still pending (which would flash unfiltered results).
  const queryKey = [
    ...historyKeys.list({ dateRange: filters.dateRange, exerciseSearch: '' }),
    { sessionIds: sessionIds ?? null },
  ]

  const hydratedInitialData =
    initialData && initialData.data !== null
      ? { pages: [initialData], pageParams: [undefined as string | undefined] }
      : undefined

  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      fetchHistoryList({
        supabase,
        userId,
        dateRange: filters.dateRange,
        sessionIds: sessionIds ?? undefined,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: FetchHistoryListResult) => {
      if (!lastPage.data || !lastPage.hasMore) return undefined
      return lastPage.data[lastPage.data.length - 1]?.startedAt ?? undefined
    },
    initialData: hydratedInitialData,
  })
}
