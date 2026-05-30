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

export const ONBOARDING_EXPERIENCE_OPTIONS = [
  {
    id: 'beginner',
    labelKey: 'onboardingExperienceBeginner',
    descriptionKey: 'onboardingExperienceBeginnerDescription',
    exampleKeys: [
      'onboardingExperienceBeginnerExampleConsistency',
      'onboardingExperienceBeginnerExampleTechnique',
      'onboardingExperienceBeginnerExampleProgression',
    ],
  },
  {
    id: 'intermediate',
    labelKey: 'onboardingExperienceIntermediate',
    descriptionKey: 'onboardingExperienceIntermediateDescription',
    exampleKeys: [
      'onboardingExperienceIntermediateExampleConsistency',
      'onboardingExperienceIntermediateExampleTechnique',
      'onboardingExperienceIntermediateExampleProgression',
    ],
  },
  {
    id: 'advanced',
    labelKey: 'onboardingExperienceAdvanced',
    descriptionKey: 'onboardingExperienceAdvancedDescription',
    exampleKeys: [
      'onboardingExperienceAdvancedExampleConsistency',
      'onboardingExperienceAdvancedExampleTechnique',
      'onboardingExperienceAdvancedExampleProgression',
    ],
  },
] as const

export type ExperienceLevel = (typeof ONBOARDING_EXPERIENCE_OPTIONS)[number]['id']

export type OnboardingExperienceCopyKey =
  | (typeof ONBOARDING_EXPERIENCE_OPTIONS)[number]['labelKey']
  | (typeof ONBOARDING_EXPERIENCE_OPTIONS)[number]['descriptionKey']
  | (typeof ONBOARDING_EXPERIENCE_OPTIONS)[number]['exampleKeys'][number]

export type ExperienceOption = {
  id: ExperienceLevel
  labelKey: OnboardingExperienceCopyKey
  descriptionKey: OnboardingExperienceCopyKey
  exampleKeys: readonly OnboardingExperienceCopyKey[]
}

export const WEEKLY_WORKOUT_DAYS_OPTIONS = [2, 3, 4, 5, 6] as const

export type WeeklyWorkoutDays = (typeof WEEKLY_WORKOUT_DAYS_OPTIONS)[number]

export type OnboardingState = {
  mainGoal?: MainGoal | null
  experienceLevel?: ExperienceLevel | null
  weeklyWorkoutDays?: WeeklyWorkoutDays | null
}

const MAIN_GOAL_IDS = new Set<string>(ONBOARDING_GOAL_OPTIONS.map((option) => option.id))
const EXPERIENCE_LEVEL_IDS = new Set<string>(ONBOARDING_EXPERIENCE_OPTIONS.map((option) => option.id))

export function isMainGoal(value: unknown): value is MainGoal {
  return typeof value === 'string' && MAIN_GOAL_IDS.has(value)
}

export function isExperienceLevel(value: unknown): value is ExperienceLevel {
  return typeof value === 'string' && EXPERIENCE_LEVEL_IDS.has(value)
}

export function isWeeklyWorkoutDays(value: unknown): value is WeeklyWorkoutDays {
  return (
    typeof value === 'number' &&
    (WEEKLY_WORKOUT_DAYS_OPTIONS as readonly number[]).includes(value)
  )
}
