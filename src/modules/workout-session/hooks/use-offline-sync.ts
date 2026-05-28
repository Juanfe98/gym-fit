'use client'

import { useEffect } from 'react'
import { useOfflineQueueStore } from '../stores/offline-queue-store'

export function useOfflineSync() {
  const setOnline = useOfflineQueueStore((s) => s.setOnline)
  const drainQueue = useOfflineQueueStore((s) => s.drainQueue)

  useEffect(() => {
    setOnline(navigator.onLine)

    const handleOnline = () => {
      setOnline(true)
      void drainQueue()
    }
    const handleOffline = () => setOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
