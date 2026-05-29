'use client'

import { Search, X, ChevronDown, Heart } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { Chip } from '@/components/ui'
import type { ExerciseFilterState } from '@/modules/exercises/types'
import { BODY_PARTS, EQUIPMENT_OPTIONS } from '@/modules/exercises/hooks/use-exercise-search'

interface ExerciseFiltersProps {
  filters: ExerciseFilterState
  onChange: (f: ExerciseFilterState) => void
}

export function ExerciseFilters({ filters, onChange }: ExerciseFiltersProps) {
  const { t } = useI18n()

  function update(patch: Partial<ExerciseFilterState>) {
    onChange({ ...filters, page: 0, ...patch })
  }

  const selectClass =
    'min-h-[44px] w-full appearance-none rounded-lg bg-gym-surface-2 pl-3 pr-8 text-sm text-gym-text focus:outline-none focus:ring-1 focus:ring-gym-border-strong'

  return (
    <div className="sticky top-0 z-20 flex flex-col gap-2 border-b border-gym-border-subtle bg-gym-bg px-4 py-3">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gym-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          value={filters.query}
          onChange={(e) => update({ query: e.target.value })}
          placeholder={t('exerciseSearch')}
          className="min-h-[44px] w-full rounded-full bg-gym-surface-2 pl-9 pr-9 text-sm text-gym-text placeholder:text-gym-muted focus:outline-none focus:ring-1 focus:ring-gym-border-strong"
        />
        {filters.query && (
          <button
            type="button"
            onClick={() => update({ query: '' })}
            aria-label={t('clearFilters')}
            className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gym-muted"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <select
            value={filters.bodyPart}
            onChange={(e) => update({ bodyPart: e.target.value })}
            className={selectClass}
            aria-label={t('filterMuscle')}
          >
            <option value="">{t('allMuscles')}</option>
            {BODY_PARTS.map((bp) => (
              <option key={bp} value={bp}>
                {bp}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gym-muted"
            aria-hidden="true"
          />
        </div>
        <div className="relative flex-1">
          <select
            value={filters.equipment}
            onChange={(e) => update({ equipment: e.target.value })}
            className={selectClass}
            aria-label={t('filterEquipment')}
          >
            <option value="">{t('allEquipment')}</option>
            {EQUIPMENT_OPTIONS.map((eq) => (
              <option key={eq} value={eq}>
                {eq}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gym-muted"
            aria-hidden="true"
          />
        </div>
      </div>

      <Chip
        active={filters.favoritesOnly}
        onClick={() => update({ favoritesOnly: !filters.favoritesOnly })}
        className="self-start"
      >
        <Heart
          className="h-3.5 w-3.5"
          fill={filters.favoritesOnly ? 'currentColor' : 'none'}
          aria-hidden="true"
        />
        {t('filterFavorites')}
      </Chip>
    </div>
  )
}
