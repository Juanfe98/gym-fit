'use client'

import { useEffect, useState, useCallback } from 'react'
import { useI18n } from '@/i18n/client'
import { useTimerStore } from '../stores/timer-store'

export function useRestTimer() {
  const { t } = useI18n()
  const restTimer = useTimerStore((s) => s.restTimer)
  const skipRestTimer = useTimerStore((s) => s.skipRestTimer)
  const [remaining, setRemaining] = useState(0)

  const computeRemaining = useCallback(() => {
    if (!restTimer) return 0
    const elapsed = (Date.now() - restTimer.startedAt) / 1000
    return Math.max(0, Math.ceil(restTimer.durationSeconds - elapsed))
  }, [restTimer])

  useEffect(() => {
    if (!restTimer) {
      setRemaining(0)
      return
    }

    let fired = false

    const fireNotification = () => {
      if (typeof Notification === 'undefined') return
      if (Notification.permission === 'granted') {
        new Notification(t('restCompleteTitle'), { body: t('restCompleteBody') })
      } else if (Notification.permission !== 'denied') {
        void Notification.requestPermission().then((p) => {
          if (p === 'granted') new Notification(t('restCompleteTitle'), { body: t('restCompleteBody') })
        })
      }
    }

    const tick = () => {
      const r = computeRemaining()
      setRemaining(r)
      if (r === 0 && !fired) {
        fired = true
        fireNotification()
        skipRestTimer()
      }
    }

    tick()
    const id = setInterval(tick, 500)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') tick()
    }
    const handleFocus = () => tick()

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [restTimer, computeRemaining, skipRestTimer, t])

  return {
    remaining,
    total: restTimer?.durationSeconds ?? 0,
    isActive: restTimer !== null,
  }
}
