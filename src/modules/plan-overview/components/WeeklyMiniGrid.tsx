'use client'

import { CheckCircle2, Dumbbell, Minus } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { SectionLabel } from '@/components/ui'
import type { WeekGridDay } from '../hooks/use-plan-overview'

interface Props {
  days: WeekGridDay[]
  isLoading: boolean
}

export function WeeklyMiniGrid({ days, isLoading }: Props) {
  const { t } = useI18n()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="h-4 w-24 animate-pulse rounded bg-gym-surface-2" />
        <div className="card p-3">
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-gym-surface-2" />
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
        <ol className="grid grid-cols-7 gap-1" aria-label="Weekly workout plan overview">
          {days.map((day) => (
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
                {day.label}
              </span>
              {day.isCompleted ? (
                <CheckCircle2
                  className="h-5 w-5 text-gym-accent"
                  aria-label="Completed"
                />
              ) : day.isWorkoutDay ? (
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${
                    day.isToday
                      ? 'bg-gym-accent text-white'
                      : 'bg-gym-surface-2 text-gym-muted'
                  }`}
                  aria-label={day.isToday ? 'Workout day — today' : 'Workout day'}
                >
                  <Dumbbell className="h-3 w-3" aria-hidden="true" />
                </div>
              ) : (
                <div
                  className="flex h-5 w-5 items-center justify-center"
                  aria-label="Rest day"
                >
                  <Minus className="h-3 w-3 text-gym-border" aria-hidden="true" />
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
