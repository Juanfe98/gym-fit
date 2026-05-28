'use client'

import { useState, useEffect } from 'react'
import { Trophy } from 'lucide-react'
import { useI18n } from '@/i18n/client'

interface PrBadgeProps {
  isNew?: boolean
}

export function PrBadge({ isNew = false }: PrBadgeProps) {
  const { t } = useI18n()
  const [toastVisible, setToastVisible] = useState(false)

  useEffect(() => {
    if (!isNew) return
    setToastVisible(true)
    const id = setTimeout(() => setToastVisible(false), 3000)
    return () => clearTimeout(id)
  }, [isNew])

  return (
    <>
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">
        <Trophy className="h-3 w-3" />
        {t('personalRecordAbbr')}
      </span>
      {toastVisible && (
        <div className="fixed left-4 right-4 top-16 z-50 flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          <Trophy className="h-4 w-4" />
          {t('newPersonalRecord')}
        </div>
      )}
    </>
  )
}
