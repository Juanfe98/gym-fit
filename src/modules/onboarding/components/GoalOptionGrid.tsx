'use client'

import { useI18n } from '@/i18n/client'
import { GoalOptionCard } from './GoalOptionCard'
import { ONBOARDING_GOAL_OPTIONS, type MainGoal } from '../types'

type GoalOptionGridProps = {
  selectedGoal: MainGoal | null
  onSelect: (goal: MainGoal) => void
  disabled?: boolean
}

export function GoalOptionGrid({ selectedGoal, onSelect, disabled = false }: GoalOptionGridProps) {
  const { t } = useI18n()

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label={t('onboardingGoalOptionsAria')}>
      {ONBOARDING_GOAL_OPTIONS.map((option) => (
        <GoalOptionCard
          key={option.id}
          id={option.id}
          label={t(option.labelKey)}
          description={t(option.descriptionKey)}
          selected={selectedGoal === option.id}
          onSelect={onSelect}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
