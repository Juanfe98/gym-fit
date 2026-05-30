import { Timer } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { TimeSelectionForm } from '@/modules/onboarding/components/TimeSelectionForm'
import { OnboardingProgress } from '@/modules/onboarding/components/OnboardingProgress'
import { OnboardingShell } from '@/modules/onboarding/components/OnboardingShell'
import { OnboardingPageHeader } from '@/modules/onboarding/components/OnboardingPageHeader'
import { isWorkoutDurationMinutes, type WorkoutDurationMinutes } from '@/modules/onboarding/types'

export default async function OnboardingTimePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let initialMinutes: WorkoutDurationMinutes | null = null

  if (user) {
    const { data } = await supabase
      .from('user_fitness_preferences')
      .select('session_duration_minutes')
      .eq('user_id', user.id)
      .maybeSingle()

    if (isWorkoutDurationMinutes(data?.session_duration_minutes)) {
      initialMinutes = data.session_duration_minutes
    }
  }

  return (
    <OnboardingShell>
      <section className="flex flex-col gap-8" aria-labelledby="onboarding-time-title">
        <OnboardingProgress currentStep={4} totalSteps={8} />

        <OnboardingPageHeader
          titleKey="onboardingTimeTitle"
          subtitleKey="onboardingTimeSubtitle"
          headingId="onboarding-time-title"
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400"
            aria-hidden="true"
          >
            <Timer className="h-7 w-7" />
          </div>
        </OnboardingPageHeader>

        <TimeSelectionForm initialMinutes={initialMinutes} />
      </section>
    </OnboardingShell>
  )
}
