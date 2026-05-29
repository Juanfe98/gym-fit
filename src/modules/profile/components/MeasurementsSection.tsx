'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/client'
import { SectionCard } from './SectionCard'
import type { BodyMeasurementEntry, WeightUnit } from '../types'

type MeasurementsSectionProps = {
  latestMeasurement: BodyMeasurementEntry | null
  weightUnit: WeightUnit
}

function formatMeasuredAt(dateStr: string): string {
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(
    new Date(dateStr)
  )
}

export function MeasurementsSection({ latestMeasurement, weightUnit }: MeasurementsSectionProps) {
  const { t } = useI18n()

  return (
    <SectionCard title={t('profileMeasurementsTitle')}>
      {latestMeasurement ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gym-muted">
            {t('measurementsLatest', { date: formatMeasuredAt(latestMeasurement.measuredAt) })}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gym-text">
            {latestMeasurement.weightKg !== null && (
              <span>
                {weightUnit === 'lb'
                  ? `${(latestMeasurement.weightKg * 2.20462).toFixed(1)} lb`
                  : `${latestMeasurement.weightKg} kg`}
              </span>
            )}
            {latestMeasurement.waistCm !== null && (
              <span>Waist: {latestMeasurement.waistCm} cm</span>
            )}
            {latestMeasurement.chestCm !== null && (
              <span>Chest: {latestMeasurement.chestCm} cm</span>
            )}
            {latestMeasurement.bodyFatPct !== null && (
              <span>{latestMeasurement.bodyFatPct}% body fat</span>
            )}
          </div>

          <div className="flex gap-3 mt-1">
            <Link
              href="/profile/measurements"
              className="min-h-[44px] flex items-center text-sm text-gym-accent active:opacity-70"
            >
              {t('measurementsViewHistory')}
            </Link>
            <Link
              href="/profile/measurements/new"
              className="min-h-[44px] flex items-center text-sm text-gym-accent active:opacity-70"
            >
              {t('measurementsAddEntry')}
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold text-gym-text">{t('profileMeasurementsEmptyTitle')}</p>
          <p className="text-sm text-gym-muted">{t('profileMeasurementsEmptyBody')}</p>
          <Link
            href="/profile/measurements/new"
            className="mt-1 self-start min-h-[44px] flex items-center rounded-lg bg-gym-accent px-3 text-sm font-semibold text-white active:opacity-80"
          >
            {t('profileMeasurementsEmptyCta')}
          </Link>
        </div>
      )}
    </SectionCard>
  )
}
