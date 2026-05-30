'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import {
  normalizeExerciseName,
  searchUserExercises,
  trackUserExercise,
  type ExerciseRef,
  type UserExerciseSuggestion,
} from '../services/user-exercises'

interface ExercisePickerProps {
  onSelect: (exercise: ExerciseRef) => void | Promise<void>
  onClose: () => void
}

export function ExercisePicker({ onSelect, onClose }: ExercisePickerProps) {
  const { t } = useI18n()
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<UserExerciseSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cleanName = useMemo(() => normalizeExerciseName(inputValue), [inputValue])
  const exactMatch = suggestions.some(
    (exercise) => exercise.name.toLowerCase() === cleanName.toLowerCase()
  )

  useEffect(() => {
    let cancelled = false
    const timeout = setTimeout(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const results = await searchUserExercises(inputValue)
        if (!cancelled) setSuggestions(results)
      } catch {
        if (!cancelled) setSuggestions([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }, 200)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [inputValue])

  async function handleAdd(name: string) {
    const normalizedName = normalizeExerciseName(name)
    if (!normalizedName || isAdding) return

    setIsAdding(true)
    setError(null)
    try {
      const exercise = await trackUserExercise(normalizedName)
      await onSelect(exercise)
      onClose()
    } catch {
      setError(t('exerciseAddError'))
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gym-bg">
      <div className="flex items-center gap-3 border-b border-gym-border px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center text-gym-muted transition-colors hover:text-gym-text"
          aria-label={t('close')}
        >
          <X className="h-5 w-5" />
        </button>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gym-muted" />
          <input
            type="text"
            placeholder={t('exerciseNamePlaceholder')}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                void handleAdd(cleanName)
              }
            }}
            autoFocus
            maxLength={120}
            className="h-11 w-full rounded border border-gym-border bg-gym-surface py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-gym-border-strong"
          />
        </div>
      </div>

      <div className="border-b border-gym-border px-4 py-3">
        <p className="text-sm font-medium text-gym-text">{t('exercisePickerTitle')}</p>
        <p className="mt-1 text-xs text-gym-muted">{t('exercisePickerSubtitle')}</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {error && (
          <p role="alert" className="mx-4 mt-4 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        {cleanName && !exactMatch && (
          <button
            type="button"
            onClick={() => void handleAdd(cleanName)}
            disabled={isAdding}
            className="flex min-h-[56px] w-full items-center gap-3 border-b border-gym-border px-4 py-3 text-left transition-colors hover:bg-gym-surface-2 active:bg-gym-surface-3 disabled:opacity-60"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gym-accent text-white">
              <Plus className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold text-gym-text">
                {isAdding ? t('addingExercise') : t('addExerciseNamed', { name: cleanName })}
              </span>
              <span className="text-xs text-gym-muted">{t('exerciseCreateHint')}</span>
            </span>
          </button>
        )}

        {suggestions.length > 0 && (
          <div className="px-4 pb-2 pt-4 text-xs font-semibold uppercase tracking-wide text-gym-muted">
            {t('recentExercises')}
          </div>
        )}

        {suggestions.map((exercise) => (
          <button
            key={exercise.id}
            type="button"
            onClick={() => void handleAdd(exercise.name)}
            disabled={isAdding}
            className="flex min-h-[52px] w-full flex-col items-start justify-center gap-0.5 border-b border-gym-border px-4 py-3 text-left transition-colors hover:bg-gym-surface-2 active:bg-gym-surface-3 disabled:opacity-60"
          >
            <span className="text-sm font-medium text-gym-text">{exercise.name}</span>
            <span className="text-xs text-gym-muted">
              {t('exerciseUsedCount', { count: exercise.useCount })}
            </span>
          </button>
        ))}

        {!isLoading && !cleanName && suggestions.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-gym-muted">{t('exerciseNoHistory')}</p>
        )}

        {isLoading && (
          <p className="px-4 py-6 text-center text-sm text-gym-muted">{t('loading')}</p>
        )}
      </div>
    </div>
  )
}
