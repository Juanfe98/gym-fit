'use client'

import { Play, Pause } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { useTimerStore } from '../stores/timer-store'

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

export function SessionTimer() {
  const { t } = useI18n()
  const elapsedSeconds = useTimerStore((s) => s.elapsedSeconds)
  const pauseSessionTimer = useTimerStore((s) => s.pauseSessionTimer)
  const resumeSessionTimer = useTimerStore((s) => s.resumeSessionTimer)
  const intervalId = useTimerStore((s) => s._intervalId)
  const isPaused = intervalId === null

  function handleToggle() {
    if (isPaused) {
      resumeSessionTimer()
    } else {
      pauseSessionTimer()
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="flex min-h-[44px] min-w-[44px] items-center gap-1 rounded px-2 py-1"
      aria-label={isPaused ? t('resumeTimer') : t('pauseTimer')}
    >
      <span className="font-mono text-lg font-semibold tabular-nums">
        {formatElapsed(elapsedSeconds)}
      </span>
      {isPaused
        ? <Play className="h-3.5 w-3.5 text-gym-muted" />
        : <Pause className="h-3.5 w-3.5 text-gym-muted" />
      }
    </button>
  )
}
