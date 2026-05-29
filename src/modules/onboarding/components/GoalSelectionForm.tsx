'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/client'
import { GoalOptionGrid } from './GoalOptionGrid'
import { OnboardingActions } from './OnboardingActions'
import { saveMainGoal } from '../services/onboarding-state'
import type { MainGoal } from '../types'

type GoalSelectionFormProps = {
  initialGoal: MainGoal | null
}

export function GoalSelectionForm({ initialGoal }: GoalSelectionFormProps) {
  const router = useRouter()
  const { t } = useI18n()
  const [selectedGoal, setSelectedGoal] = useState<MainGoal | null>(initialGoal)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function continueOnboarding() {
    if (!selectedGoal || isSaving) return

    setIsSaving(true)
    setError(null)

    try {
      await saveMainGoal(selectedGoal)
      router.push('/onboarding/experience')
      router.refresh()
    } catch {
      setError(t('onboardingGoalSaveError'))
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

      <GoalOptionGrid
        selectedGoal={selectedGoal}
        onSelect={(goal) => {
          setSelectedGoal(goal)
          setError(null)
        }}
        disabled={isSaving}
      />

      <OnboardingActions
        canContinue={selectedGoal !== null}
        isSaving={isSaving}
        onContinue={continueOnboarding}
      />
    </div>
  )
}
