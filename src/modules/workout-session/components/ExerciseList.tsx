'use client'

import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { useWorkoutSessionStore } from '../stores/workout-session-store'
import { ExerciseRow } from './ExerciseRow'

export function ExerciseList() {
  const session = useWorkoutSessionStore((s) => s.session)
  const reorderExercises = useWorkoutSessionStore((s) => s.reorderExercises)

  if (!session || session.exercises.length === 0) return null

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = session!.exercises.findIndex((e) => e.id === active.id)
    const newIndex = session!.exercises.findIndex((e) => e.id === over.id)
    const reordered = arrayMove(session!.exercises, oldIndex, newIndex)
    await reorderExercises(reordered.map((e) => e.id))
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={session.exercises.map((e) => e.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {session.exercises.map((exercise) => (
            <ExerciseRow key={exercise.id} exercise={exercise} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
