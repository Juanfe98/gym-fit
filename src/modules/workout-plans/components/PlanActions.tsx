'use client'

import { useState } from 'react'
import { useI18n } from '@/i18n/client'

interface PlanActionsProps {
  onDuplicate: () => void
  onArchive: () => void
  isDuplicating: boolean
  isArchiving: boolean
}

export function PlanActions({ onDuplicate, onArchive, isDuplicating, isArchiving }: PlanActionsProps) {
  const { t } = useI18n()
  const [confirmArchive, setConfirmArchive] = useState(false)

  return (
    <div className="flex flex-col gap-2 px-4 pb-2">
      <button
        onClick={onDuplicate}
        disabled={isDuplicating}
        className="h-11 w-full rounded-lg border border-gym-border text-gym-text font-medium disabled:opacity-50"
      >
        {isDuplicating ? 'Duplicating…' : t('duplicatePlan')}
      </button>

      {!confirmArchive ? (
        <button
          onClick={() => setConfirmArchive(true)}
          className="h-11 w-full rounded-lg border border-red-400 text-red-400 font-medium"
        >
          {t('archivePlan')}
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => {
              onArchive()
              setConfirmArchive(false)
            }}
            disabled={isArchiving}
            className="flex-1 h-11 rounded-lg bg-red-500 text-white font-medium disabled:opacity-50"
          >
            Confirm archive
          </button>
          <button
            onClick={() => setConfirmArchive(false)}
            className="flex-1 h-11 rounded-lg border border-gym-border text-gym-text font-medium"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
