import { create } from 'zustand'
import type { DateRangeFilter } from '../types'

interface HistoryFilterState {
  dateRange: DateRangeFilter
  exerciseSearch: string
  setDateRange: (dateRange: DateRangeFilter) => void
  setExerciseSearch: (exerciseSearch: string) => void
  clearFilters: () => void
}

export const useHistoryFilterStore = create<HistoryFilterState>((set) => ({
  dateRange: null,
  exerciseSearch: '',
  setDateRange: (dateRange) => set({ dateRange }),
  setExerciseSearch: (exerciseSearch) => set({ exerciseSearch }),
  clearFilters: () => set({ dateRange: null, exerciseSearch: '' }),
}))
