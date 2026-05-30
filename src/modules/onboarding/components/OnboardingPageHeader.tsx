'use client'

import { useI18n } from '@/i18n/client'
import type { UI } from '@/i18n/ui'
import type { ReactNode } from 'react'

type OnboardingPageHeaderProps = {
  titleKey: keyof typeof UI.en
  subtitleKey: keyof typeof UI.en
  headingId: string
  children?: ReactNode
}

export function OnboardingPageHeader({
  titleKey,
  subtitleKey,
  headingId,
  children,
}: OnboardingPageHeaderProps) {
  const { t } = useI18n()
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      {children}
      <h1
        id={headingId}
        className="font-heading text-4xl font-semibold uppercase leading-tight tracking-tight text-gym-text sm:text-5xl lg:text-6xl"
      >
        {t(titleKey)}
      </h1>
      <p className="max-w-2xl text-base leading-7 text-gym-muted sm:text-lg sm:leading-8">
        {t(subtitleKey)}
      </p>
    </div>
  )
}
