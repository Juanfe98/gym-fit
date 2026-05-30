'use client'

import { Leaf } from 'lucide-react'
import { useI18n } from '@/i18n/client'

interface Props {
  count?: number
}

export function RestDayCard({ count = 1 }: Props) {
  const { t } = useI18n()

  const label = count > 1 ? `${count}× ${t('planOverviewRestDay')}` : t('planOverviewRestDay')

  return (
    <div className="card flex items-center gap-4 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gym-surface-2 text-gym-muted">
        <Leaf className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-gym-text">{label}</span>
        <span className="text-xs text-gym-muted">{t('planOverviewRestDayMessage')}</span>
        <span className="text-xs text-gym-muted/60">{t('planOverviewRestDaySuggestion')}</span>
      </div>
    </div>
  )
}
