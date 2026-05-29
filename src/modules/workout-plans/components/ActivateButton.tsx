'use client'

import { useI18n } from '@/i18n/client'

interface ActivateButtonProps {
  isActive: boolean
  hasValidStructure: boolean
  onActivate: () => void
  onDeactivate: () => void
  activationError?: string | null
  isLoading: boolean
}

export function ActivateButton({
  isActive,
  hasValidStructure,
  onActivate,
  onDeactivate,
  activationError,
  isLoading,
}: ActivateButtonProps) {
  const { t } = useI18n()

  if (isActive) {
    return (
      <button
        onClick={onDeactivate}
        disabled={isLoading}
        className="h-11 w-full rounded-lg border border-gym-border text-gym-muted font-semibold disabled:opacity-50"
      >
        {t('deactivatePlan')}
      </button>
    )
  }

  if (hasValidStructure) {
    return (
      <button
        onClick={onActivate}
        disabled={isLoading}
        className="glow-accent h-11 w-full rounded-lg bg-gym-accent font-semibold text-white disabled:opacity-50"
      >
        {t('activatePlan')}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        disabled
        className="h-11 w-full rounded-lg bg-gym-accent font-semibold text-white opacity-40 cursor-not-allowed"
      >
        {t('activatePlan')}
      </button>
      {activationError && (
        <p role="alert" className="text-xs text-red-400 mt-1">
          {activationError}
        </p>
      )}
    </div>
  )
}
