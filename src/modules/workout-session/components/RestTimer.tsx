'use client'

import { useRestTimer } from '../hooks/use-rest-timer'
import { useTimerStore } from '../stores/timer-store'

const RADIUS = 40
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function RestTimer() {
  const skipRestTimer = useTimerStore((s) => s.skipRestTimer)
  const { remaining, total, isActive } = useRestTimer()

  if (!isActive) return null

  const progress = total > 0 ? remaining / total : 0
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-4 rounded-t-2xl border-t border-gym-border bg-gym-surface px-6 pb-8 pt-6 shadow-xl">
      <div className="h-1 w-12 rounded-full bg-gym-border" />

      <p className="text-sm font-medium text-gym-muted">Rest</p>

      <div className="relative flex items-center justify-center">
        <svg width="100" height="100" className="-rotate-90">
          {/* Track */}
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-gym-border"
          />
          {/* Progress */}
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className="text-orange-500 transition-[stroke-dashoffset] duration-500"
          />
        </svg>
        <span className="absolute text-2xl font-bold tabular-nums">{remaining}</span>
      </div>

      <button
        type="button"
        onClick={skipRestTimer}
        className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-gym-border px-4 text-sm font-semibold"
      >
        Skip Rest
      </button>
    </div>
  )
}
