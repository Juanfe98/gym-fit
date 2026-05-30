'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FrequencyOptionCard } from './FrequencyOptionCard'
import { OnboardingActions } from './OnboardingActions'
import { saveWeeklyWorkoutDays } from '../services/onboarding-state'
import { WEEKLY_WORKOUT_DAYS_OPTIONS, type WeeklyWorkoutDays } from '../types'

type FrequencySelectionFormProps = {
  initialDays: WeeklyWorkoutDays | null
}

export function FrequencySelectionForm({ initialDays }: FrequencySelectionFormProps) {
  const router = useRouter()
  const [selectedDays, setSelectedDays] = useState<WeeklyWorkoutDays | null>(initialDays)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function continueOnboarding() {
    if (!selectedDays || isSaving) return

    setIsSaving(true)
    setError(null)

    try {
      await saveWeeklyWorkoutDays(selectedDays)
      router.push('/onboarding/time')
      router.refresh()
    } catch {
      setError("We couldn't save your workout frequency. Please try again.")
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
        {WEEKLY_WORKOUT_DAYS_OPTIONS.map((days) => (
          <FrequencyOptionCard
            key={days}
            days={days}
            selected={selectedDays === days}
            onSelect={(d) => {
              setSelectedDays(d)
              setError(null)
            }}
            disabled={isSaving}
          />
        ))}
      </div>

      <OnboardingActions
        canContinue={selectedDays !== null}
        isSaving={isSaving}
        onContinue={continueOnboarding}
        backHref="/onboarding/experience"
      />
    </div>
  )
}
