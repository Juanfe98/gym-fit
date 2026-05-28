'use client'

import { useI18n } from '@/i18n/client'

interface CancelSessionDialogProps {
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function CancelSessionDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: CancelSessionDialogProps) {
  const { t } = useI18n()
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-8">
      <div className="w-full max-w-sm rounded-2xl border border-gym-border bg-gym-surface p-6">
        <h2 className="mb-2 text-base font-semibold">{title}</h2>
        <p className="mb-6 text-sm text-gym-muted">{message}</p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-red-500 font-semibold text-white"
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex min-h-[44px] w-full items-center justify-center rounded-lg border border-gym-border text-sm"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
