import { create } from 'zustand'
import { db } from '@/lib/offline-db'
import type { OfflineQueueItem } from '@/lib/offline-db'
import { upsertSetLog, deleteSetLog } from '../services/session-supabase'

interface OfflineQueueState {
  isOnline: boolean
  syncStatus: 'idle' | 'syncing' | 'error'
  pendingCount: number
  setOnline: (online: boolean) => void
  enqueue: (item: Omit<OfflineQueueItem, 'id' | 'createdAt' | 'attempts'>) => Promise<void>
  drainQueue: () => Promise<void>
}

export const useOfflineQueueStore = create<OfflineQueueState>((set, get) => ({
  isOnline: true,
  syncStatus: 'idle',
  pendingCount: 0,

  setOnline: (online) => set({ isOnline: online }),

  enqueue: async (item) => {
    await db.offlineQueue.add({ ...item, createdAt: Date.now(), attempts: 0 })
    set((state) => ({ pendingCount: state.pendingCount + 1 }))
  },

  drainQueue: async () => {
    if (get().syncStatus === 'syncing') return

    set({ syncStatus: 'syncing' })

    const items = await db.offlineQueue.orderBy('createdAt').toArray()
    let hasError = false

    for (const item of items) {
      try {
        let success = false

        if (item.table === 'set_logs' && item.operation === 'upsert') {
          const result = await upsertSetLog(
            item.payload as Parameters<typeof upsertSetLog>[0],
          )
          success = result.success
        } else if (item.table === 'set_logs' && item.operation === 'delete') {
          const result = await deleteSetLog(item.payload.id as string)
          success = result.success
        } else {
          await db.offlineQueue.delete(item.id!)
          continue
        }

        if (success) {
          await db.offlineQueue.delete(item.id!)
          if (item.operation === 'upsert') {
            await db.setLogs.update(item.payload.id as string, { syncStatus: 'synced' })
          }
        } else {
          const newAttempts = item.attempts + 1
          await db.offlineQueue.update(item.id!, {
            attempts: newAttempts,
            lastAttemptAt: Date.now(),
          })
          if (newAttempts >= 3) {
            if (item.operation === 'upsert') {
              await db.setLogs.update(item.payload.id as string, { syncStatus: 'sync_failed' })
            }
            await db.offlineQueue.delete(item.id!)
          }
          hasError = true
        }
      } catch {
        const newAttempts = item.attempts + 1
        await db.offlineQueue.update(item.id!, {
          attempts: newAttempts,
          lastAttemptAt: Date.now(),
        })
        hasError = true
      }
    }

    const remaining = await db.offlineQueue.count()
    set({ pendingCount: remaining, syncStatus: hasError ? 'error' : 'idle' })
  },
}))
