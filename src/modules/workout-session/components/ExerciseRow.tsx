'use client'

import { useState } from 'react'
import { GripVertical, MoreHorizontal } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { useWorkoutSessionStore } from '../stores/workout-session-store'
import { useTimerStore } from '../stores/timer-store'
import { usePrDetection } from '../hooks/use-pr-detection'
import { SetLogRow } from './SetLogRow'
import { SetLogForm } from './SetLogForm'
import { ExercisePicker } from './ExercisePicker'
import { CancelSessionDialog } from './CancelSessionDialog'
import type { SessionExerciseDraft, SetInput } from '../types'

const DEFAULT_REST_SECONDS = 90

interface ExerciseRowProps {
  exercise: SessionExerciseDraft
}

export function ExerciseRow({ exercise }: ExerciseRowProps) {
  const addSetToExercise = useWorkoutSessionStore((s) => s.logSet)
  const removeExercise = useWorkoutSessionStore((s) => s.removeExercise)
  const replaceExercise = useWorkoutSessionStore((s) => s.replaceExercise)
  const updateExerciseNotes = useWorkoutSessionStore((s) => s.updateExerciseNotes)
  const userId = useWorkoutSessionStore((s) => s.session?.userId ?? null)
  const startRestTimer = useTimerStore((s) => s.startRestTimer)
  const { isPr: checkIsPr } = usePrDetection(userId)

  const [showAddSet, setShowAddSet] = useState(false)
  const [showReplacePicker, setShowReplacePicker] = useState(false)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const [pendingReplaceRef, setPendingReplaceRef] = useState<{ exerciseId: string; exerciseNameSnapshot: string } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [latestPrSetId, setLatestPrSetId] = useState<string | null>(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: exercise.id })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined

  async function handleLogSet(values: SetInput) {
    const prResult = checkIsPr(exercise.exerciseId, values.weight, values.weightUnit)
    const setId = await addSetToExercise(exercise.id, values, prResult)
    if (prResult) setLatestPrSetId(setId)
    setShowAddSet(false)
    startRestTimer(DEFAULT_REST_SECONDS)
  }

  async function handleRemoveConfirm() {
    await removeExercise(exercise.id)
    setShowRemoveDialog(false)
  }

  function handleReplaceSelect(ref: { exerciseId: string; exerciseNameSnapshot: string }) {
    setShowReplacePicker(false)
    setPendingReplaceRef(ref)
  }

  async function handleReplaceConfirm() {
    if (!pendingReplaceRef) return
    await replaceExercise(exercise.id, pendingReplaceRef)
    setPendingReplaceRef(null)
  }

  return (
    <div ref={setNodeRef} style={style} className="rounded-lg border border-gym-border bg-gym-surface">
      {/* Header row */}
      <div className="flex min-h-[44px] items-center gap-2 px-3 py-2">
        {/* Drag handle */}
        <button
          type="button"
          className="flex min-h-[44px] min-w-[44px] cursor-grab items-center justify-center text-gym-muted active:cursor-grabbing"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <span className="flex-1 font-semibold capitalize">{exercise.exerciseNameSnapshot}</span>

        {/* Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-gym-muted transition-colors hover:text-gym-text"
            aria-label="Exercise options"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-10 flex min-w-[140px] flex-col overflow-hidden rounded-lg border border-gym-border bg-gym-surface shadow-lg">
              <button
                type="button"
                className="px-4 py-3 text-left text-sm transition-colors hover:bg-gym-surface-2"
                onClick={() => { setShowReplacePicker(true); setMenuOpen(false) }}
              >
                Replace
              </button>
              <div className="mx-3 border-t border-gym-border-subtle" />
              <button
                type="button"
                className="px-4 py-3 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
                onClick={() => { setShowRemoveDialog(true); setMenuOpen(false) }}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sets */}
      {exercise.sets.length === 0 && (
        <p className="px-3 py-2 text-sm text-gym-muted">Log your first set</p>
      )}
      {exercise.sets.map((set) => (
        <SetLogRow key={set.id} set={set} isNew={set.id === latestPrSetId} />
      ))}

      {/* Inline add-set form */}
      {showAddSet ? (
        <div>
          <SetLogForm
            onSubmit={handleLogSet}
            defaultValues={
              exercise.sets.length > 0
                ? {
                    weight: exercise.sets[exercise.sets.length - 1].weight,
                    weightUnit: exercise.sets[exercise.sets.length - 1].weightUnit,
                    setType: exercise.sets[exercise.sets.length - 1].setType,
                  }
                : undefined
            }
          />
          <button
            type="button"
            onClick={() => setShowAddSet(false)}
            className="w-full py-2 text-sm text-gym-muted"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddSet(true)}
          className="flex min-h-[44px] w-full items-center justify-center gap-1 text-sm text-gym-accent transition-colors hover:bg-gym-accent-subtle"
        >
          + Add Set
        </button>
      )}

      {/* Notes */}
      <div className="px-3 pb-3">
        <input
          type="text"
          placeholder="Exercise notes…"
          defaultValue={exercise.notes ?? ''}
          onBlur={(e) => updateExerciseNotes(exercise.id, e.target.value)}
          className="h-9 w-full rounded border border-gym-border bg-transparent px-2 text-sm text-gym-muted"
        />
      </div>

      {showReplacePicker && (
        <ExercisePicker
          onSelect={handleReplaceSelect}
          onClose={() => setShowReplacePicker(false)}
        />
      )}

      {pendingReplaceRef && (
        <CancelSessionDialog
          title="Replace exercise?"
          message={`"${exercise.exerciseNameSnapshot}" and all its logged sets will be removed and replaced with "${pendingReplaceRef.exerciseNameSnapshot}".`}
          confirmLabel="Replace"
          onConfirm={handleReplaceConfirm}
          onCancel={() => setPendingReplaceRef(null)}
        />
      )}

      {showRemoveDialog && (
        <CancelSessionDialog
          title="Remove exercise?"
          message={`"${exercise.exerciseNameSnapshot}" and all its logged sets will be removed from this session.`}
          confirmLabel="Remove"
          onConfirm={handleRemoveConfirm}
          onCancel={() => setShowRemoveDialog(false)}
        />
      )}
    </div>
  )
}
