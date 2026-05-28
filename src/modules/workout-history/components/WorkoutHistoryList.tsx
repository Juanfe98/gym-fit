'use client'

import { useHistoryList } from '../hooks/use-history-list'
import { useExerciseNameSearch } from '../hooks/use-exercise-name-search'
import { useHistoryFilterStore } from '../stores/history-filter-store'
import { WorkoutHistoryCard } from './WorkoutHistoryCard'
import { HistoryEmptyState } from './HistoryEmptyState'
import { HistoryFilters } from './HistoryFilters'
import type { FetchHistoryListResult } from '../services/history-supabase'
import type { HistoryFilters as HistoryFiltersType } from '../types'

interface WorkoutHistoryListProps {
  userId: string
  initialData: FetchHistoryListResult
}

export function WorkoutHistoryList({ userId, initialData }: WorkoutHistoryListProps) {
  const dateRange = useHistoryFilterStore((s) => s.dateRange)
  const exerciseSearch = useHistoryFilterStore((s) => s.exerciseSearch)
  const clearFilters = useHistoryFilterStore((s) => s.clearFilters)

  const { sessionIds, isSearching } = useExerciseNameSearch(exerciseSearch)

  const filters: HistoryFiltersType = { dateRange, exerciseSearch }
  const isFiltered = dateRange !== null || exerciseSearch !== ''

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useHistoryList({
    userId,
    filters,
    sessionIds,
    initialData,
  })

  const sessions = data?.pages.flatMap((p) => p.data ?? []) ?? []

  return (
    <div className="flex flex-col gap-4">
      <HistoryFilters isSearching={isSearching} />

      {sessions.length === 0 ? (
        isFiltered ? (
          <HistoryEmptyState variant="filtered" onClearFilter={clearFilters} />
        ) : (
          <HistoryEmptyState variant="no-history" />
        )
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((session) => (
            <WorkoutHistoryCard key={session.id} session={session} />
          ))}
          {hasNextPage && (
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="min-h-[44px] w-full rounded border border-gym-border text-sm text-gym-muted disabled:opacity-50"
            >
              {isFetchingNextPage ? 'Loading…' : 'Load more'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
