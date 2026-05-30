'use client'

import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { EQUIPMENT_OPTIONS, BODY_AREA_OPTIONS } from '../types'
import type { UI } from '@/i18n/ui'

const EQUIPMENT_KEY_MAP = Object.fromEntries(
  EQUIPMENT_OPTIONS.map((o) => [o.id, o.labelKey])
) as Record<string, keyof typeof UI.en>

const AREA_KEY_MAP = Object.fromEntries(
  BODY_AREA_OPTIONS.map((o) => [o.id, o.labelKey])
) as Record<string, keyof typeof UI.en>

const GOAL_I18N_KEYS: Record<string, keyof typeof UI.en> = {
  'build-muscle': 'onboardingGoalBuildMuscle',
  'lose-fat': 'onboardingGoalLoseFat',
  'gain-strength': 'onboardingGoalGainStrength',
  'improve-endurance': 'onboardingGoalImproveEndurance',
  'general-fitness': 'onboardingGoalGeneralFitness',
  'improve-mobility': 'onboardingGoalImproveMobility',
  'maintain-current-shape': 'onboardingGoalMaintainCurrentShape',
}

const EXPERIENCE_I18N_KEYS: Record<string, keyof typeof UI.en> = {
  beginner: 'onboardingExperienceBeginner',
  intermediate: 'onboardingExperienceIntermediate',
  advanced: 'onboardingExperienceAdvanced',
}

function formatHeight(cm: number, unit: string): string {
  if (unit === 'in') {
    const totalInches = cm / 2.54
    const ft = Math.floor(totalInches / 12)
    const inches = Math.round(totalInches % 12)
    return `${ft}ft ${inches}in`
  }
  return `${Math.round(cm)} cm`
}

function formatWeight(kg: number, unit: string): string {
  if (unit === 'lb') return `${Math.round(kg / 0.453592)} lb`
  return `${Math.round(kg)} kg`
}

type SummaryCardProps = {
  title: string
  editHref: string
  editLabel: string
  children: React.ReactNode
}

function SummaryCard({ title, editHref, editLabel, children }: SummaryCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gym-border bg-gym-surface-2/85 px-5 py-4">
      <div className="flex items-center justify-between gap-4">
        <span className="font-heading text-sm font-semibold uppercase tracking-wide text-gym-muted">
          {title}
        </span>
        <Link
          href={editHref}
          aria-label={`${editLabel} ${title}`}
          className="focus-ring flex items-center gap-1.5 rounded-lg px-2 py-1 font-heading text-xs font-semibold uppercase tracking-wide text-orange-400 transition-colors duration-150 hover:text-orange-300"
        >
          <Pencil className="h-3 w-3" aria-hidden="true" />
          {editLabel}
        </Link>
      </div>
      <div className="font-heading text-base font-semibold text-gym-text">{children}</div>
    </div>
  )
}

export type OnboardingSummaryViewProps = {
  mainGoal: string | undefined
  experienceLevel: string | undefined
  daysPerWeek: number | undefined
  sessionDurationMinutes: number | undefined
  equipmentItems: string[]
  age: number | undefined
  heightCm: number | undefined
  weightKg: number | undefined
  heightUnit: string
  weightUnit: string
  limitationAreas: string[]
  limitationNotes: string
}

export function OnboardingSummaryView({
  mainGoal,
  experienceLevel,
  daysPerWeek,
  sessionDurationMinutes,
  equipmentItems,
  age,
  heightCm,
  weightKg,
  heightUnit,
  weightUnit,
  limitationAreas,
  limitationNotes,
}: OnboardingSummaryViewProps) {
  const { t } = useI18n()
  const notProvided = t('onboardingSummaryNotProvided')
  const editLabel = t('onboardingSummaryEdit')

  const hasBodyInfo = age !== undefined || heightCm !== undefined || weightKg !== undefined
  const hasLimitations = limitationAreas.length > 0

  return (
    <div className="flex flex-col gap-3">
      <SummaryCard title={t('onboardingSummaryCardFitnessGoal')} editHref="/onboarding/goal" editLabel={editLabel}>
        {mainGoal && GOAL_I18N_KEYS[mainGoal] ? t(GOAL_I18N_KEYS[mainGoal]) : notProvided}
      </SummaryCard>

      <SummaryCard title={t('onboardingSummaryCardExperienceLevel')} editHref="/onboarding/experience" editLabel={editLabel}>
        {experienceLevel && EXPERIENCE_I18N_KEYS[experienceLevel]
          ? t(EXPERIENCE_I18N_KEYS[experienceLevel])
          : notProvided}
      </SummaryCard>

      <SummaryCard title={t('onboardingSummaryCardWorkoutFrequency')} editHref="/onboarding/frequency" editLabel={editLabel}>
        {daysPerWeek
          ? t('onboardingSummaryDaysPerWeek', { days: daysPerWeek })
          : notProvided}
      </SummaryCard>

      <SummaryCard title={t('onboardingSummaryCardSessionDuration')} editHref="/onboarding/time" editLabel={editLabel}>
        {sessionDurationMinutes
          ? t('onboardingSummaryMinutes', { minutes: sessionDurationMinutes })
          : notProvided}
      </SummaryCard>

      <SummaryCard title={t('onboardingSummaryCardEquipment')} editHref="/onboarding/equipment" editLabel={editLabel}>
        {equipmentItems.length > 0
          ? equipmentItems
              .map((id) => EQUIPMENT_KEY_MAP[id] ? t(EQUIPMENT_KEY_MAP[id]) : id)
              .join(', ')
          : notProvided}
      </SummaryCard>

      <SummaryCard title={t('onboardingSummaryCardBodyInfo')} editHref="/onboarding/body-info" editLabel={editLabel}>
        {hasBodyInfo ? (
          <ul className="flex flex-col gap-1">
            {age !== undefined && <li>{t('onboardingSummaryAge')}: {age}</li>}
            {heightCm !== undefined && (
              <li>{t('onboardingSummaryHeight')}: {formatHeight(heightCm, heightUnit)}</li>
            )}
            {weightKg !== undefined && (
              <li>{t('onboardingSummaryWeight')}: {formatWeight(weightKg, weightUnit)}</li>
            )}
          </ul>
        ) : notProvided}
      </SummaryCard>

      <SummaryCard title={t('onboardingSummaryCardLimitations')} editHref="/onboarding/limitations" editLabel={editLabel}>
        {hasLimitations ? (
          <div className="flex flex-col gap-1">
            <span>
              {limitationAreas.map((id) => AREA_KEY_MAP[id] ? t(AREA_KEY_MAP[id]) : id).join(', ')}
            </span>
            {limitationNotes && (
              <span className="text-sm text-gym-muted">{limitationNotes}</span>
            )}
          </div>
        ) : notProvided}
      </SummaryCard>
    </div>
  )
}
