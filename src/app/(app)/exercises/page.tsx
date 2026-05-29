'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/client'
import { useExerciseSearch } from '@/modules/exercises/hooks/use-exercise-search'
import type { ExerciseSearchResult } from '@/modules/exercises/hooks/use-exercise-search'
import { ExerciseFilters } from '@/modules/exercises/components/ExerciseFilters'
import { ExerciseListItem } from '@/modules/exercises/components/ExerciseListItem'
import type { ExerciseFilterState } from '@/modules/exercises/types'
import { useFavorites } from '@/modules/exercises/hooks/use-favorites'

const DEFAULT_FILTERS: ExerciseFilterState = {
  query: '',
  bodyPart: '',
  equipment: '',
  favoritesOnly: false,
  page: 0,
}

export default function ExercisesPage() {
  const { t, lang } = useI18n()
  const router = useRouter()
  const [filters, setFilters] = useState<ExerciseFilterState>(DEFAULT_FILTERS)
  const [allExercises, setAllExercises] = useState<ExerciseSearchResult[]>([])

  const { favorites } = useFavorites()
  const { query, bodyPart, equipment, page } = filters
  const { data, isFetching } = useExerciseSearch({ query, bodyPart, equipment, page, lang })

  useEffect(() => {
    if (!data) return
    if (filters.page === 0) {
      setAllExercises(data.exercises)
    } else {
      setAllExercises((prev) => [...prev, ...data.exercises])
    }
  }, [data, filters.page])

  // scroll restore on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('exercises-scroll')
    if (saved) window.scrollTo(0, Number(saved))
  }, [])

  // infinite scroll
  useEffect(() => {
    function handleScroll() {
      if (isFetching || !data?.hasMore) return
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200) {
        setFilters((f) => ({ ...f, page: f.page + 1 }))
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [data?.hasMore, isFetching])

  function handleItemClick(exercise: ExerciseSearchResult) {
    sessionStorage.setItem('exercises-scroll', String(window.scrollY))
    router.push('/exercises/' + exercise.id)
  }

  const displayExercises = filters.favoritesOnly
    ? allExercises.filter((e) => favorites.has(e.id))
    : allExercises
  const isEmpty = data && data.total === 0 && !filters.favoritesOnly
    ? true
    : filters.favoritesOnly && displayExercises.length === 0

  return (
    <div className="flex flex-col">
      <h1 className="px-4 pt-4 text-lg font-semibold text-gym-text">{t('exerciseLibraryTitle')}</h1>
      <ExerciseFilters filters={filters} onChange={setFilters} />
      {isEmpty ? (
        <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
          <p className="text-sm text-gym-muted">
            {t(filters.favoritesOnly ? 'exercisesEmptyFavorites' : 'exercisesEmpty')}
          </p>
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="text-sm font-medium text-gym-accent"
          >
            {t('clearFilters')}
          </button>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-gym-surface-2">
          {displayExercises.map((exercise) => (
            <li key={exercise.id}>
              <ExerciseListItem
                exercise={exercise}
                isFavorite={favorites.has(exercise.id)}
                onClick={() => handleItemClick(exercise)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
