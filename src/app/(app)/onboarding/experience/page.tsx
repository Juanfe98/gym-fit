import { Dumbbell } from 'lucide-react'
import { OnboardingProgress } from '@/modules/onboarding/components/OnboardingProgress'
import { OnboardingShell } from '@/modules/onboarding/components/OnboardingShell'

export default function OnboardingExperiencePage() {
  return (
    <OnboardingShell>
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-2xl border border-gym-border bg-gym-surface-2/90 p-6 text-center sm:p-8" aria-labelledby="onboarding-experience-title">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400" aria-hidden="true">
          <Dumbbell className="h-7 w-7" />
        </div>
        <OnboardingProgress currentStep={2} totalSteps={7} />
        <div className="flex flex-col gap-3">
          <h1 id="onboarding-experience-title" className="font-heading text-3xl font-semibold uppercase tracking-tight text-gym-text sm:text-4xl">
            Training experience
          </h1>
          <p className="text-base leading-7 text-gym-muted">
            Your main goal is saved. The experience step will be completed in the next onboarding module.
          </p>
        </div>
      </section>
    </OnboardingShell>
  )
}
