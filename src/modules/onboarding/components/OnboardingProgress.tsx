'use client'

import { useI18n } from '@/i18n/client'

type OnboardingProgressProps = {
  currentStep: number
  totalSteps: number
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  const { t } = useI18n()
  const label = t('onboardingStepIndicator', { current: currentStep, total: totalSteps })

  return (
    <div className="flex items-center gap-3" aria-label={label}>
      <span className="font-heading text-sm font-semibold uppercase tracking-[0.22em] text-orange-400">
        {label}
      </span>
      <div className="h-px flex-1 bg-gym-border" aria-hidden="true" />
    </div>
  )
}
