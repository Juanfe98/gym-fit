'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { getEquipmentLabel, getMuscleLabel } from '@/i18n/content'
import { getLocalizedExerciseName } from '@/i18n/exercise-names'
import { useExerciseSearch, BODY_PARTS } from '../hooks/use-exercise-search'
import type { ExerciseSearchResult } from '../hooks/use-exercise-search'

interface ExerciseRef {
  exerciseId: string
  exerciseNameSnapshot: string
}

interface ExercisePickerProps {
  onSelect: (exercise: ExerciseRef) => void
  onClose: () => void
}

export function ExercisePicker({ onSelect, onClose }: ExercisePickerProps) {
  const { lang, t } = useI18n()
  const [inputValue, setInputValue] = useState('')
  const [query, setQuery] = useState('')
  const [bodyPart, setBodyPart] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setQuery(inputValue), 300)
    return () => clearTimeout(t)
  }, [inputValue])

  const { data, isLoading } = useExerciseSearch({ query, bodyPart, pageSize: 30, lang })

  function handleSelect(exercise: ExerciseSearchResult) {
    onSelect({ exerciseId: exercise.id, exerciseNameSnapshot: exercise.name })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gym-bg">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gym-border px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center text-gym-muted transition-colors hover:text-gym-text"
          aria-label={t('close')}
        >
          <X className="h-5 w-5" />
        </button>
        <input
          type="search"
          placeholder={t('searchExercises')}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoFocus
          className="h-11 flex-1 rounded border border-gym-border bg-gym-surface px-3 text-sm"
        />
      </div>

      {/* Body part filter chips */}
      <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setBodyPart('')}
          className={`flex min-h-[44px] shrink-0 items-center rounded-full px-3 text-xs ${
            bodyPart === '' ? 'bg-orange-500 text-white' : 'bg-gym-surface text-gym-muted'
          }`}
        >
          {t('all')}
        </button>
        {BODY_PARTS.map((bp) => (
          <button
            key={bp}
            type="button"
            onClick={() => setBodyPart(bp === bodyPart ? '' : bp)}
            className={`flex min-h-[44px] shrink-0 items-center rounded-full px-3 text-xs capitalize ${
              bodyPart === bp ? 'bg-orange-500 text-white' : 'bg-gym-surface text-gym-muted'
            }`}
          >
            {getMuscleLabel(bp, lang)}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <p className="px-4 py-6 text-center text-sm text-gym-muted">{t('loading')}</p>
        )}

        {!isLoading && data?.exercises.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-gym-muted">{t('noExercisesFound')}</p>
        )}

        {data?.exercises.map((exercise) => (
          <button
            key={exercise.id}
            type="button"
            onClick={() => handleSelect(exercise)}
            className="flex min-h-[44px] w-full flex-col items-start justify-center gap-0.5 border-b border-gym-border px-4 py-3 text-left transition-colors hover:bg-gym-surface-2 active:bg-gym-surface-3"
          >
            <span className="text-sm font-medium capitalize">{getLocalizedExerciseName(exercise.name, lang)}</span>
            <span className="text-xs capitalize text-gym-muted">
              {getMuscleLabel(exercise.bodyPart, lang)} · {getEquipmentLabel(exercise.equipment, lang)}
            </span>
          </button>
        ))}

        {data && data.hasMore && (
          <p className="px-4 py-3 text-center text-xs text-gym-muted">
            {t('showingExerciseResults', { total: data.total })}
          </p>
        )}
      </div>
    </div>
  )
}
