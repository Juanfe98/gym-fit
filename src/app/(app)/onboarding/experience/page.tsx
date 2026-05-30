import { createClient } from '@/lib/supabase/server'
import { ExperienceSelectionForm } from '@/modules/onboarding/components/ExperienceSelectionForm'
import { OnboardingProgress } from '@/modules/onboarding/components/OnboardingProgress'
import { OnboardingShell } from '@/modules/onboarding/components/OnboardingShell'
import { isExperienceLevel, type ExperienceLevel } from '@/modules/onboarding/types'

export default async function OnboardingExperiencePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let initialExperienceLevel: ExperienceLevel | null = null
  let initialError = false

  if (user) {
    const { data, error } = await supabase
      .from('user_fitness_preferences')
      .select('experience_level')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      initialError = true
    } else if (isExperienceLevel(data?.experience_level)) {
      initialExperienceLevel = data.experience_level
    }
  }

  return (
    <OnboardingShell>
      <section className="flex flex-col gap-8" aria-labelledby="onboarding-experience-title">
        <OnboardingProgress currentStep={2} totalSteps={8} />

        <div className="flex max-w-3xl flex-col gap-4">
          <h1
            id="onboarding-experience-title"
            className="font-heading text-4xl font-semibold uppercase leading-tight tracking-tight text-gym-text sm:text-5xl lg:text-6xl"
          >
            How experienced are you with training?
          </h1>
          <p className="max-w-2xl text-base leading-7 text-gym-muted sm:text-lg sm:leading-8">
            We&apos;ll adjust workout intensity, volume, and progression so your plan feels challenging without outpacing your current training base.
          </p>
        </div>

        <ExperienceSelectionForm
          initialExperienceLevel={initialExperienceLevel}
          initialError={initialError}
        />
      </section>
    </OnboardingShell>
  )
}
