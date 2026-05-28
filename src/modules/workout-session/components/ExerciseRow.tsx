'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { useWorkoutSessionStore } from '../stores/workout-session-store'
import { SetLogRow } from './SetLogRow'
import { SetLogForm } from './SetLogForm'
import { ExercisePicker } from './ExercisePicker'
import type { SessionExerciseDraft } from '../types'

interface ExerciseRowProps {
  exercise: SessionExerciseDraft
}

export function ExerciseRow({ exercise }: ExerciseRowProps) {
  const addSetToExercise = useWorkoutSessionStore((s) => s.logSet)
  const removeExercise = useWorkoutSessionStore((s) => s.removeExercise)
  const replaceExercise = useWorkoutSessionStore((s) => s.replaceExercise)
  const updateExerciseNotes = useWorkoutSessionStore((s) => s.updateExerciseNotes)

  const [showAddSet, setShowAddSet] = useState(false)
  const [showReplacePicker, setShowReplacePicker] = useState(false)
  const [pendingRemove, setPendingRemove] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: exercise.id })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined

  async function handleLogSet(values: Parameters<typeof addSetToExercise>[1]) {
    await addSetToExercise(exercise.id, values)
    setShowAddSet(false)
  }

  async function handleRemoveConfirm() {
    await removeExercise(exercise.id)
    setPendingRemove(false)
  }

  async function handleReplaceSelect(ref: { exerciseId: string; exerciseNameSnapshot: string }) {
    await replaceExercise(exercise.id, ref)
    setShowReplacePicker(false)
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
          ⠿
        </button>

        <span className="flex-1 font-semibold capitalize">{exercise.exerciseNameSnapshot}</span>

        {/* Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-gym-muted"
            aria-label="Exercise options"
          >
            ⋯
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-10 flex min-w-[120px] flex-col rounded border border-gym-border bg-gym-surface shadow-lg">
              <button
                type="button"
                className="px-4 py-3 text-left text-sm"
                onClick={() => { setShowReplacePicker(true); setMenuOpen(false) }}
              >
                Replace
              </button>
              <button
                type="button"
                className="px-4 py-3 text-left text-sm text-red-400"
                onClick={() => { setPendingRemove(true); setMenuOpen(false) }}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sets */}
      {exercise.sets.length === 0 && !showAddSet && (
        <p className="px-3 py-2 text-sm text-gym-muted">Log your first set</p>
      )}
      {exercise.sets.map((set) => (
        <SetLogRow key={set.id} set={set} />
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
          className="flex min-h-[44px] w-full items-center justify-center gap-1 text-sm text-orange-400"
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

      {/* Remove confirm */}
      {pendingRemove && (
        <div className="flex gap-2 border-t border-gym-border px-3 py-2">
          <span className="flex-1 text-sm text-gym-muted">Remove this exercise?</span>
          <button
            type="button"
            onClick={handleRemoveConfirm}
            className="min-h-[44px] px-3 text-sm text-red-400"
          >
            Remove
          </button>
          <button
            type="button"
            onClick={() => setPendingRemove(false)}
            className="min-h-[44px] px-3 text-sm text-gym-muted"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Replace picker */}
      {showReplacePicker && (
        <ExercisePicker
          onSelect={handleReplaceSelect}
          onClose={() => setShowReplacePicker(false)}
        />
      )}
    </div>
  )
}
