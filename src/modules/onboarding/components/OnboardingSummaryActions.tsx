'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/client'
import { completeOnboarding } from '../services/onboarding-state'

export function OnboardingSummaryActions() {
  const router = useRouter()
  const { t } = useI18n()
  const [isCompleting, setIsCompleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleComplete() {
    if (isCompleting) return
    setIsCompleting(true)
    setError(null)
    try {
      await completeOnboarding()
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      const isValidationError =
        err instanceof Error && err.message.includes('required steps')
      setError(isValidationError ? t('onboardingSummaryMissingRequired') : t('onboardingSkipError'))
      setIsCompleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {error}
        </p>
      )}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/onboarding/limitations"
          aria-disabled={isCompleting}
          onClick={(e) => { if (isCompleting) e.preventDefault() }}
          className="focus-ring flex min-h-[48px] items-center justify-center rounded-lg border border-gym-border bg-gym-surface/80 px-6 font-heading text-base font-semibold uppercase tracking-wide text-gym-text transition-colors duration-150 hover:border-gym-border-strong hover:bg-gym-surface-3 aria-disabled:pointer-events-none aria-disabled:opacity-50 sm:min-w-36"
        >
          {t('onboardingBack')}
        </Link>
        <button
          type="button"
          onClick={handleComplete}
          disabled={isCompleting}
          className="focus-ring flex min-h-[48px] items-center justify-center rounded-lg bg-orange-500 px-6 font-heading text-base font-semibold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-orange-600 active:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-44"
        >
          {isCompleting ? t('onboardingSummaryCompleting') : t('onboardingSummaryCompleteSetup')}
        </button>
      </div>
    </div>
  )
}
