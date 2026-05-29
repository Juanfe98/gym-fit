'use client'

import { ChevronRight } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import type { Goal } from '@/types'

interface TemplatePickerProps {
  onSelect: (goal: Goal) => void
  onBack: () => void
}

const GOALS: Array<{ goal: Goal; labelKey: 'planGoalMuscleGain' | 'planGoalFatLoss' | 'planGoalStrength' | 'planGoalConditioning' }> = [
  { goal: 'muscle-gain', labelKey: 'planGoalMuscleGain' },
  { goal: 'fat-loss', labelKey: 'planGoalFatLoss' },
  { goal: 'strength', labelKey: 'planGoalStrength' },
  { goal: 'conditioning', labelKey: 'planGoalConditioning' },
]

export function TemplatePicker({ onSelect, onBack }: TemplatePickerProps) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <button
          onClick={onBack}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gym-muted"
        >
          ←
        </button>
        <h2 className="text-base font-semibold text-gym-text">{t('planFromTemplate')}</h2>
      </div>

      <div className="flex flex-col gap-3 px-4">
        {GOALS.map(({ goal, labelKey }) => (
          <button
            key={goal}
            onClick={() => onSelect(goal)}
            className="flex w-full items-center justify-between px-4 py-4 min-h-[44px] bg-gym-surface-2 rounded-lg border border-gym-border active:border-gym-accent"
          >
            <span className="text-sm font-medium text-gym-text">{t(labelKey)}</span>
            <ChevronRight className="h-4 w-4 text-gym-muted" />
          </button>
        ))}
      </div>
    </div>
  )
}
