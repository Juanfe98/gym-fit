'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { syncCompletedSession } from '../services/session-supabase'
import { finishedSessionToPayload } from '../utils/session-payload'
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
      setError(result.error ?? 'Sync failed')
      setSaving(false)
      return
    }
    sessionStorage.removeItem('finishedSession')
    router.push('/')
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Workout Complete</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Duration" value={formatDuration(initialSession.durationSeconds)} />
        <Stat label="Volume" value={`${Math.round(initialSession.totalVolume)} kg`} />
        <Stat label="Exercises" value={String(initialSession.exercises.length)} />
        <Stat label="Sets" value={String(initialSession.exercises.reduce((n, e) => n + e.sets.length, 0))} />
        {initialSession.prCount > 0 && (
          <Stat label="PRs" value={`${initialSession.prCount} 🏆`} />
        )}
      </div>

      {/* Per-exercise breakdown */}
      <div className="flex flex-col gap-2">
        {initialSession.exercises.map((ex) => (
          <div key={ex.id} className="rounded border border-gym-border bg-gym-surface px-3 py-2">
            <p className="text-sm font-medium capitalize">{ex.exerciseNameSnapshot}</p>
            <p className="text-xs text-gym-muted">{ex.sets.length} set{ex.sets.length !== 1 ? 's' : ''}</p>
          </div>
        ))}
      </div>

      {/* PR list */}
      {initialSession.prCount > 0 && (
        <div className="rounded border border-yellow-500/30 bg-yellow-500/10 px-3 py-2">
          <p className="text-sm font-semibold text-yellow-400">Personal Records</p>
          {initialSession.exercises
            .flatMap((ex) => ex.sets.filter((s) => s.isPr).map((s) => ({ ex, s })))
            .map(({ ex, s }) => (
              <p key={s.id} className="text-xs text-gym-muted">
                {ex.exerciseNameSnapshot} — {s.weight} {s.weightUnit}
              </p>
            ))}
        </div>
      )}

      {/* Notes */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Session notes…"
        rows={3}
        className="w-full rounded border border-gym-border bg-gym-surface px-3 py-2 text-sm"
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="h-11 rounded bg-orange-500 font-semibold text-white disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save & Done'}
      </button>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-gym-border bg-gym-surface px-3 py-3">
      <p className="text-xs text-gym-muted">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}
