'use client'

import { Heart } from 'lucide-react'
import { useI18n } from '@/i18n/client'

interface FavoriteButtonProps {
  exerciseId: string
  isFavorite: boolean
  onToggle: () => void
  error?: string | null
}

export function FavoriteButton({ isFavorite, onToggle, error }: FavoriteButtonProps) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onToggle}
        aria-label={isFavorite ? t('favoriteRemove') : t('favoriteAdd')}
        className="flex items-center justify-center min-h-[44px] min-w-[44px]"
      >
        <Heart
          className={`h-6 w-6 ${isFavorite ? 'text-gym-accent' : 'text-gym-muted'}`}
          fill={isFavorite ? 'currentColor' : 'none'}
        />
      </button>
      {error && (
        <p role="alert" className="text-xs text-red-400 mt-1">
          {t('favoriteSyncError')}
        </p>
      )}
    </div>
  )
}
