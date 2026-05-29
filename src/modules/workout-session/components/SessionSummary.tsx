'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trophy } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { getLocalizedExerciseName } from '@/i18n/exercise-names'
import { syncCompletedSession } from '../services/session-supabase'
import { finishedSessionToPayload } from '../utils/session-payload'
import { useVolumeFormat } from '../hooks/use-volume-format'
import type { FinishedSession } from '../types'

interface SessionSummaryProps {
  session: FinishedSession
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function SessionSummary({ session: initialSession }: SessionSummaryProps) {
  const { lang, t } = useI18n()
  const { unit, formatVolume } = useVolumeFormat()
  const router = useRouter()
  const [notes, setNotes] = useState(initialSession.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const session = { ...initialSession, notes }

  async function handleSave() {
    setSaving(true)
    setError(null)
    const result = await syncCompletedSession(finishedSessionToPayload(session))
    if (!result.success) {
      setError(result.error ?? t('syncFailed'))
      setSaving(false)
      return
    }
    sessionStorage.removeItem('finishedSession')
    router.push('/')
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <h1 className="heading text-3xl text-gym-text">{t('workoutComplete')}</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Stat label={t('duration')} value={formatDuration(initialSession.durationSeconds)} />
        <Stat label={t('volume')} value={`${formatVolume(initialSession.totalVolume)} ${unit}`} />
        <Stat label={t('exercises')} value={String(initialSession.exercises.length)} />
        <Stat label={t('sets')} value={String(initialSession.exercises.reduce((n, e) => n + e.sets.length, 0))} />
        {initialSession.prCount > 0 && (
          <Stat label={t('prs')} value={String(initialSession.prCount)} highlight />
        )}
      </div>

      {/* Per-exercise breakdown */}
      <div className="flex flex-col gap-2">
        {initialSession.exercises.map((ex) => (
          <div key={ex.id} className="rounded border border-gym-border bg-gym-surface px-3 py-2">
            <p className="text-sm font-medium capitalize">{getLocalizedExerciseName(ex.exerciseNameSnapshot, lang)}</p>
            <p className="text-xs text-gym-muted">{t(ex.sets.length === 1 ? 'setCount' : 'setCountPlural', { count: ex.sets.length })}</p>
          </div>
        ))}
      </div>

      {/* PR list */}
      {initialSession.prCount > 0 && (
        <div className="bg-pr-subtle rounded-lg border border-gym-pr/30 px-3 py-3">
          <div className="mb-2 flex items-center gap-2">
            <Trophy className="text-pr h-4 w-4" />
            <p className="text-pr text-sm font-semibold">{t('personalRecords')}</p>
          </div>
          {initialSession.exercises
            .flatMap((ex) => ex.sets.filter((s) => s.isPr).map((s) => ({ ex, s })))
            .map(({ ex, s }) => (
              <p key={s.id} className="text-xs text-gym-muted">
                {getLocalizedExerciseName(ex.exerciseNameSnapshot, lang)} — {s.weight} {s.weightUnit}
              </p>
            ))}
        </div>
      )}

      {/* Notes */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={t('sessionNotes')}
        rows={3}
        className="w-full rounded border border-gym-border bg-gym-surface px-3 py-2 text-sm"
      />

      {error && <p className="text-sm text-danger">{error}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="glow-accent h-11 rounded-lg bg-gym-accent font-semibold text-white transition-all hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
      >
        {saving ? t('saving') : t('saveAndDone')}
      </button>
    </div>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border px-3 py-3 ${highlight ? 'bg-pr-subtle border-gym-pr/30' : 'border-gym-border bg-gym-surface'}`}>
      <p className="text-xs text-gym-muted">{label}</p>
      <p className={`metric text-xl ${highlight ? 'text-pr' : 'text-gym-text'}`}>{value}</p>
    </div>
  )
}
