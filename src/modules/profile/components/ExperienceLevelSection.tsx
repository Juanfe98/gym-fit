'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/client'
import { SectionCard } from './SectionCard'
import { EXPERIENCE_LEVEL_KEYS } from '../utils/format-enums'
import type { ExperienceLevel } from '../types'

type ExperienceLevelSectionProps = {
  level: ExperienceLevel | null
}

function toPascalCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function ExperienceLevelSection({ level }: ExperienceLevelSectionProps) {
  const { t } = useI18n()
  return (
    <SectionCard title={t('profileLevelTitle')}>
      {level ? (
        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold text-gym-text">
            {t(EXPERIENCE_LEVEL_KEYS[level] as keyof typeof import('@/i18n/ui').UI.en)}
          </p>
          <p className="text-sm text-gym-muted">
            {t((`levelExplain${toPascalCase(level)}`) as keyof typeof import('@/i18n/ui').UI.en)}
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
          <p className="text-base font-semibold text-gym-text">{t('profileLevelEmptyTitle')}</p>
          <p className="text-sm text-gym-muted">{t('profileLevelEmptyBody')}</p>
          <Link
            href="/profile/preferences"
            className="mt-1 self-start min-h-[44px] flex items-center rounded-lg bg-gym-accent px-3 text-sm font-semibold text-white active:opacity-80"
          >
            {t('profileLevelEmptyCta')}
          </Link>
        </div>
      )}
    </SectionCard>
  )
}
