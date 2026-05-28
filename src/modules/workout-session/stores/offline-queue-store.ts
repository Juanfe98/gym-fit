import { create } from 'zustand'

interface OfflineQueueState {
  isOnline: boolean
  syncStatus: 'idle' | 'syncing' | 'error'
  pendingCount: number
  setOnline: (online: boolean) => void
  drainQueue: () => Promise<void>
}

export const useOfflineQueueStore = create<OfflineQueueState>((set) => ({
  isOnline: true,
  syncStatus: 'idle',
  pendingCount: 0,

  setOnline: (online) => set({ isOnline: online }),

  // Implemented in T037 (US2 — offline sync)
  drainQueue: async () => {},
}))
