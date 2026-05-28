import { create } from 'zustand'

interface RestTimerState {
  durationSeconds: number
  startedAt: number
  isPaused: boolean
  pausedAt?: number
}

interface TimerState {
  elapsedSeconds: number
  restTimer: RestTimerState | null
  _intervalId: ReturnType<typeof setInterval> | null
  startSessionTimer: () => void
  stopSessionTimer: () => void
  pauseSessionTimer: () => void
  resumeSessionTimer: () => void
  startRestTimer: (durationSeconds: number) => void
  skipRestTimer: () => void
  clearRestTimer: () => void
}

export const useTimerStore = create<TimerState>((set, get) => ({
  elapsedSeconds: 0,
  restTimer: null,
  _intervalId: null,

  startSessionTimer: () => {
    const existing = get()._intervalId
    if (existing) clearInterval(existing)
    const id = setInterval(() => {
      set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 }))
    }, 1000)
    set({ _intervalId: id })
  },

  stopSessionTimer: () => {
    const { _intervalId } = get()
    if (_intervalId) clearInterval(_intervalId)
    set({ _intervalId: null, elapsedSeconds: 0 })
  },

  pauseSessionTimer: () => {
    const { _intervalId } = get()
    if (_intervalId) clearInterval(_intervalId)
    set({ _intervalId: null })
  },

  resumeSessionTimer: () => {
    const existing = get()._intervalId
    if (existing) return
    const id = setInterval(() => {
      set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 }))
    }, 1000)
    set({ _intervalId: id })
  },

  startRestTimer: (durationSeconds) => {
    set({
      restTimer: {
        durationSeconds,
        startedAt: Date.now(),
        isPaused: false,
      },
    })
  },

  skipRestTimer: () => set({ restTimer: null }),

  clearRestTimer: () => set({ restTimer: null }),
}))
