import { CalendarDays } from 'lucide-react'
import { OnboardingProgress } from '@/modules/onboarding/components/OnboardingProgress'
import { OnboardingShell } from '@/modules/onboarding/components/OnboardingShell'

export default function OnboardingFrequencyPage() {
  return (
    <OnboardingShell>
      <section
        className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-2xl border border-gym-border bg-gym-surface-2/90 p-6 text-center sm:p-8"
        aria-labelledby="onboarding-frequency-title"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400" aria-hidden="true">
          <CalendarDays className="h-7 w-7" />
        </div>
        <OnboardingProgress currentStep={3} totalSteps={8} />
        <div className="flex flex-col gap-3">
          <h1 id="onboarding-frequency-title" className="font-heading text-3xl font-semibold uppercase tracking-tight text-gym-text sm:text-4xl">
            Training frequency
          </h1>
          <p className="text-base leading-7 text-gym-muted">
            Your experience level is saved. The frequency step will be completed in the next onboarding module.
          </p>
        </div>
      </section>
    </OnboardingShell>
  )
}
