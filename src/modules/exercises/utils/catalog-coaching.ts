import { ROUTINES } from '@/data/routines'
import { EXERCISE_CATALOG } from '@/data/exercises/catalog'
import type { ExerciseKey } from '@/types'
import type { CoachingData } from '../types'

const coachingMap = new Map<ExerciseKey, CoachingData>()
const idToKey = new Map<string, ExerciseKey>()

for (const [key, entry] of Object.entries(EXERCISE_CATALOG) as [ExerciseKey, { exerciseDbId: string }][]) {
  idToKey.set(entry.exerciseDbId, key)
}

for (const routine of Object.values(ROUTINES)) {
  for (const day of routine.days) {
    for (const exercise of day.exercises) {
      if (!coachingMap.has(exercise.exerciseKey)) {
        coachingMap.set(exercise.exerciseKey, {
          rationale: exercise.rationale,
          formCues: exercise.formCues,
          commonMistakes: exercise.commonMistakes,
        })
      }
    }
  }
}

export function getCoachingByExerciseDbId(exerciseDbId: string): CoachingData | null {
  const key = idToKey.get(exerciseDbId)
  if (!key) return null
  return coachingMap.get(key) ?? null
}
