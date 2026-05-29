'use client'

import { useI18n } from '@/i18n/client'
import { PageHeader } from '@/components/ui'
import { HistorySummary } from './HistorySummary'

export function HistoryHeader({ userId }: { userId: string }) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t('historyTitle')} className="px-0 pt-0" />
      <HistorySummary userId={userId} />
    </div>
  )
}
