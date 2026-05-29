'use client'

import { useI18n } from '@/i18n/client'
import type { WorkoutPlan } from '../types'

interface PlanCardProps {
  plan: WorkoutPlan
  dayCount?: number
  onClick?: () => void
  showArchivedBadge?: boolean
}

export function PlanCard({ plan, dayCount, onClick, showArchivedBadge }: PlanCardProps) {
  const { t } = useI18n()

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3 min-h-[44px] active:bg-gym-surface-2"
    >
      <div className="flex flex-1 flex-col gap-1 text-left">
        <span className="text-sm font-medium text-gym-text">{plan.name}</span>
        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-gym-muted bg-gym-surface-2 rounded px-2 py-0.5">
            {plan.goal}
          </span>
          <span className="text-xs text-gym-muted bg-gym-surface-2 rounded px-2 py-0.5">
            {plan.level}
          </span>
          {dayCount !== undefined && (
            <span className="text-xs text-gym-muted">{dayCount} days</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showArchivedBadge && (
          <span className="text-xs text-gym-muted bg-gym-surface-2 rounded px-2">{t('planStatusArchived')}</span>
        )}
        {plan.isActive && (
          <span className="text-xs font-semibold text-gym-accent bg-gym-accent/10 rounded px-2 py-0.5">
            {t('planStatusActive')}
          </span>
        )}
      </div>
    </button>
  )
}
