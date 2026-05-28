'use client'

import { usePrHistory } from './use-pr-history'
import { toDisplayUnit } from '../utils/unit-conversion'
import type { WeightUnit } from '../types'

export function usePrDetection(userId: string | null) {
  const { data: prMap = {} } = usePrHistory(userId)

  function isPr(exerciseId: string, weight: number, weightUnit: WeightUnit): boolean {
    const existing = prMap[exerciseId]
    if (!existing) return false
    const weightKg = toDisplayUnit(weight, weightUnit, 'kg')
    const existingKg = toDisplayUnit(existing.maxWeight, existing.maxWeightUnit, 'kg')
    return weightKg > existingKg
  }

  return { isPr, prMap }
}
