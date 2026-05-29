export type ExerciseFilterState = {
  query: string
  bodyPart: string
  equipment: string
  favoritesOnly: boolean
  page: number
}

export type CoachingData = {
  rationale: string
  formCues: string[]
  commonMistakes: string[]
}
