'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/client'
import { ExperienceOptionGrid } from './ExperienceOptionGrid'
import { OnboardingActions } from './OnboardingActions'
import { saveExperienceLevel } from '../services/onboarding-state'
import type { ExperienceLevel } from '../types'

type ExperienceSelectionFormProps = {
  initialExperienceLevel: ExperienceLevel | null
  initialError?: boolean
}

export function ExperienceSelectionForm({ initialExperienceLevel, initialError = false }: ExperienceSelectionFormProps) {
  const router = useRouter()
  const { t } = useI18n()
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | null>(initialExperienceLevel)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(initialError ? t('onboardingExperienceLoadError') : null)

  async function continueOnboarding() {
    if (!selectedLevel || isSaving) return

    setIsSaving(true)
    setError(null)

    try {
      await saveExperienceLevel(selectedLevel)
      router.push('/onboarding/frequency')
      router.refresh()
    } catch {
      setError(t('onboardingExperienceSaveError'))
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {error}
        </p>
      )}

      <ExperienceOptionGrid
        selectedLevel={selectedLevel}
        onSelect={(level) => {
          setSelectedLevel(level)
          setError(null)
        }}
        disabled={isSaving}
      />

      <OnboardingActions
        backHref="/onboarding/goal"
        canContinue={selectedLevel !== null}
        isSaving={isSaving}
        onContinue={continueOnboarding}
      />
    </div>
  )
}
