type OnboardingProgressProps = {
  currentStep: number
  totalSteps: number
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  const progress = `${currentStep} / ${totalSteps}`

  return (
    <div className="flex items-center gap-3" aria-label={`Step ${currentStep} of ${totalSteps}`}>
      <span className="font-heading text-sm font-semibold uppercase tracking-[0.22em] text-orange-400">
        Step {currentStep} of {totalSteps}
      </span>
      <div className="h-px flex-1 bg-gym-border" aria-hidden="true" />
      <span className="metric text-sm text-gym-muted" aria-hidden="true">
        {progress}
      </span>
    </div>
  )
}
