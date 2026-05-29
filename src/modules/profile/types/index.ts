export type FitnessGoal =
  | 'build_muscle'
  | 'lose_fat'
  | 'increase_strength'
  | 'improve_endurance'
  | 'general_fitness'
  | 'body_recomposition'

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced'
export type EquipmentPreset = 'full_gym' | 'home_gym' | 'bodyweight' | 'custom'
export type HeightUnit = 'cm' | 'in'
export type WeightUnit = 'kg' | 'lb'
export type ProfileCompletionTier = 'getting_started' | 'almost_ready' | 'profile_ready'

export type FitnessPreferences = {
  userId: string
  fitnessGoal: FitnessGoal | null
  experienceLevel: ExperienceLevel | null
  daysPerWeek: number | null
  sessionDurationMinutes: number | null
  preferredDays: string[]
  heightUnit: HeightUnit
  weightUnit: WeightUnit
}

export type EquipmentAccess = {
  userId: string
  preset: EquipmentPreset | null
  equipmentItems: string[]
}

export type BodyInfo = {
  userId: string
  heightCm: number | null
  weightKg: number | null
}

export type PhysicalLimitation = {
  id: string
  userId: string
  affectedArea: string
  description: string | null
}

export type BodyMeasurementEntry = {
  id: string
  userId: string
  measuredAt: string
  weightKg: number | null
  waistCm: number | null
  chestCm: number | null
  bodyFatPct: number | null
}

export type ProfileOverviewData = {
  displayName: string
  avatarUrl: string | null
  preferences: FitnessPreferences | null
  equipment: EquipmentAccess | null
  bodyInfo: BodyInfo | null
  limitations: PhysicalLimitation[]
  latestMeasurement: BodyMeasurementEntry | null
}

export type ProfileCompletion = {
  score: number
  tier: ProfileCompletionTier
}
