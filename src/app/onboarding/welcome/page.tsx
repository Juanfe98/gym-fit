import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WelcomeActions } from '@/components/onboarding/WelcomeActions'
import { WelcomeBenefitList } from '@/components/onboarding/WelcomeBenefitList'
import { WelcomeHero, WelcomePreviewCard } from '@/components/onboarding/WelcomeHero'

export default async function OnboardingWelcomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <main className="min-h-dvh overflow-x-hidden bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-gym-accent)_22%,transparent),transparent_28rem),linear-gradient(135deg,var(--color-gym-bg)_0%,var(--color-gym-surface)_48%,var(--color-gym-bg)_100%)] px-4 py-8 text-gym-text sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)] lg:gap-14">
        <div className="flex flex-col gap-8">
          <WelcomeHero>
            <WelcomeBenefitList />
          </WelcomeHero>
          <WelcomeActions />
        </div>

        <div className="lg:pl-4">
          <WelcomePreviewCard />
        </div>
      </div>
    </main>
  )
}
