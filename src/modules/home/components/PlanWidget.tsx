'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/client'
import { useActivePlanWidget } from '../hooks/use-active-plan-widget'

interface PlanWidgetProps {
  userId: string
}

export function PlanWidget({ userId }: PlanWidgetProps) {
  const { t } = useI18n()
  const router = useRouter()
  const { activePlan, days, suggestedDayId, isLoading } = useActivePlanWidget(userId)
  const [emptyDayId, setEmptyDayId] = useState<string | null>(null)

  if (isLoading || !activePlan) return null

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gym-muted">
        {t('activePlanHeader')}
      </h2>
      <ul className="flex flex-col gap-2">
        {days.map((day) => (
          <li key={day.id}>
            <button
              type="button"
              onClick={() => {
                if (day.exerciseCount === 0) {
                  setEmptyDayId(day.id)
                } else {
                  setEmptyDayId(null)
                  router.push(
                    `/workout?planId=${encodeURIComponent(activePlan.id)}&dayId=${encodeURIComponent(day.id)}&planName=${encodeURIComponent(activePlan.name)}&dayName=${encodeURIComponent(day.name)}`,
                  )
                }
              }}
              className={`flex min-h-[44px] w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors active:bg-gym-surface-2 ${
                suggestedDayId === day.id
                  ? 'border-gym-accent bg-gym-accent-subtle'
                  : 'border-gym-border bg-gym-surface'
              }`}
            >
              <span className="flex-1 text-sm font-medium">{day.name}</span>
              {suggestedDayId === day.id && (
                <span className="rounded-full bg-gym-accent px-2 py-0.5 text-xs font-semibold text-white">
                  {t('nextUpLabel')}
                </span>
              )}
              <span className="rounded-full bg-gym-surface-2 px-2 py-0.5 text-xs text-gym-muted">
                {day.exerciseCount}
              </span>
            </button>
            {emptyDayId === day.id && (
              <p className="px-4 pt-1 text-xs text-gym-muted">{t('emptyDayWarning')}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
