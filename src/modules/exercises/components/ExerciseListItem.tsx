'use client'

import { useState } from 'react'
import { Heart, Dumbbell, ChevronRight } from 'lucide-react'
import { Chip } from '@/components/ui'
import type { ExerciseSearchResult } from '@/modules/exercises/hooks/use-exercise-search'

interface ExerciseListItemProps {
  exercise: ExerciseSearchResult
  isFavorite: boolean
  onClick: () => void
}

export function ExerciseListItem({ exercise, isFavorite, onClick }: ExerciseListItemProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <button
      className="card flex w-full items-center gap-3 p-3 text-left transition-colors active:bg-gym-surface-3"
      onClick={onClick}
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gym-surface-3">
        {imgError ? (
          <Dumbbell className="h-6 w-6 text-gym-muted" aria-hidden="true" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={exercise.gifUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="truncate text-sm font-semibold text-gym-text">
          {exercise.name}
        </span>
        <div className="flex flex-wrap gap-1.5">
          <Chip>{exercise.bodyPart}</Chip>
          <Chip>{exercise.equipment}</Chip>
        </div>
      </div>

      {isFavorite ? (
        <Heart className="h-4 w-4 shrink-0 fill-gym-accent text-gym-accent" aria-hidden="true" />
      ) : (
        <ChevronRight className="h-4 w-4 shrink-0 text-gym-muted" aria-hidden="true" />
      )}
    </button>
  )
}
