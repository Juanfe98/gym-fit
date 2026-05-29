'use client'

import { useState } from 'react'
import { ExercisePicker } from '@/modules/workout-session/components/ExercisePicker'
import { PlanExerciseRow } from './PlanExerciseRow'
import { PlanExerciseForm } from './PlanExerciseForm'
import { usePlanExercises } from '../hooks/use-plans'
import { useExerciseMutations } from '../hooks/use-exercise-mutations'
import { useDayMutations } from '../hooks/use-day-mutations'
import type { WorkoutDay, PlanExercise } from '../types'

interface WorkoutDayEditorProps {
  day: WorkoutDay
  planId: string
}

export function WorkoutDayEditor({ day, planId }: WorkoutDayEditorProps) {
  const { exercises } = usePlanExercises(day.id)
  const { addExercise, updateExercise, removeExercise, reorderExercises } = useExerciseMutations(
    day.id,
    planId,
  )
  const { updateDay } = useDayMutations(planId)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [dayName, setDayName] = useState(day.name)

  return (
    <div className="flex flex-col">
      <div className="px-4 pt-4 pb-2">
        <input
          value={dayName}
          onChange={(e) => setDayName(e.target.value)}
          onBlur={() => updateDay(day.id, { name: dayName })}
          className="text-lg font-semibold text-gym-text bg-transparent border-b border-gym-border w-full pb-1 focus:outline-none"
        />
      </div>

      {exercises.map((exercise, index) => (
        <div key={exercise.id}>
          <PlanExerciseRow
            exercise={exercise}
            exerciseName={exercise.exerciseId}
            canMoveUp={index > 0}
            canMoveDown={index < exercises.length - 1}
            onMoveUp={() =>
              reorderExercises({ exercises, fromIndex: index, toIndex: index - 1 })
            }
            onMoveDown={() =>
              reorderExercises({ exercises, fromIndex: index, toIndex: index + 1 })
            }
            onEdit={() => setEditingId(editingId === exercise.id ? null : exercise.id)}
            onRemove={() => removeExercise(exercise.id)}
          />
          {editingId === exercise.id && (
            <div className="px-4 py-2">
              <PlanExerciseForm
                defaultValues={{
                  targetSets: exercise.targetSets,
                  targetReps: exercise.targetReps,
                  targetRepRangeMin: exercise.targetRepRangeMin,
                  targetRepRangeMax: exercise.targetRepRangeMax,
                  targetWeight: exercise.targetWeight,
                  restSeconds: exercise.restSeconds,
                  notes: exercise.notes,
                }}
                isLoading={false}
                onSubmit={(values) => {
                  updateExercise(exercise.id, values)
                  setEditingId(null)
                }}
                onCancel={() => setEditingId(null)}
              />
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() => setPickerOpen(true)}
        className="flex w-full items-center justify-center gap-2 min-h-[44px] border-t border-gym-border text-gym-accent text-sm font-semibold mt-2"
      >
        + Add Exercise
      </button>

      {pickerOpen && (
        <ExercisePicker
          onSelect={({ exerciseId }) => {
            addExercise({
              exerciseId,
              displayOrder: exercises.length,
              targetSets: null,
              targetReps: null,
              targetRepRangeMin: null,
              targetRepRangeMax: null,
              targetWeight: null,
              restSeconds: null,
              tempo: null,
              targetRpe: null,
              notes: null,
            })
            setPickerOpen(false)
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  )
}
