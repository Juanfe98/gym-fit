'use client'

import { useI18n } from '@/i18n/client'
import { useOfflineQueueStore } from '../stores/offline-queue-store'

export function SyncStatusBar() {
  const { t } = useI18n()
  const syncStatus = useOfflineQueueStore((s) => s.syncStatus)
  const isOnline = useOfflineQueueStore((s) => s.isOnline)

  if (syncStatus === 'idle' && isOnline) return null

  if (!isOnline || syncStatus === 'syncing') {
    return (
      <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
        {t('saving')}
      </div>
    )
  }

  if (syncStatus === 'error') {
    return (
      <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1.5 text-xs text-red-400">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        {t('syncFailed')}
      </div>
    )
  }

  return null
}
