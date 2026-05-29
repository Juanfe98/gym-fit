'use client'

import { useI18n } from '@/i18n/client'

type ProfileErrorProps = {
  onRetry: () => void
}

export function ProfileError({ onRetry }: ProfileErrorProps) {
  const { t } = useI18n()
  return (
    <div className="card-elevated flex flex-col items-center gap-4 p-6 mx-4 mt-6" role="alert">
      <p className="text-sm text-gym-muted text-center">{t('profileErrorTitle')}</p>
      <button
        type="button"
        onClick={onRetry}
        className="min-h-[44px] min-w-[44px] rounded-lg bg-gym-accent px-4 py-2 text-sm font-semibold text-white active:opacity-80"
      >
        {t('profileErrorRetry')}
      </button>
    </div>
  )
}
