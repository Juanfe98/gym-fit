'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/client'
import { SectionCard } from './SectionCard'
import { DAY_SHORT_KEYS } from '../utils/format-enums'

type AvailabilitySectionProps = {
  daysPerWeek: number | null
  sessionDurationMinutes: number | null
  preferredDays: string[]
}

export function AvailabilitySection({
  daysPerWeek,
  sessionDurationMinutes,
  preferredDays,
}: AvailabilitySectionProps) {
  const { t } = useI18n()
  const hasData = daysPerWeek !== null || sessionDurationMinutes !== null

  return (
    <SectionCard title={t('profileAvailabilityTitle')}>
      {hasData ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gym-text">
            {[
              daysPerWeek !== null ? t('availabilityDaysPerWeek', { days: daysPerWeek }) : null,
              sessionDurationMinutes !== null
                ? t('availabilityMinPerSession', { min: sessionDurationMinutes })
                : null,
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>

          {preferredDays.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {preferredDays.map((day) => (
                <span
                  key={day}
                  className="rounded-full border border-gym-border px-2 py-0.5 text-xs text-gym-muted"
                >
                  {DAY_SHORT_KEYS[day] ?? day}
                </span>
              ))}
            </div>
          )}

          <Link
            href="/profile/preferences"
            className="mt-1 self-start min-h-[44px] flex items-center text-sm text-gym-accent active:opacity-70"
          >
            {t('profileEditPersonalInfo')}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold text-gym-text">{t('profileAvailabilityEmptyTitle')}</p>
          <p className="text-sm text-gym-muted">{t('profileAvailabilityEmptyBody')}</p>
          <Link
            href="/profile/preferences"
            className="mt-1 self-start min-h-[44px] flex items-center rounded-lg bg-gym-accent px-3 text-sm font-semibold text-white active:opacity-80"
          >
            {t('profileAvailabilityEmptyCta')}
          </Link>
        </div>
      )}
    </SectionCard>
  )
}
