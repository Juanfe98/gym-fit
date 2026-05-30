import { createClient } from '@/lib/supabase/server'
import { GoalSelectionForm } from '@/modules/onboarding/components/GoalSelectionForm'
import { OnboardingProgress } from '@/modules/onboarding/components/OnboardingProgress'
import { OnboardingShell } from '@/modules/onboarding/components/OnboardingShell'
import { isMainGoal } from '@/modules/onboarding/types'

export default async function OnboardingGoalPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const initialGoal = isMainGoal(user?.user_metadata?.mainGoal)
    ? user.user_metadata.mainGoal
    : null

  return (
    <OnboardingShell>
      <section className="flex flex-col gap-8" aria-labelledby="onboarding-goal-title">
        <OnboardingProgress currentStep={1} totalSteps={8} />

        <div className="flex max-w-3xl flex-col gap-4">
          <h1
            id="onboarding-goal-title"
            className="font-heading text-4xl font-semibold uppercase leading-tight tracking-tight text-gym-text sm:text-5xl lg:text-6xl"
          >
            What is your main fitness goal?
          </h1>
          <p className="max-w-2xl text-base leading-7 text-gym-muted sm:text-lg sm:leading-8">
            Choose the goal that best matches what you want to focus on first. You can update this later.
          </p>
        </div>

        <GoalSelectionForm initialGoal={initialGoal} />
      </section>
    </OnboardingShell>
  )
}
