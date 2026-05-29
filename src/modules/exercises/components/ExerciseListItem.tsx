'use client'

import { Heart } from 'lucide-react'
import type { ExerciseSearchResult } from '@/modules/exercises/hooks/use-exercise-search'

interface ExerciseListItemProps {
  exercise: ExerciseSearchResult
  isFavorite: boolean
  onClick: () => void
}

export function ExerciseListItem({ exercise, isFavorite, onClick }: ExerciseListItemProps) {
  return (
    <button
      className="flex w-full items-center gap-3 px-4 py-3 min-h-[44px] active:bg-gym-surface-2"
      onClick={onClick}
    >
      <div className="flex flex-1 flex-col items-start gap-1 min-w-0">
        <span className="text-gym-text text-sm font-medium truncate w-full text-left">
          {exercise.name}
        </span>
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-xs text-gym-muted bg-gym-surface-2 rounded px-2 py-0.5">
            {exercise.bodyPart}
          </span>
          <span className="text-xs text-gym-muted bg-gym-surface-2 rounded px-2 py-0.5">
            {exercise.equipment}
          </span>
        </div>
      </div>
      {isFavorite && (
        <Heart className="h-4 w-4 shrink-0 fill-gym-accent text-gym-accent" />
      )}
    </button>
  )
}
