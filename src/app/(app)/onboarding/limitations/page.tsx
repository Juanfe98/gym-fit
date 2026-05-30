import { ShieldAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { LimitationsSelectionForm } from '@/modules/onboarding/components/LimitationsSelectionForm'
import { OnboardingProgress } from '@/modules/onboarding/components/OnboardingProgress'
import { OnboardingShell } from '@/modules/onboarding/components/OnboardingShell'
import { OnboardingPageHeader } from '@/modules/onboarding/components/OnboardingPageHeader'
import { isBodyArea, type BodyArea } from '@/modules/onboarding/types'

export default async function OnboardingLimitationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let initialAreas: BodyArea[] = []
  let initialNotes = ''

  if (user) {
    const { data } = await supabase
      .from('user_limitations')
      .select('affected_area, description')
      .eq('user_id', user.id)
      .order('created_at')

    if (data && data.length > 0) {
      initialAreas = data
        .map((row: { affected_area: string; description: string | null }) => row.affected_area)
        .filter(isBodyArea)

      const firstDescription = data[0].description
      if (typeof firstDescription === 'string') initialNotes = firstDescription
    }
  }

  return (
    <OnboardingShell>
      <section className="flex flex-col gap-8" aria-labelledby="onboarding-limitations-title">
        <OnboardingProgress currentStep={7} totalSteps={8} />

        <OnboardingPageHeader
          titleKey="onboardingLimitationsTitle"
          subtitleKey="onboardingLimitationsSubtitle"
          headingId="onboarding-limitations-title"
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400"
            aria-hidden="true"
          >
            <ShieldAlert className="h-7 w-7" />
          </div>
        </OnboardingPageHeader>

        <LimitationsSelectionForm initialAreas={initialAreas} initialNotes={initialNotes} />
      </section>
    </OnboardingShell>
  )
}
