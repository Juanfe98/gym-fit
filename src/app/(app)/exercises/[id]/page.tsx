'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
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
import { Chip, SectionLabel } from '@/components/ui'

export default function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { t } = useI18n()

  const { favorites, toggle, error } = useFavorites()

  const exercise = (exercisesJson as ExerciseSearchResult[]).find((e) => e.id === id)

  if (!exercise) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <p className="text-sm text-gym-muted">{t('noExercisesFound')}</p>
        <Link href="/exercises" className="text-sm font-medium text-gym-accent">
          {t('clearFilters')}
        </Link>
      </div>
    )
  }

  const coaching = getCoachingByExerciseDbId(id)

  return (
    <div className="flex flex-col pb-8">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-gym-border-subtle bg-gym-bg/95 px-2 py-2 backdrop-blur">
        <button
          onClick={() => router.back()}
          className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gym-text"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <h1 className="heading flex-1 truncate text-lg text-gym-text">{exercise.name}</h1>
        <FavoriteButton
          exerciseId={id}
          isFavorite={favorites.has(id)}
          onToggle={() => toggle(id)}
          error={error}
        />
      </div>

      <div className="flex flex-col gap-6 px-4 pt-4">
        <GifPlayer
          gifUrl={exercise.gifUrl}
          alt={t('exerciseGifAlt').replace('{name}', exercise.name)}
        />

        {/* Quick facts */}
        <div className="flex flex-wrap gap-2">
          <Chip>{exercise.bodyPart}</Chip>
          <Chip>{exercise.equipment}</Chip>
          <Chip>{exercise.target}</Chip>
          {exercise.secondaryMuscles.map((m) => (
            <Chip key={m}>{m}</Chip>
          ))}
        </div>

        <AddToSessionButton exerciseId={id} exerciseName={exercise.name} />

        {/* Muscle diagram */}
        <section className="flex flex-col gap-3">
          <SectionLabel>{t('musclesDiagram')}</SectionLabel>
          <div className="card p-4">
            <MuscleDiagram
              primaryMuscle={exercise.target}
              secondaryMuscles={exercise.secondaryMuscles}
            />
          </div>
        </section>

        {coaching && <CoachingContent coaching={coaching} />}
      </div>
    </div>
  )
}
