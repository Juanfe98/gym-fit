'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/client'
import { TimeOptionCard } from './TimeOptionCard'
import { OnboardingActions } from './OnboardingActions'
import { saveSessionDuration } from '../services/onboarding-state'
import { WORKOUT_DURATION_OPTIONS, type WorkoutDurationMinutes } from '../types'

type TimeSelectionFormProps = {
  initialMinutes: WorkoutDurationMinutes | null
}

export function TimeSelectionForm({ initialMinutes }: TimeSelectionFormProps) {
  const router = useRouter()
  const { t } = useI18n()
  const [selectedMinutes, setSelectedMinutes] = useState<WorkoutDurationMinutes | null>(initialMinutes)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function continueOnboarding() {
    if (!selectedMinutes || isSaving) return

    setIsSaving(true)
    setError(null)

    try {
      await saveSessionDuration(selectedMinutes)
      router.push('/onboarding/equipment')
      router.refresh()
    } catch {
      setError(t('onboardingTimeSaveError'))
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {WORKOUT_DURATION_OPTIONS.map((minutes) => (
          <TimeOptionCard
            key={minutes}
            minutes={minutes}
            label={t('onboardingTimeMinutes', { count: minutes })}
            selected={selectedMinutes === minutes}
            onSelect={(m) => {
              setSelectedMinutes(m)
              setError(null)
            }}
            disabled={isSaving}
          />
        ))}
      </div>

      <OnboardingActions
        canContinue={selectedMinutes !== null}
        isSaving={isSaving}
        onContinue={continueOnboarding}
        backHref="/onboarding/frequency"
      />
    </div>
  )
}
