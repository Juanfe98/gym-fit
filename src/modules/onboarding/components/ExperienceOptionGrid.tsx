'use client'

import { useI18n } from '@/i18n/client'
import { ExperienceOptionCard } from './ExperienceOptionCard'
import { ONBOARDING_EXPERIENCE_OPTIONS, type ExperienceLevel } from '../types'

type ExperienceOptionGridProps = {
  selectedLevel: ExperienceLevel | null
  onSelect: (level: ExperienceLevel) => void
  disabled?: boolean
}

export function ExperienceOptionGrid({ selectedLevel, onSelect, disabled = false }: ExperienceOptionGridProps) {
  const { t } = useI18n()

  return (
    <div className="grid gap-4 md:grid-cols-3" role="group" aria-label={t('onboardingExperienceOptionsAria')}>
      {ONBOARDING_EXPERIENCE_OPTIONS.map((option) => (
        <ExperienceOptionCard
          key={option.id}
          id={option.id}
          label={t(option.labelKey)}
          description={t(option.descriptionKey)}
          examples={option.exampleKeys.map((key) => t(key))}
          selected={selectedLevel === option.id}
          onSelect={onSelect}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
