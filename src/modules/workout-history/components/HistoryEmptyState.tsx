'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/client'

interface HistoryEmptyStateProps {
  variant: 'no-history' | 'filtered'
  onClearFilter?: () => void
}

export function HistoryEmptyState({ variant, onClearFilter }: HistoryEmptyStateProps) {
  const { t } = useI18n()

  if (variant === 'filtered') {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-sm text-gym-muted">{t('historyFilterEmpty')}</p>
        {onClearFilter && (
          <button
            type="button"
            onClick={onClearFilter}
            className="min-h-[44px] rounded border border-gym-border px-6 text-sm"
          >
            {t('historyClearFilter')}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-sm text-gym-muted">{t('historyEmpty')}</p>
      <Link
        href="/workout"
        className="inline-flex min-h-[44px] items-center rounded bg-orange-500 px-6 text-sm font-semibold text-white"
      >
        {t('historyEmptyCtaStart')}
      </Link>
    </div>
  )
}
