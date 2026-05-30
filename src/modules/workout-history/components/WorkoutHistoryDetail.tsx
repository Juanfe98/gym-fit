'use client'

import { useI18n } from '@/i18n/client'
import { formatSessionName } from '../utils/format-session-name'
import { ExerciseSetGroup } from './ExerciseSetGroup'
import type { WorkoutHistoryDetail as WorkoutHistoryDetailData } from '../types'

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

interface WorkoutHistoryDetailProps {
  session: WorkoutHistoryDetailData
}

export function WorkoutHistoryDetail({ session }: WorkoutHistoryDetailProps) {
  const { t, lang } = useI18n()
  const title = formatSessionName(session)

  const startDate = new Intl.DateTimeFormat(lang, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(session.startedAt))

  const startTime = new Intl.DateTimeFormat(lang, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(session.startedAt))

  const totalSets = session.exercises.reduce(
    (n, e) => n + e.sets.filter((s) => s.setType !== 'warmup' && s.isCompleted).length,
    0
  )

  const prSets = session.exercises.flatMap((ex) =>
    ex.sets
      .filter((s) => s.isPr)
      .map((s) => ({ exerciseName: ex.exerciseNameSnapshot, set: s }))
  )

  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm text-gym-muted">
          {startDate} · {startTime}
        </p>
      </div>

      {session.sourcePlanName && (
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-gym-muted">
            {t('historyDetailFromPlan')}
          </span>
          <span className="text-sm font-medium">
            {session.sourcePlanName}
            {session.sourceDayName && ` · ${session.sourceDayName}`}
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] uppercase tracking-wide text-gym-muted">
            {t('historyDetailDuration')}
          </span>
          <span className="text-sm font-semibold">{formatDuration(session.durationSeconds)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] uppercase tracking-wide text-gym-muted">
            {t('historyDetailVolume')}
          </span>
          <span className="text-sm font-semibold">
            {session.totalVolume != null ? `${session.totalVolume} kg` : '—'}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] uppercase tracking-wide text-gym-muted">
            {t('historyDetailSets')}
          </span>
          <span className="text-sm font-semibold">{totalSets}</span>
        </div>
        {session.prCount > 0 && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] uppercase tracking-wide text-gym-muted">
              {t('historyDetailPRs')}
            </span>
            <span className="text-sm font-semibold">{session.prCount}</span>
          </div>
        )}
      </div>

      {prSets.length > 0 && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
          <p className="mb-2 text-xs font-semibold text-yellow-400">
            {t('historyDetailPersonalRecords')}
          </p>
          <ul className="flex flex-col gap-1">
            {prSets.map(({ exerciseName, set }) => (
              <li key={set.id} className="text-xs text-gym-muted">
                {exerciseName} —{' '}
                {set.weight != null ? `${set.weight} ${set.weightUnit}` : '—'} ×{' '}
                {set.reps ?? '—'}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {session.exercises.map((exercise) => (
          <ExerciseSetGroup key={exercise.id} exercise={exercise} />
        ))}
      </div>

      {session.notes && (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gym-muted">
            {t('historyDetailNotes')}
          </span>
          <p className="text-sm">{session.notes}</p>
        </div>
      )}
    </div>
  )
}
