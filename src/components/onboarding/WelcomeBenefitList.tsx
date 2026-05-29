'use client'

import type { LucideIcon } from 'lucide-react'
import { CalendarCheck, ChartNoAxesColumnIncreasing, SlidersHorizontal } from 'lucide-react'
import { useI18n } from '@/i18n/client'

type WelcomeBenefit = {
  id: string
  titleKey: 'onboardingBenefitPersonalized' | 'onboardingBenefitTrack' | 'onboardingBenefitConsistent'
  descriptionKey: 'onboardingBenefitPersonalizedDescription' | 'onboardingBenefitTrackDescription' | 'onboardingBenefitConsistentDescription'
  Icon: LucideIcon
}

const benefits: WelcomeBenefit[] = [
  {
    id: 'personalized-setup',
    titleKey: 'onboardingBenefitPersonalized',
    descriptionKey: 'onboardingBenefitPersonalizedDescription',
    Icon: SlidersHorizontal,
  },
  {
    id: 'track-progress',
    titleKey: 'onboardingBenefitTrack',
    descriptionKey: 'onboardingBenefitTrackDescription',
    Icon: ChartNoAxesColumnIncreasing,
  },
  {
    id: 'stay-consistent',
    titleKey: 'onboardingBenefitConsistent',
    descriptionKey: 'onboardingBenefitConsistentDescription',
    Icon: CalendarCheck,
  },
]

export function WelcomeBenefitList() {
  const { t } = useI18n()

  return (
    <ul className="grid gap-3" aria-label={t('onboardingBenefitsAria')}>
      {benefits.map(({ id, titleKey, descriptionKey, Icon }) => (
        <li
          key={id}
          className="flex gap-3 rounded-lg border border-gym-border bg-gym-surface-2/80 p-4"
        >
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gym-accent-subtle text-orange-400"
            aria-hidden="true"
          >
            <Icon className="h-5 w-5" />
          </span>
          <span className="flex min-w-0 flex-col gap-1">
            <span className="font-heading text-lg font-semibold uppercase tracking-wide text-gym-text">
              {t(titleKey)}
            </span>
            <span className="text-sm leading-6 text-gym-muted">{t(descriptionKey)}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
