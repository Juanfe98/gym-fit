import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { fetchHistoryList } from '../services/history-supabase'
import type { WorkoutHistorySummary } from '../types'

export interface TrainingStats {
  totalWorkouts: number
  totalVolume: number
  weekWorkouts: number
  weekVolume: number
  weekDurationSeconds: number
  currentStreakDays: number
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

/** Local YYYY-MM-DD key so streaks respect the user's calendar day. */
function dayKey(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function computeStreak(sessions: WorkoutHistorySummary[]): number {
  const days = new Set(sessions.map((s) => dayKey(s.startedAt)))
  const cursor = new Date()
  // Allow the streak to count if the user trained today OR most recently yesterday.
  if (!days.has(dayKey(cursor.toISOString()))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!days.has(dayKey(cursor.toISOString()))) return 0
  }
  let streak = 0
  while (days.has(dayKey(cursor.toISOString()))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

function aggregate(sessions: WorkoutHistorySummary[]): TrainingStats {
  const weekStart = Date.now() - WEEK_MS
  const week = sessions.filter((s) => new Date(s.startedAt).getTime() >= weekStart)
  return {
    totalWorkouts: sessions.length,
    totalVolume: sessions.reduce((sum, s) => sum + (s.totalVolume ?? 0), 0),
    weekWorkouts: week.length,
    weekVolume: week.reduce((sum, s) => sum + (s.totalVolume ?? 0), 0),
    weekDurationSeconds: week.reduce((sum, s) => sum + s.durationSeconds, 0),
    currentStreakDays: computeStreak(sessions),
  }
}

/**
 * Aggregate training stats derived from completed workout sessions. Shared by
 * the home weekly summary and the profile screen — React Query dedups the fetch
 * across both consumers via the shared query key.
 */
export function useTrainingStats(userId: string) {
  const supabase = useMemo(() => createClient(), [])

  const query = useQuery({
    queryKey: ['training-stats', userId],
    queryFn: async (): Promise<TrainingStats> => {
      const result = await fetchHistoryList({ supabase, userId, limit: 500 })
      if (result.error) throw new Error(result.error)
      return aggregate(result.data ?? [])
    },
  })

  return query
}
