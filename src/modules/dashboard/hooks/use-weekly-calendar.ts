import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { fetchHistoryList } from '@/modules/workout-history/services/history-supabase'
import type { WeeklyCalendarDay } from '../types'

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

const SHORT_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function useWeeklyCalendar(userId: string): {
  calendarDays: WeeklyCalendarDay[]
  isLoading: boolean
} {
  const supabase = useMemo(() => createClient(), [])

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['dashboard', 'weekly-calendar', userId],
    queryFn: async () => {
      const result = await fetchHistoryList({ supabase, userId, dateRange: '7d', limit: 50 })
      if (result.error) throw new Error(result.error)
      return result.data ?? []
    },
    enabled: !!userId,
  })

  const calendarDays = useMemo((): WeeklyCalendarDay[] => {
    const today = new Date()
    const monday = getMonday(today)
    const todayKey = dayKey(today)

    const completedKeys = new Set(
      (sessions ?? []).map(s => dayKey(new Date(s.startedAt)))
    )

    return SHORT_LABELS.map((label, i) => {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      const key = dayKey(date)
      return {
        date: date.toISOString(),
        shortLabel: label,
        isToday: key === todayKey,
        isCompleted: completedKeys.has(key),
      }
    })
  }, [sessions])

  return { calendarDays, isLoading }
}
