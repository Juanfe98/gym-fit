import { Ruler } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BodyInfoForm } from '@/modules/onboarding/components/BodyInfoForm'
import { OnboardingProgress } from '@/modules/onboarding/components/OnboardingProgress'
import { OnboardingShell } from '@/modules/onboarding/components/OnboardingShell'
import { OnboardingPageHeader } from '@/modules/onboarding/components/OnboardingPageHeader'

export default async function OnboardingBodyInfoPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let initialAge: number | null = null
  let initialHeightCm: number | null = null
  let initialWeightKg: number | null = null
  let initialHeightUnit: 'cm' | 'in' = 'cm'
  let initialWeightUnit: 'kg' | 'lb' = 'kg'

  if (user) {
    const age = user.user_metadata?.age
    if (typeof age === 'number' && age > 0) initialAge = age

    const [bodyInfoResult, prefsResult] = await Promise.all([
      supabase
        .from('user_body_info')
        .select('height_cm, weight_kg')
        .eq('user_id', user.id)
        .maybeSingle(),
      supabase
        .from('user_fitness_preferences')
        .select('height_unit, weight_unit')
        .eq('user_id', user.id)
        .maybeSingle(),
    ])

    if (typeof bodyInfoResult.data?.height_cm === 'number') {
      initialHeightCm = bodyInfoResult.data.height_cm
    }
    if (typeof bodyInfoResult.data?.weight_kg === 'number') {
      initialWeightKg = bodyInfoResult.data.weight_kg
    }
    if (prefsResult.data?.height_unit === 'in') initialHeightUnit = 'in'
    if (prefsResult.data?.weight_unit === 'lb') initialWeightUnit = 'lb'
  }

  return (
    <OnboardingShell>
      <section className="flex flex-col gap-8" aria-labelledby="onboarding-body-info-title">
        <OnboardingProgress currentStep={6} totalSteps={8} />

        <OnboardingPageHeader
          titleKey="onboardingBodyInfoTitle"
          subtitleKey="onboardingBodyInfoSubtitle"
          headingId="onboarding-body-info-title"
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400"
            aria-hidden="true"
          >
            <Ruler className="h-7 w-7" />
          </div>
        </OnboardingPageHeader>

        <BodyInfoForm
          initialAge={initialAge}
          initialHeightCm={initialHeightCm}
          initialWeightKg={initialWeightKg}
          initialHeightUnit={initialHeightUnit}
          initialWeightUnit={initialWeightUnit}
        />
      </section>
    </OnboardingShell>
  )
}
