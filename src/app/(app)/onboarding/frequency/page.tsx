import { Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { FrequencySelectionForm } from '@/modules/onboarding/components/FrequencySelectionForm'
import { OnboardingProgress } from '@/modules/onboarding/components/OnboardingProgress'
import { OnboardingShell } from '@/modules/onboarding/components/OnboardingShell'
import { isWeeklyWorkoutDays } from '@/modules/onboarding/types'

export default async function OnboardingFrequencyPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const initialDays = isWeeklyWorkoutDays(user?.user_metadata?.weeklyWorkoutDays)
    ? user.user_metadata.weeklyWorkoutDays
    : null

  return (
    <OnboardingShell>
      <section className="flex flex-col gap-8" aria-labelledby="onboarding-frequency-title">
        <OnboardingProgress currentStep={3} totalSteps={7} />

        <div className="flex max-w-3xl flex-col gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400"
            aria-hidden="true"
          >
            <Calendar className="h-7 w-7" />
          </div>
          <h1
            id="onboarding-frequency-title"
            className="font-heading text-4xl font-semibold uppercase leading-tight tracking-tight text-gym-text sm:text-5xl lg:text-6xl"
          >
            How many days per week can you train?
          </h1>
          <p className="max-w-2xl text-base leading-7 text-gym-muted sm:text-lg sm:leading-8">
            Choose a realistic training frequency. You can always update this later.
          </p>
        </div>

        <FrequencySelectionForm initialDays={initialDays} />
      </section>
    </OnboardingShell>
  )
}
