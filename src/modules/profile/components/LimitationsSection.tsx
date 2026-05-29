'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/client'
import { SectionCard } from './SectionCard'
import type { PhysicalLimitation } from '../types'

type LimitationsSectionProps = {
  limitations: PhysicalLimitation[]
}

export function LimitationsSection({ limitations }: LimitationsSectionProps) {
  const { t } = useI18n()

  return (
    <SectionCard title={t('profileLimitationsTitle')}>
      {limitations.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gym-text">
            {t('limitationsCount', { count: limitations.length })}
          </p>
          <p className="text-sm text-gym-muted">
            {limitations
              .slice(0, 3)
              .map((l) => l.affectedArea)
              .join(' · ')}
          </p>
          <Link
            href="/profile/limitations"
            className="mt-1 self-start min-h-[44px] flex items-center text-sm text-gym-accent active:opacity-70"
          >
            {t('profileEditPersonalInfo')}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold text-gym-text">{t('profileLimitationsEmptyTitle')}</p>
          <p className="text-sm text-gym-muted">{t('profileLimitationsEmptyBody')}</p>
          <Link
            href="/profile/limitations"
            className="mt-1 self-start min-h-[44px] flex items-center rounded-lg bg-gym-accent px-3 text-sm font-semibold text-white active:opacity-80"
          >
            {t('profileLimitationsEmptyCta')}
          </Link>
        </div>
      )}
    </SectionCard>
  )
}
