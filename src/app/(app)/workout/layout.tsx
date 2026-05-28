'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkoutSessionStore } from '@/modules/workout-session/stores/workout-session-store'
import { CancelSessionDialog } from '@/modules/workout-session/components/CancelSessionDialog'

export default function WorkoutLayout({ children }: { children: React.ReactNode }) {
  const session = useWorkoutSessionStore((s) => s.session)
  const discardSession = useWorkoutSessionStore((s) => s.discardSession)
  const router = useRouter()
  const [showDialog, setShowDialog] = useState(false)

  const totalSets = session?.exercises.reduce((n, e) => n + e.sets.length, 0) ?? 0
  const guardActive = !!session && totalSets > 0

  useEffect(() => {
    if (!guardActive) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    // Push a history entry so the back button can be intercepted
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href)
      setShowDialog(true)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [guardActive])

  async function handleConfirmDiscard() {
    await discardSession()
    setShowDialog(false)
    router.push('/')
  }

  return (
    <>
      {children}
      {showDialog && (
        <CancelSessionDialog
          title="Discard workout?"
          message="All logged sets will be lost. This session will not be saved."
          confirmLabel="Discard Workout"
          onConfirm={handleConfirmDiscard}
          onCancel={() => setShowDialog(false)}
        />
      )}
    </>
  )
}
