'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/client'
import { SessionSummary } from '@/modules/workout-session/components/SessionSummary'
import type { FinishedSession } from '@/modules/workout-session/types'

export default function SummaryPage() {
  const { t } = useI18n()
  const router = useRouter()
  const [session, setSession] = useState<FinishedSession | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('finishedSession')
    if (!raw) {
      router.replace('/workout')
      return
    }
    try {
      setSession(JSON.parse(raw) as FinishedSession)
    } catch {
      router.replace('/workout')
    } finally {
      setChecked(true)
    }
  }, [router])

  if (!checked || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-sm text-gym-muted">{t('loading')}</span>
      </div>
    )
  }

  return <SessionSummary session={session} />
}
