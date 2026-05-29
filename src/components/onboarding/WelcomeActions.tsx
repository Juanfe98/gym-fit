'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/i18n/client'

export function WelcomeActions() {
  const router = useRouter()
  const { t } = useI18n()
  const [isSkipping, setIsSkipping] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function skipOnboarding() {
    if (isSkipping) return

    setIsSkipping(true)
    setError(null)

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        onboarding_status: 'skipped',
        onboarding_skipped_at: new Date().toISOString(),
      },
    })

    if (updateError) {
      setError(t('onboardingSkipError'))
      setIsSkipping(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
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

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/onboarding/goal"
          aria-label={t('onboardingStartSetup')}
          aria-disabled={isSkipping}
          onClick={(event) => {
            if (isSkipping) event.preventDefault()
          }}
          className="focus-ring flex min-h-[48px] flex-1 items-center justify-center rounded-lg bg-orange-500 px-6 font-heading text-base font-semibold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-orange-600 active:bg-orange-700 aria-disabled:pointer-events-none aria-disabled:opacity-50"
        >
          {t('onboardingStartSetup')}
        </Link>
        <button
          type="button"
          aria-label={t('onboardingSkipForNow')}
          onClick={skipOnboarding}
          disabled={isSkipping}
          className="focus-ring flex min-h-[48px] flex-1 items-center justify-center rounded-lg border border-gym-border bg-gym-surface/80 px-6 font-heading text-base font-semibold uppercase tracking-wide text-gym-text transition-colors duration-150 hover:border-gym-border-strong hover:bg-gym-surface-3 disabled:opacity-50"
        >
          {isSkipping ? t('onboardingSkipping') : t('onboardingSkipForNow')}
        </button>
      </div>
    </div>
  )
}
