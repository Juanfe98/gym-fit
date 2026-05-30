'use client'

import Link from 'next/link'
import { Settings2 } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { SectionLabel } from '@/components/ui'
import type { UserPrefs } from '../hooks/use-plan-overview'

const GOAL_KEYS: Record<string, string> = {
  'build-muscle': 'goalBuildMuscle',
  'lose-fat': 'goalLoseFat',
  'increase-strength': 'goalIncreaseStrength',
  'improve-endurance': 'goalImproveEndurance',
  'general-fitness': 'goalGeneralFitness',
  'improve-mobility': 'onboardingGoalImproveMobility',
  'maintain-current-shape': 'onboardingGoalMaintainCurrentShape',
}

const LEVEL_KEYS: Record<string, string> = {
  beginner: 'levelBeginner',
  intermediate: 'levelIntermediate',
  advanced: 'levelAdvanced',
}

const EQUIPMENT_KEYS: Record<string, string> = {
  'full-gym': 'onboardingEquipmentFullGym',
  dumbbells: 'onboardingEquipmentDumbbells',
  barbell: 'onboardingEquipmentBarbell',
  machines: 'onboardingEquipmentMachines',
  'cable-machine': 'onboardingEquipmentCableMachine',
  'resistance-bands': 'onboardingEquipmentResistanceBands',
  'bodyweight-only': 'onboardingEquipmentBodyweightOnly',
  'cardio-machines': 'onboardingEquipmentCardioMachines',
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gym-border-subtle py-2.5 last:border-0">
      <span className="shrink-0 text-xs text-gym-muted">{label}</span>
      <span className="text-right text-xs font-medium text-gym-text">{value}</span>
    </div>
  )
}

interface Props {
  prefs: UserPrefs | null
  equipment: string[]
}

export function PlanSummaryCard({ prefs, equipment }: Props) {
  const { t } = useI18n()

  const goalLabel = prefs?.fitness_goal
    ? t(GOAL_KEYS[prefs.fitness_goal] ?? prefs.fitness_goal)
    : undefined

  const levelLabel = prefs?.experience_level
    ? t(LEVEL_KEYS[prefs.experience_level] ?? prefs.experience_level)
    : undefined

  const frequencyLabel = prefs?.days_per_week
    ? t('planOverviewSummaryDaysPerWeek', { days: prefs.days_per_week })
    : undefined

  const durationLabel = prefs?.session_duration_minutes
    ? t('planOverviewSummaryMinutes', { count: prefs.session_duration_minutes })
    : undefined

  const equipmentLabel =
    equipment.length > 0
      ? equipment
          .slice(0, 3)
          .map((id) => t(EQUIPMENT_KEYS[id] ?? id))
          .join(', ') + (equipment.length > 3 ? ` +${equipment.length - 3}` : '')
      : undefined

  return (
    <section aria-label={t('planOverviewSummaryTitle')}>
      <SectionLabel className="mb-3">{t('planOverviewSummaryTitle')}</SectionLabel>
      <div className="card p-4">
        <div className="flex flex-col">
          <Row label={t('planOverviewSummaryGoal')} value={goalLabel} />
          <Row label={t('planOverviewSummaryLevel')} value={levelLabel} />
          <Row label={t('planOverviewSummaryFrequency')} value={frequencyLabel} />
          <Row label={t('planOverviewSummaryDuration')} value={durationLabel} />
          <Row label={t('planOverviewSummaryEquipment')} value={equipmentLabel} />
        </div>
        <Link
          href="/profile/preferences"
          className="focus-ring mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gym-accent"
        >
          <Settings2 className="h-3.5 w-3.5" aria-hidden="true" />
          {t('dashboardEditPreferences')}
        </Link>
      </div>
    </section>
  )
}
