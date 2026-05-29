import type { ReactNode } from 'react'

export function OnboardingShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-[calc(100dvh-4rem)] overflow-x-hidden bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--color-gym-accent)_24%,transparent),transparent_24rem),linear-gradient(145deg,var(--color-gym-bg)_0%,var(--color-gym-surface)_52%,var(--color-gym-bg)_100%)] px-4 py-6 text-gym-text sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-7rem)] w-full max-w-4xl flex-col justify-center gap-8 py-4 sm:py-8">
        {children}
      </div>
    </main>
  )
}
