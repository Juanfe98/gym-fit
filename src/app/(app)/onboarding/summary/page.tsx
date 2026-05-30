import { createClient } from '@/lib/supabase/server'
import { OnboardingShell } from '@/modules/onboarding/components/OnboardingShell'
import { OnboardingProgress } from '@/modules/onboarding/components/OnboardingProgress'
import { OnboardingPageHeader } from '@/modules/onboarding/components/OnboardingPageHeader'
import { OnboardingSummaryView } from '@/modules/onboarding/components/OnboardingSummaryView'
import { OnboardingSummaryActions } from '@/modules/onboarding/components/OnboardingSummaryActions'
import { EQUIPMENT_OPTIONS } from '@/modules/onboarding/types'

const VALID_EQUIPMENT_IDS = new Set<string>(EQUIPMENT_OPTIONS.map((o) => o.id))

export default async function OnboardingSummaryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [prefsResult, equipmentResult, bodyInfoResult, limitationsResult] = await Promise.all([
    supabase
      .from('user_fitness_preferences')
      .select('experience_level, days_per_week, session_duration_minutes, height_unit, weight_unit')
      .eq('user_id', user!.id)
      .maybeSingle(),
    supabase
      .from('user_equipment')
      .select('equipment_items')
      .eq('user_id', user!.id)
      .maybeSingle(),
    supabase
      .from('user_body_info')
      .select('height_cm, weight_kg')
      .eq('user_id', user!.id)
      .maybeSingle(),
    supabase
      .from('user_limitations')
      .select('affected_area, description')
      .eq('user_id', user!.id)
      .order('created_at'),
  ])

  const prefs = prefsResult.data
  const equipment = equipmentResult.data
  const bodyInfo = bodyInfoResult.data
  const limitations = limitationsResult.data ?? []

  const mainGoal = user?.user_metadata?.mainGoal as string | undefined
  const age = user?.user_metadata?.age as number | undefined

  const equipmentItems: string[] = Array.isArray(equipment?.equipment_items)
    ? (equipment.equipment_items as string[]).filter((id) => VALID_EQUIPMENT_IDS.has(id))
    : []

  const limitationAreas: string[] = limitations.map(
    (r: { affected_area: string }) => r.affected_area
  )
  const limitationNotes =
    limitations.length > 0
      ? ((limitations[0] as { affected_area: string; description: string | null }).description ?? '')
      : ''

  return (
    <OnboardingShell>
      <section className="flex flex-col gap-8" aria-labelledby="onboarding-summary-title">
        <OnboardingProgress currentStep={8} totalSteps={8} />

        <OnboardingPageHeader
          titleKey="onboardingSummaryTitle"
          subtitleKey="onboardingSummarySubtitle"
          headingId="onboarding-summary-title"
        />

        <OnboardingSummaryView
          mainGoal={mainGoal}
          experienceLevel={prefs?.experience_level ?? undefined}
          daysPerWeek={prefs?.days_per_week ?? undefined}
          sessionDurationMinutes={prefs?.session_duration_minutes ?? undefined}
          equipmentItems={equipmentItems}
          age={age}
          heightCm={typeof bodyInfo?.height_cm === 'number' ? bodyInfo.height_cm : undefined}
          weightKg={typeof bodyInfo?.weight_kg === 'number' ? bodyInfo.weight_kg : undefined}
          heightUnit={prefs?.height_unit ?? 'cm'}
          weightUnit={prefs?.weight_unit ?? 'kg'}
          limitationAreas={limitationAreas}
          limitationNotes={limitationNotes}
        />

        <OnboardingSummaryActions />
      </section>
    </OnboardingShell>
  )
}
