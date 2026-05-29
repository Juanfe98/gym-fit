'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/client'
import { SectionCard } from './SectionCard'
import type { HeightUnit, WeightUnit } from '../types'

type BodyInfoSectionProps = {
  heightCm: number | null
  weightKg: number | null
  heightUnit: HeightUnit
  weightUnit: WeightUnit
}

function formatHeight(heightCm: number, unit: HeightUnit): string {
  if (unit === 'in') {
    const totalInches = heightCm / 2.54
    const feet = Math.floor(totalInches / 12)
    const inches = Math.round(totalInches % 12)
    return `${feet}'${inches}"`
  }
  return `${heightCm} cm`
}

function formatWeight(weightKg: number, unit: WeightUnit): string {
  if (unit === 'lb') {
    return `${(weightKg * 2.20462).toFixed(1)} lb`
  }
  return `${weightKg} kg`
}

export function BodyInfoSection({ heightCm, weightKg, heightUnit, weightUnit }: BodyInfoSectionProps) {
  const { t } = useI18n()
  const hasData = heightCm !== null || weightKg !== null

  return (
    <SectionCard title={t('profileBodyInfoTitle')}>
      {hasData ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gym-text">
            {[
              heightCm !== null ? formatHeight(heightCm, heightUnit) : null,
              weightKg !== null ? formatWeight(weightKg, weightUnit) : null,
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>
          <Link
            href="/profile/body"
            className="mt-1 self-start min-h-[44px] flex items-center text-sm text-gym-accent active:opacity-70"
          >
            {t('profileEditPersonalInfo')}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold text-gym-text">{t('profileBodyInfoEmptyTitle')}</p>
          <p className="text-sm text-gym-muted">{t('profileBodyInfoEmptyBody')}</p>
          <Link
            href="/profile/body"
            className="mt-1 self-start min-h-[44px] flex items-center rounded-lg bg-gym-accent px-3 text-sm font-semibold text-white active:opacity-80"
          >
            {t('profileBodyInfoEmptyCta')}
          </Link>
        </div>
      )}
    </SectionCard>
  )
}
