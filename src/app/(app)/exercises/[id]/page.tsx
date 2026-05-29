'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/client'
import exercisesJson from '@/data/exercises/exercises.json'
import type { ExerciseSearchResult } from '@/modules/exercises/hooks/use-exercise-search'
import { GifPlayer } from '@/modules/exercises/components/GifPlayer'
import { MuscleDiagram } from '@/modules/exercises/components/MuscleDiagram'
import { CoachingContent } from '@/modules/exercises/components/CoachingContent'
import { getCoachingByExerciseDbId } from '@/modules/exercises/utils/catalog-coaching'
import { FavoriteButton } from '@/modules/exercises/components/FavoriteButton'
import { useFavorites } from '@/modules/exercises/hooks/use-favorites'
import { AddToSessionButton } from '@/modules/exercises/components/AddToSessionButton'

export default function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { t } = useI18n()

  const { favorites, toggle, error } = useFavorites()

  const exercise = (exercisesJson as ExerciseSearchResult[]).find((e) => e.id === id)

  if (!exercise) {
    return (
      <div className="p-4 flex flex-col gap-4">
        <p className="text-sm text-gym-muted">{t('noExercisesFound')}</p>
        <Link href="/exercises" className="text-sm font-medium text-gym-accent">
          {t('clearFilters')}
        </Link>
      </div>
    )
  }

  const coaching = getCoachingByExerciseDbId(id)

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex items-center gap-3 px-4 pt-4">
        <button
          onClick={() => router.back()}
          className="text-gym-muted shrink-0"
          aria-label="Back"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold text-gym-text flex-1">{exercise.name}</h1>
        <FavoriteButton
          exerciseId={id}
          isFavorite={favorites.has(id)}
          onToggle={() => toggle(id)}
          error={error}
        />
      </div>

      <div className="px-4">
        <GifPlayer
          gifUrl={exercise.gifUrl}
          alt={t('exerciseGifAlt').replace('{name}', exercise.name)}
        />
      </div>

      <div className="px-4 flex flex-col gap-2">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span className="text-xs text-gym-muted">
            <span className="font-medium text-gym-text">{t('filterMuscle')}: </span>
            {exercise.bodyPart}
          </span>
          <span className="text-xs text-gym-muted">
            <span className="font-medium text-gym-text">{t('equipmentLabel')}: </span>
            {exercise.equipment}
          </span>
          <span className="text-xs text-gym-muted">
            <span className="font-medium text-gym-text">{t('primaryMuscle')}: </span>
            {exercise.target}
          </span>
          {exercise.secondaryMuscles.length > 0 && (
            <span className="text-xs text-gym-muted">
              <span className="font-medium text-gym-text">{t('secondaryMusclesLabel')}: </span>
              {exercise.secondaryMuscles.join(', ')}
            </span>
          )}
        </div>
      </div>

      <div className="px-4">
        <MuscleDiagram
          primaryMuscle={exercise.target}
          secondaryMuscles={exercise.secondaryMuscles}
        />
      </div>

      <div className="px-4">
        <AddToSessionButton exerciseId={id} exerciseName={exercise.name} />
      </div>

      {coaching && (
        <div className="px-4">
          <CoachingContent coaching={coaching} />
        </div>
      )}
    </div>
  )
}
