'use client'

import { useI18n } from '@/i18n/client'
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

  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      <input
        type="search"
        value={filters.query}
        onChange={(e) => update({ query: e.target.value })}
        placeholder={t('exerciseSearch')}
        className="min-h-[44px] w-full rounded-lg bg-gym-surface-2 px-3 text-sm text-gym-text placeholder:text-gym-muted focus:outline-none"
      />
      <div className="flex gap-2">
        <select
          value={filters.bodyPart}
          onChange={(e) => update({ bodyPart: e.target.value })}
          className="min-h-[44px] flex-1 rounded-lg bg-gym-surface-2 px-3 text-sm text-gym-text focus:outline-none"
        >
          <option value="">{t('allMuscles')}</option>
          {BODY_PARTS.map((bp) => (
            <option key={bp} value={bp}>
              {bp}
            </option>
          ))}
        </select>
        <select
          value={filters.equipment}
          onChange={(e) => update({ equipment: e.target.value })}
          className="min-h-[44px] flex-1 rounded-lg bg-gym-surface-2 px-3 text-sm text-gym-text focus:outline-none"
        >
          <option value="">{t('allEquipment')}</option>
          {EQUIPMENT_OPTIONS.map((eq) => (
            <option key={eq} value={eq}>
              {eq}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() => update({ favoritesOnly: !filters.favoritesOnly })}
        className={`min-h-[44px] rounded-lg px-3 text-sm font-medium transition-colors ${
          filters.favoritesOnly
            ? 'bg-gym-accent text-white'
            : 'bg-gym-surface-2 text-gym-muted'
        }`}
      >
        {t('filterFavorites')}
      </button>
    </div>
  )
}
