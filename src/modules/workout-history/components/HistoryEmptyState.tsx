'use client'

import Link from 'next/link'
import { History, SearchX } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { EmptyState } from '@/components/ui'

interface HistoryEmptyStateProps {
  variant: 'no-history' | 'filtered'
  onClearFilter?: () => void
}

export function HistoryEmptyState({ variant, onClearFilter }: HistoryEmptyStateProps) {
  const { t } = useI18n()

  if (variant === 'filtered') {
    return (
      <EmptyState
        Icon={SearchX}
        title={t('historyFilterEmpty')}
        action={
          onClearFilter && (
            <button
              type="button"
              onClick={onClearFilter}
              className="min-h-[44px] rounded-lg border border-gym-border px-6 text-sm font-medium text-gym-text"
            >
              {t('historyClearFilter')}
            </button>
          )
        }
      />
    )
  }

  return (
    <EmptyState
      Icon={History}
      title={t('historyEmpty')}
      action={
        <Link
          href="/workout"
          className="glow-accent inline-flex min-h-[44px] items-center rounded-lg bg-gym-accent px-6 text-sm font-semibold text-white"
        >
          {t('historyEmptyCtaStart')}
        </Link>
      }
    />
  )
}
