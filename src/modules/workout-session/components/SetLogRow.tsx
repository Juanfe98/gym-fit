'use client'

import { useState } from 'react'
import { Pencil, X } from 'lucide-react'
import { useWorkoutSessionStore } from '../stores/workout-session-store'
import { SetLogForm } from './SetLogForm'
import { PrBadge } from './PrBadge'
import { useWeightUnitPreference } from '../hooks/use-weight-unit-preference'
import { toDisplayUnit } from '../utils/unit-conversion'
import type { SetLogDraft } from '../types'

const SET_TYPE_LABELS: Record<SetLogDraft['setType'], string> = {
  normal: 'N',
  warmup: 'W',
  dropset: 'D',
}

interface SetLogRowProps {
  set: SetLogDraft
  isNew?: boolean
}

export function SetLogRow({ set, isNew = false }: SetLogRowProps) {
  const editSet = useWorkoutSessionStore((s) => s.editSet)
  const deleteSet = useWorkoutSessionStore((s) => s.deleteSet)
  const [editing, setEditing] = useState(false)
  const [displayUnit] = useWeightUnitPreference()

  const displayWeight = set.weight > 0
    ? Math.round(toDisplayUnit(set.weight, set.weightUnit, displayUnit) * 10) / 10
    : 0

  async function handleDelete() {
    await deleteSet(set.id)
  }

  async function handleEdit(values: Parameters<typeof editSet>[1]) {
    await editSet(set.id, values)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="rounded border border-gym-border bg-gym-surface">
        <SetLogForm
          onSubmit={handleEdit}
          defaultValues={{
            weight: set.weight,
            weightUnit: set.weightUnit,
            reps: set.reps,
            setType: set.setType,
            rpe: set.rpe,
            notes: set.notes,
          }}
          submitLabel="Save"
        />
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="w-full py-2 text-sm text-gym-muted"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-[44px] items-center gap-3 px-3 py-2">
      <span className="w-6 text-sm text-gym-muted">{set.setNumber}</span>

      <span className="flex-1 text-sm">
        {set.weight > 0 ? `${displayWeight} ${displayUnit}` : '—'} × {set.reps} reps
      </span>

      <span className="rounded bg-gym-surface px-1.5 py-0.5 text-xs text-gym-muted">
        {SET_TYPE_LABELS[set.setType]}
      </span>

      {set.rpe != null && (
        <span className="text-xs text-gym-muted">RPE {set.rpe}</span>
      )}

      {set.isPr && <PrBadge isNew={isNew} />}

      <button
        type="button"
        onClick={() => setEditing(true)}
        className="flex min-h-[44px] min-w-[44px] items-center justify-center text-gym-muted transition-colors hover:text-gym-text"
        aria-label="Edit set"
      >
        <Pencil className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={handleDelete}
        className="flex min-h-[44px] min-w-[44px] items-center justify-center text-red-400 transition-colors hover:text-red-300"
        aria-label="Delete set"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
