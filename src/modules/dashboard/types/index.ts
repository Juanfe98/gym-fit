export interface DashboardSetupData {
  mainGoal?: string
  experienceLevel?: string
  daysPerWeek?: number
  sessionDurationMinutes?: number
  equipmentItems: string[]
}

export interface WeeklyCalendarDay {
  date: string
  shortLabel: string
  isToday: boolean
  isCompleted: boolean
}
