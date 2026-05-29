'use client'

import { Plus } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { PlanDayCard } from './PlanDayCard'
import type { WorkoutDayWithCount } from '../types'

interface PlanDayListProps {
  days: WorkoutDayWithCount[]
  onAddDay: () => void
  onEditDay: (dayId: string) => void
  onRemoveDay: (dayId: string) => void
}

export function PlanDayList({ days, onAddDay, onEditDay, onRemoveDay }: PlanDayListProps) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col">
      {days.length === 0 && (
        <p className="px-4 py-6 text-sm text-gym-muted text-center">No days yet</p>
      )}
      {days.map((day) => (
        <PlanDayCard
          key={day.id}
          day={day}
          onEdit={() => onEditDay(day.id)}
          onRemove={() => onRemoveDay(day.id)}
        />
      ))}
      <button
        onClick={onAddDay}
        className="flex w-full items-center justify-center gap-2 min-h-[44px] border-t border-gym-border text-gym-accent text-sm font-semibold"
      >
        <Plus className="h-4 w-4" />
        {t('addDay')}
      </button>
    </div>
  )
}
