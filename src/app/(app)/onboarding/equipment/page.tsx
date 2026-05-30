import { Dumbbell } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { EquipmentSelectionForm } from '@/modules/onboarding/components/EquipmentSelectionForm'
import { OnboardingProgress } from '@/modules/onboarding/components/OnboardingProgress'
import { OnboardingShell } from '@/modules/onboarding/components/OnboardingShell'
import { OnboardingPageHeader } from '@/modules/onboarding/components/OnboardingPageHeader'
import { EQUIPMENT_OPTIONS, type EquipmentItem } from '@/modules/onboarding/types'

const VALID_EQUIPMENT_IDS = new Set<string>(EQUIPMENT_OPTIONS.map((o) => o.id))

export default async function OnboardingEquipmentPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let initialItems: EquipmentItem[] = []

  if (user) {
    const { data } = await supabase
      .from('user_equipment')
      .select('equipment_items')
      .eq('user_id', user.id)
      .maybeSingle()

    if (Array.isArray(data?.equipment_items)) {
      initialItems = (data.equipment_items as string[]).filter((item): item is EquipmentItem =>
        VALID_EQUIPMENT_IDS.has(item)
      )
    }
  }

  return (
    <OnboardingShell>
      <section className="flex flex-col gap-8" aria-labelledby="onboarding-equipment-title">
        <OnboardingProgress currentStep={5} totalSteps={8} />

        <OnboardingPageHeader
          titleKey="onboardingEquipmentTitle"
          subtitleKey="onboardingEquipmentSubtitle"
          headingId="onboarding-equipment-title"
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400"
            aria-hidden="true"
          >
            <Dumbbell className="h-7 w-7" />
          </div>
        </OnboardingPageHeader>

        <EquipmentSelectionForm initialItems={initialItems} />
      </section>
    </OnboardingShell>
  )
}
