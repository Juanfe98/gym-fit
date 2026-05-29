'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SearchX } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { useExerciseSearch } from '@/modules/exercises/hooks/use-exercise-search'
import type { ExerciseSearchResult } from '@/modules/exercises/hooks/use-exercise-search'
import { ExerciseFilters } from '@/modules/exercises/components/ExerciseFilters'
import { ExerciseListItem } from '@/modules/exercises/components/ExerciseListItem'
import type { ExerciseFilterState } from '@/modules/exercises/types'
import { useFavorites } from '@/modules/exercises/hooks/use-favorites'
import { PageHeader, EmptyState } from '@/components/ui'

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
      <PageHeader
        title={t('exerciseLibraryTitle')}
        subtitle={
          data && !filters.favoritesOnly
            ? t('exerciseLibrarySubtitle', { count: data.total })
            : undefined
        }
      />
      <ExerciseFilters filters={filters} onChange={setFilters} />
      {isEmpty ? (
        <EmptyState
          Icon={SearchX}
          title={t(filters.favoritesOnly ? 'exercisesEmptyFavorites' : 'exercisesEmpty')}
          action={
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="text-sm font-semibold text-gym-accent"
            >
              {t('clearFilters')}
            </button>
          }
        />
      ) : (
        <ul className="flex flex-col gap-2 px-4 py-3">
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
