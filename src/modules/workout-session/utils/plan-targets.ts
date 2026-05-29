import type { SessionExerciseDraft } from '../types'

export function formatPlanTarget(exercise: SessionExerciseDraft): string {
  const { targetSets, targetReps, targetRepRangeMin, targetRepRangeMax, targetWeight } = exercise

  const hasReps = targetReps != null
  const hasRange = targetRepRangeMin != null && targetRepRangeMax != null
  const hasSets = targetSets != null
  const hasWeight = targetWeight != null

  if (!hasSets && !hasReps && !hasRange) return ''

  let repsStr = ''
  if (hasRange) {
    repsStr = `${targetRepRangeMin}–${targetRepRangeMax}`
  } else if (hasReps) {
    repsStr = `${targetReps}`
  }

  if (hasSets && repsStr) {
    const base = `${targetSets} × ${repsStr}`
    return hasWeight ? `${base} @ ${targetWeight} kg` : base
  }

  if (hasSets) {
    return `${targetSets} sets`
  }

  return repsStr ? `${repsStr} reps` : ''
}
