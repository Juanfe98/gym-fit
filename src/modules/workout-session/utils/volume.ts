import type { SessionExerciseDraft, WeightUnit } from '../types'
import { toDisplayUnit } from './unit-conversion'

export function calculateTotalVolume(
  exercises: SessionExerciseDraft[],
  displayUnit: WeightUnit
): number {
  return exercises
    .flatMap(e => e.sets)
    .filter(s => s.setType !== 'warmup' && s.reps > 0 && s.weight > 0)
    .reduce((sum, s) => {
      const weight = toDisplayUnit(s.weight, s.weightUnit, displayUnit)
      return sum + weight * s.reps
    }, 0)
}
