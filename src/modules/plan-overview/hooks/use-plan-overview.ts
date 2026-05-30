'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { getActivePlan, getLastCompletedPlanSession } from '@/modules/workout-plans/services/plans-service'
import { getDaysWithCount } from '@/modules/workout-plans/services/days-service'
import type { WorkoutPlan } from '@/modules/workout-plans/types'
import type { WorkoutDayWithCount } from '@/modules/workout-plans/types'

const SHORT_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const WORKOUT_DAY_DISTRIBUTIONS: Record<number, number[]> = {
  2: [0, 3],
  3: [0, 2, 4],
  4: [0, 1, 3, 4],
  5: [0, 1, 2, 3, 4],
  6: [0, 1, 2, 3, 4, 5],
  7: [0, 1, 2, 3, 4, 5, 6],
}

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

export interface WeekGridDay {
  label: string
  date: string
  isToday: boolean
  isWorkoutDay: boolean
  isCompleted: boolean
}

export interface UserPrefs {
  fitness_goal: string | null
  experience_level: string | null
  days_per_week: number | null
  session_duration_minutes: number | null
}

export interface PlanOverviewData {
  activePlan: WorkoutPlan | null
  days: WorkoutDayWithCount[]
  suggestedDayId: string | null
  completedDayIds: Set<string>
  inProgressDayId: string | null
  weekGrid: WeekGridDay[]
  prefs: UserPrefs | null
  equipment: string[]
  hasOnboardingData: boolean
  isLoading: boolean
}

type SessionRow = { source_workout_day_id: string | null; status: string; started_at: string }

export function usePlanOverview(userId: string): PlanOverviewData {
  const supabase = useMemo(() => createClient(), [])

  const planQuery = useQuery({
    queryKey: ['plans', 'active', userId],
    queryFn: () => getActivePlan(userId),
    enabled: !!userId,
  })
  const activePlan = planQuery.data ?? null

  const daysQuery = useQuery({
    queryKey: ['plan-overview', 'days', activePlan?.id],
    queryFn: () => getDaysWithCount(activePlan!.id),
    enabled: !!activePlan,
  })
  const days = daysQuery.data ?? []

  const lastSessionQuery = useQuery({
    queryKey: ['plan-overview', 'lastSession', activePlan?.id],
    queryFn: () => getLastCompletedPlanSession(userId, activePlan!.id),
    enabled: !!activePlan,
  })

  const weekSessionsQuery = useQuery({
    queryKey: ['plan-overview', 'weekSessions', userId, activePlan?.id],
    queryFn: async () => {
      const today = new Date()
      const monday = getMonday(today)
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)
      sunday.setHours(23, 59, 59, 999)
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('source_workout_day_id, status, started_at')
        .eq('user_id', userId)
        .eq('source_plan_id', activePlan!.id)
        .gte('started_at', monday.toISOString())
        .lte('started_at', sunday.toISOString())
      if (error) throw error
      return (data ?? []) as SessionRow[]
    },
    enabled: !!activePlan,
  })

  const prefsQuery = useQuery({
    queryKey: ['plan-overview', 'prefs', userId],
    queryFn: async () => {
      const { data } = await supabase
        .from('user_fitness_preferences')
        .select('fitness_goal, experience_level, days_per_week, session_duration_minutes')
        .eq('user_id', userId)
        .maybeSingle()
      return (data as UserPrefs | null)
    },
    enabled: !!userId,
  })

  const equipmentQuery = useQuery({
    queryKey: ['plan-overview', 'equipment', userId],
    queryFn: async () => {
      const { data } = await supabase
        .from('user_equipment')
        .select('equipment_items')
        .eq('user_id', userId)
        .maybeSingle()
      return Array.isArray(data?.equipment_items) ? (data!.equipment_items as string[]) : []
    },
    enabled: !!userId,
  })

  const prefs = prefsQuery.data ?? null
  const equipment = equipmentQuery.data ?? []
  const weekSessions = weekSessionsQuery.data ?? []

  const completedDayIds = useMemo(() => {
    const ids = new Set<string>()
    for (const s of weekSessions) {
      if (s.status === 'completed' && s.source_workout_day_id) {
        ids.add(s.source_workout_day_id)
      }
    }
    return ids
  }, [weekSessions])

  const inProgressDayId = useMemo(() => {
    const s = weekSessions.find(
      (r) => r.status === 'in_progress' && r.source_workout_day_id,
    )
    return s?.source_workout_day_id ?? null
  }, [weekSessions])

  const suggestedDayId = useMemo(() => {
    if (days.length === 0) return null
    const lastDayId = lastSessionQuery.data?.sourceWorkoutDayId ?? null
    const lastDayOrder = lastDayId
      ? (days.find((d) => d.id === lastDayId)?.dayOrder ?? -1)
      : -1
    const nextIndex = lastDayOrder === -1 ? 0 : (lastDayOrder + 1) % days.length
    return days[nextIndex]?.id ?? null
  }, [days, lastSessionQuery.data])

  const weekGrid = useMemo((): WeekGridDay[] => {
    const today = new Date()
    const monday = getMonday(today)
    const todayKey = dayKey(today)

    const daysPerWeek = prefs?.days_per_week ?? activePlan?.daysPerWeek ?? 3
    const clamped = Math.min(Math.max(daysPerWeek, 2), 7)
    const workoutIndices = new Set(WORKOUT_DAY_DISTRIBUTIONS[clamped] ?? WORKOUT_DAY_DISTRIBUTIONS[3])

    const completedDateKeys = new Set(
      weekSessions
        .filter((s) => s.status === 'completed')
        .map((s) => dayKey(new Date(s.started_at))),
    )

    return SHORT_LABELS.map((label, i) => {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      const key = dayKey(date)
      return {
        label,
        date: date.toISOString(),
        isToday: key === todayKey,
        isWorkoutDay: workoutIndices.has(i),
        isCompleted: completedDateKeys.has(key),
      }
    })
  }, [prefs?.days_per_week, activePlan?.daysPerWeek, weekSessions])

  const isLoading =
    planQuery.isLoading ||
    prefsQuery.isLoading ||
    (!!activePlan && (daysQuery.isLoading || weekSessionsQuery.isLoading))

  const hasOnboardingData = !prefsQuery.isLoading && prefs !== null

  return {
    activePlan,
    days,
    suggestedDayId,
    completedDayIds,
    inProgressDayId,
    weekGrid,
    prefs,
    equipment,
    hasOnboardingData,
    isLoading,
  }
}
