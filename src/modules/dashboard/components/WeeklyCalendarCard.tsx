'use client'

import { CheckCircle2 } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { SectionLabel } from '@/components/ui'
import { useWeeklyCalendar } from '../hooks/use-weekly-calendar'

type Props = { userId: string }

export function WeeklyCalendarCard({ userId }: Props) {
  const { t } = useI18n()
  const { calendarDays, isLoading } = useWeeklyCalendar(userId)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="h-4 w-24 animate-pulse rounded bg-gym-surface-2" />
        <div className="card p-3">
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-gym-surface-2" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <section aria-label={t('dashboardWeekTitle')}>
      <SectionLabel className="mb-3">{t('dashboardWeekTitle')}</SectionLabel>
      <div className="card p-3">
        <ol className="grid grid-cols-7 gap-1" aria-label="Weekly workout calendar">
          {calendarDays.map((day) => (
            <li
              key={day.date}
              className={`flex flex-col items-center gap-1.5 rounded-xl p-2 transition-colors ${
                day.isToday
                  ? 'bg-gym-accent/12 ring-1 ring-gym-accent/40'
                  : day.isCompleted
                  ? 'bg-gym-surface-3'
                  : ''
              }`}
            >
              <span
                className={`text-xs font-semibold ${
                  day.isToday ? 'text-gym-accent' : 'text-gym-muted'
                }`}
              >
                {day.shortLabel}
              </span>
              {day.isCompleted ? (
                <CheckCircle2
                  className="h-5 w-5 text-gym-accent"
                  aria-label="Completed"
                />
              ) : (
                <div
                  className={`h-5 w-5 rounded-full border-2 ${
                    day.isToday ? 'border-gym-accent' : 'border-gym-border'
                  }`}
                  aria-label={day.isToday ? 'Today' : 'Not completed'}
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
