import { Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { FrequencySelectionForm } from '@/modules/onboarding/components/FrequencySelectionForm'
import { OnboardingProgress } from '@/modules/onboarding/components/OnboardingProgress'
import { OnboardingShell } from '@/modules/onboarding/components/OnboardingShell'
import { isWeeklyWorkoutDays, type WeeklyWorkoutDays } from '@/modules/onboarding/types'

export default async function OnboardingFrequencyPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let initialDays: WeeklyWorkoutDays | null = null

  if (user) {
    const { data } = await supabase
      .from('user_fitness_preferences')
      .select('days_per_week')
      .eq('user_id', user.id)
      .maybeSingle()

    if (isWeeklyWorkoutDays(data?.days_per_week)) {
      initialDays = data.days_per_week
    }
  }

  return (
    <OnboardingShell>
      <section className="flex flex-col gap-8" aria-labelledby="onboarding-frequency-title">
        <OnboardingProgress currentStep={3} totalSteps={8} />

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
