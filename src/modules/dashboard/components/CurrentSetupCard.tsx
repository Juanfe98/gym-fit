'use client'

import Link from 'next/link'
import { Settings2 } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { SectionLabel } from '@/components/ui'
import type { DashboardSetupData } from '../types'

type Props = { setup: DashboardSetupData }

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

function SetupRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gym-border-subtle py-2.5 last:border-0">
      <span className="shrink-0 text-xs text-gym-muted">{label}</span>
      <span className="text-right text-xs font-medium text-gym-text">{value}</span>
    </div>
  )
}

export function CurrentSetupCard({ setup }: Props) {
  const { t } = useI18n()

  const goalLabel = setup.mainGoal
    ? t(GOAL_KEYS[setup.mainGoal] ?? setup.mainGoal)
    : undefined

  const levelLabel = setup.experienceLevel
    ? t(LEVEL_KEYS[setup.experienceLevel] ?? setup.experienceLevel)
    : undefined

  const frequencyLabel = setup.daysPerWeek
    ? t('availabilityDaysPerWeek', { days: setup.daysPerWeek })
    : undefined

  const durationLabel = setup.sessionDurationMinutes
    ? t('dashboardMinutes', { count: setup.sessionDurationMinutes })
    : undefined

  const equipmentLabel =
    setup.equipmentItems.length > 0
      ? setup.equipmentItems
          .slice(0, 3)
          .map(id => t(EQUIPMENT_KEYS[id] ?? id))
          .join(', ') +
        (setup.equipmentItems.length > 3
          ? ` +${setup.equipmentItems.length - 3}`
          : '')
      : undefined

  return (
    <section aria-label={t('dashboardSetupTitle')}>
      <SectionLabel className="mb-3">{t('dashboardSetupTitle')}</SectionLabel>
      <div className="card p-4">
        <div className="flex flex-col">
          <SetupRow label={t('dashboardSetupGoal')} value={goalLabel} />
          <SetupRow label={t('dashboardSetupLevel')} value={levelLabel} />
          <SetupRow label={t('dashboardSetupFrequency')} value={frequencyLabel} />
          <SetupRow label={t('dashboardSetupDuration')} value={durationLabel} />
          <SetupRow label={t('dashboardSetupEquipment')} value={equipmentLabel} />
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
