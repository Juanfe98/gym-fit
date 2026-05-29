'use client'

import { Search, X } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { useHistoryFilterStore } from '../stores/history-filter-store'
import type { DateRangeFilter } from '../types'

const DATE_OPTIONS: { value: DateRangeFilter; labelKey: string }[] = [
  { value: null, labelKey: 'historyDateAll' },
  { value: '7d', labelKey: 'historyDate7d' },
  { value: '30d', labelKey: 'historyDate30d' },
  { value: '90d', labelKey: 'historyDate90d' },
  { value: '180d', labelKey: 'historyDate180d' },
  { value: '365d', labelKey: 'historyDate365d' },
]

interface HistoryFiltersProps {
  isSearching?: boolean
}

export function HistoryFilters({ isSearching = false }: HistoryFiltersProps) {
  const { t } = useI18n()
  const dateRange = useHistoryFilterStore((s) => s.dateRange)
  const exerciseSearch = useHistoryFilterStore((s) => s.exerciseSearch)
  const setDateRange = useHistoryFilterStore((s) => s.setDateRange)
  const setExerciseSearch = useHistoryFilterStore((s) => s.setExerciseSearch)

  return (
    <div className="flex flex-col gap-2">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {DATE_OPTIONS.map((opt) => {
          const active = dateRange === opt.value
          return (
            <button
              key={opt.value ?? 'all'}
              type="button"
              onClick={() => setDateRange(opt.value)}
              className={`min-h-[44px] shrink-0 rounded-full border px-4 text-sm font-medium transition-colors ${
                active
                  ? 'border-gym-accent bg-gym-accent text-white'
                  : 'border-gym-border text-gym-muted'
              }`}
            >
              {t(opt.labelKey)}
            </button>
          )
        })}
      </div>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gym-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          value={exerciseSearch}
          onChange={(e) => setExerciseSearch(e.target.value)}
          placeholder={t('historySearchPlaceholder')}
          className="min-h-[44px] w-full rounded-full bg-gym-surface-2 pl-9 pr-9 text-sm text-gym-text placeholder:text-gym-muted focus:outline-none focus:ring-1 focus:ring-gym-border-strong"
        />
        {isSearching && !exerciseSearch && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gym-muted">
            …
          </span>
        )}
        {exerciseSearch && (
          <button
            type="button"
            onClick={() => setExerciseSearch('')}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gym-muted"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}
