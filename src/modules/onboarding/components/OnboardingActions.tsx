'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/client'

type OnboardingActionsProps = {
  canContinue: boolean
  isSaving: boolean
  onContinue: () => void
  backHref?: string
}

export function OnboardingActions({ canContinue, isSaving, onContinue, backHref = '/onboarding/welcome' }: OnboardingActionsProps) {
  const { t } = useI18n()
  const backDisabled = isSaving

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Link
        href={backHref}
        aria-disabled={backDisabled}
        onClick={(event) => {
          if (backDisabled) event.preventDefault()
        }}
        className="focus-ring flex min-h-[48px] items-center justify-center rounded-lg border border-gym-border bg-gym-surface/80 px-6 font-heading text-base font-semibold uppercase tracking-wide text-gym-text transition-colors duration-150 hover:border-gym-border-strong hover:bg-gym-surface-3 aria-disabled:pointer-events-none aria-disabled:opacity-50 sm:min-w-36"
      >
        {t('onboardingBack')}
      </Link>
      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue || isSaving}
        className="focus-ring flex min-h-[48px] items-center justify-center rounded-lg bg-orange-500 px-6 font-heading text-base font-semibold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-orange-600 active:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-44"
      >
        {isSaving ? t('onboardingSaving') : t('onboardingContinue')}
      </button>
    </div>
  )
}
