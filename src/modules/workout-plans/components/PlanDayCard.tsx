'use client'

import { Pencil, Trash2 } from 'lucide-react'
import type { WorkoutDayWithCount } from '../types'

interface PlanDayCardProps {
  day: WorkoutDayWithCount
  onEdit: () => void
  onRemove: () => void
}

export function PlanDayCard({ day, onEdit, onRemove }: PlanDayCardProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 min-h-[44px] border-b border-gym-border">
      <span className="flex-1 text-sm font-medium text-gym-text">{day.name}</span>
      <span className="text-xs text-gym-muted bg-gym-surface-2 rounded px-2 py-0.5">
        {day.exerciseCount} exercises
      </span>
      <button
        onClick={onEdit}
        className="ml-auto min-h-[44px] min-w-[44px] flex items-center justify-center"
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
