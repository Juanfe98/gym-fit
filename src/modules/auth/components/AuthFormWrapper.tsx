'use client'

import { Dumbbell } from 'lucide-react'
import { useI18n } from '@/i18n/client'

export function AuthFormWrapper({ children }: { children: React.ReactNode }) {
  const { t } = useI18n()

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gym-accent glow-accent">
            <Dumbbell className="h-8 w-8 text-white" strokeWidth={2} />
          </div>
          <div className="flex flex-col items-center gap-1">
            <h1 className="heading text-3xl tracking-wide text-gym-text">Gym Planner</h1>
            <p className="text-sm text-gym-muted">{t('loginTagline')}</p>
          </div>
        </div>
        {children}
      </div>
    </main>
  )
}
