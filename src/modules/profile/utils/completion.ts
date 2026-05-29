import type { ProfileCompletion } from '../types'

type CompletionInput = {
  hasName: boolean
  hasGoal: boolean
  hasLevel: boolean
  hasAvailability: boolean
  hasEquipment: boolean
  hasUnits: boolean
}

export function calcCompletion(data: CompletionInput): ProfileCompletion {
  const score = Object.values(data).filter(Boolean).length
  const tier =
    score === 0
      ? 'getting_started'
      : score <= 4
        ? 'almost_ready'
        : 'profile_ready'
  return { score, tier }
}
