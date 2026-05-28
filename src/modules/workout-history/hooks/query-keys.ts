import type { DateRangeFilter } from '../types'

export const historyKeys = {
  all: ['workout-history'] as const,

  lists: () => [...historyKeys.all, 'list'] as const,

  list: (filters: { dateRange: DateRangeFilter; exerciseSearch: string }) =>
    [...historyKeys.lists(), filters] as const,

  details: () => [...historyKeys.all, 'detail'] as const,

  detail: (sessionId: string) =>
    [...historyKeys.details(), sessionId] as const,
}
