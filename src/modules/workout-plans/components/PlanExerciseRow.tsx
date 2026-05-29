'use client'

import { ChevronUp, ChevronDown, Pencil, Trash2 } from 'lucide-react'
import type { PlanExercise } from '../types'

interface PlanExerciseRowProps {
  exercise: PlanExercise
  exerciseName: string
  canMoveUp: boolean
  canMoveDown: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
  onEdit: () => void
}

function targetSummary(ex: PlanExercise): string {
  const sets = ex.targetSets ? `${ex.targetSets} ×` : ''
  const reps =
    ex.targetRepRangeMin && ex.targetRepRangeMax
      ? `${ex.targetRepRangeMin}–${ex.targetRepRangeMax}`
      : ex.targetReps
        ? `${ex.targetReps}`
        : ''
  return [sets, reps].filter(Boolean).join(' ')
}

export function PlanExerciseRow({
  exercise,
  exerciseName,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onRemove,
  onEdit,
}: PlanExerciseRowProps) {
  const summary = targetSummary(exercise)

  return (
    <div className="flex items-center gap-2 px-4 py-3 min-h-[44px] border-b border-gym-border">
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-sm font-medium text-gym-text">{exerciseName}</span>
        {summary && <span className="text-xs text-gym-muted">{summary}</span>}
      </div>
      <button
        onClick={onMoveUp}
        disabled={!canMoveUp}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center disabled:opacity-30"
      >
        <ChevronUp className="h-4 w-4 text-gym-muted" />
      </button>
      <button
        onClick={onMoveDown}
        disabled={!canMoveDown}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center disabled:opacity-30"
      >
        <ChevronDown className="h-4 w-4 text-gym-muted" />
      </button>
      <button
        onClick={onEdit}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        <Pencil className="h-4 w-4 text-gym-muted" />
      </button>
      <button
        onClick={onRemove}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        <Trash2 className="h-4 w-4 text-gym-muted" />
      </button>
    </div>
  )
}
