'use client'

import { useState } from 'react'
import { useI18n } from '@/i18n/client'
import { useWorkoutSessionStore } from '@/modules/workout-session/stores/workout-session-store'

interface AddToSessionButtonProps {
  exerciseId: string
  exerciseName: string
}

export function AddToSessionButton({ exerciseId, exerciseName }: AddToSessionButtonProps) {
  const { t } = useI18n()
  const session = useWorkoutSessionStore((s) => s.session)
  const addExercise = useWorkoutSessionStore((s) => s.addExercise)
  const [toastVisible, setToastVisible] = useState(false)

  if (!session) return null

  function handleAdd() {
    addExercise({ exerciseId, exerciseNameSnapshot: exerciseName })
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2000)
  }

  return (
    <>
      <button
        disabled={toastVisible}
        onClick={handleAdd}
        className="glow-accent h-11 w-full rounded-lg bg-gym-accent font-semibold text-white disabled:opacity-50"
      >
        {t('addToSession')}
      </button>
      {toastVisible && (
        <div
          role="status"
          className="fixed bottom-16 left-0 right-0 mx-4 py-2 text-center text-sm font-medium text-white bg-gym-accent rounded-lg"
        >
          {t('addedToSession')}
        </div>
      )}
    </>
  )
}
