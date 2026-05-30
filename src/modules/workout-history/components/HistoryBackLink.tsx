'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useI18n } from '@/i18n/client'

export function HistoryBackLink() {
  const { t } = useI18n()
  return (
    <Link
      href="/history"
      className="inline-flex min-h-[44px] items-center gap-1 px-2 text-sm text-gym-muted"
    >
      <ChevronLeft className="h-4 w-4" />
      {t('historyBackLabel')}
    </Link>
  )
}
