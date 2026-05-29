'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/client'
import { SectionCard } from './SectionCard'
import { FITNESS_GOAL_KEYS } from '../utils/format-enums'
import type { FitnessGoal } from '../types'

type GoalSectionProps = {
  goal: FitnessGoal | null
}

function toPascalCase(s: string) {
  return s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()).replace(/^[a-z]/, (c) => c.toUpperCase())
}

export function GoalSection({ goal }: GoalSectionProps) {
  const { t } = useI18n()
  return (
    <SectionCard title={t('profileGoalTitle')}>
      {goal ? (
        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold text-gym-text">
            {t(FITNESS_GOAL_KEYS[goal] as keyof typeof import('@/i18n/ui').UI.en)}
          </p>
          <p className="text-sm text-gym-muted">
            {t((`goalExplain${toPascalCase(goal)}`) as keyof typeof import('@/i18n/ui').UI.en)}
          </p>
          <Link
            href="/profile/preferences"
            className="mt-1 self-start min-h-[44px] flex items-center text-sm text-gym-accent active:opacity-70"
          >
            {t('profileEditPersonalInfo')}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold text-gym-text">{t('profileGoalEmptyTitle')}</p>
          <p className="text-sm text-gym-muted">{t('profileGoalEmptyBody')}</p>
          <Link
            href="/profile/preferences"
            className="mt-1 self-start min-h-[44px] flex items-center rounded-lg bg-gym-accent px-3 text-sm font-semibold text-white active:opacity-80"
          >
            {t('profileGoalEmptyCta')}
          </Link>
        </div>
      )}
    </SectionCard>
  )
}
