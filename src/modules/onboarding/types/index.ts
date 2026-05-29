export const ONBOARDING_GOAL_OPTIONS = [
  {
    id: 'build-muscle',
    labelKey: 'onboardingGoalBuildMuscle',
    descriptionKey: 'onboardingGoalBuildMuscleDescription',
  },
  {
    id: 'lose-fat',
    labelKey: 'onboardingGoalLoseFat',
    descriptionKey: 'onboardingGoalLoseFatDescription',
  },
  {
    id: 'gain-strength',
    labelKey: 'onboardingGoalGainStrength',
    descriptionKey: 'onboardingGoalGainStrengthDescription',
  },
  {
    id: 'improve-endurance',
    labelKey: 'onboardingGoalImproveEndurance',
    descriptionKey: 'onboardingGoalImproveEnduranceDescription',
  },
  {
    id: 'general-fitness',
    labelKey: 'onboardingGoalGeneralFitness',
    descriptionKey: 'onboardingGoalGeneralFitnessDescription',
  },
  {
    id: 'improve-mobility',
    labelKey: 'onboardingGoalImproveMobility',
    descriptionKey: 'onboardingGoalImproveMobilityDescription',
  },
  {
    id: 'maintain-current-shape',
    labelKey: 'onboardingGoalMaintainCurrentShape',
    descriptionKey: 'onboardingGoalMaintainCurrentShapeDescription',
  },
] as const

export type MainGoal = (typeof ONBOARDING_GOAL_OPTIONS)[number]['id']

export type OnboardingGoalCopyKey =
  | (typeof ONBOARDING_GOAL_OPTIONS)[number]['labelKey']
  | (typeof ONBOARDING_GOAL_OPTIONS)[number]['descriptionKey']

export type FitnessGoalOption = {
  id: MainGoal
  labelKey: OnboardingGoalCopyKey
  descriptionKey: OnboardingGoalCopyKey
}

export type OnboardingState = {
  mainGoal?: MainGoal | null
}

const MAIN_GOAL_IDS = new Set<string>(ONBOARDING_GOAL_OPTIONS.map((option) => option.id))

export function isMainGoal(value: unknown): value is MainGoal {
  return typeof value === 'string' && MAIN_GOAL_IDS.has(value)
}
