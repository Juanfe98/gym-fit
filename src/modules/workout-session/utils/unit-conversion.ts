import type { WeightUnit } from '../types'

const KG_TO_LBS = 2.20462
const LBS_TO_KG = 1 / KG_TO_LBS

export function toDisplayUnit(
  weight: number,
  storedUnit: WeightUnit,
  displayUnit: WeightUnit
): number {
  if (storedUnit === displayUnit) return weight
  return storedUnit === 'kg' ? weight * KG_TO_LBS : weight * LBS_TO_KG
}
