'use client'

import Link from 'next/link'
import { ChevronRight, Trophy } from 'lucide-react'
import { formatDuration } from '@/lib/format'
import { useVolumeFormat } from '@/modules/workout-session/hooks/use-volume-format'
import { formatSessionName } from '../utils/format-session-name'
import type { WorkoutHistorySummary } from '../types'

interface WorkoutHistoryCardProps {
  session: WorkoutHistorySummary
}

export function WorkoutHistoryCard({ session }: WorkoutHistoryCardProps) {
  const { unit, formatVolume } = useVolumeFormat()
  const title = formatSessionName(session)
  const date = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(session.startedAt))

  const stats: { label: string; value: string }[] = [
    { label: 'Time', value: formatDuration(session.durationSeconds) },
    {
      label: 'Volume',
      value: session.totalVolume != null ? `${formatVolume(session.totalVolume)}${unit}` : '—',
    },
    { label: 'Sets', value: String(session.totalSets) },
    { label: 'Exercises', value: String(session.exerciseCount) },
  ]

  return (
    <Link
      href={`/history/${session.id}`}
      prefetch={false}
      className="card flex flex-col gap-3 p-4 transition-colors active:bg-gym-surface-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h3 className="truncate text-sm font-semibold text-gym-text">{title}</h3>
          {session.sourcePlanName && session.sourceDayName && (
            <span className="text-xs text-gym-muted">
              {session.sourcePlanName} · {session.sourceDayName}
            </span>
          )}
          <span className="text-xs text-gym-muted">{date}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {session.prCount > 0 && (
            <span className="bg-pr-subtle text-pr inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold">
              <Trophy className="h-3 w-3" aria-hidden="true" />
              {session.prCount}
            </span>
          )}
          <ChevronRight className="h-4 w-4 text-gym-muted" aria-hidden="true" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-0.5">
            <span className="metric text-base text-gym-text">{s.value}</span>
            <span className="text-[11px] text-gym-muted">{s.label}</span>
          </div>
        ))}
      </div>

      {session.notes && (
        <p className="line-clamp-2 text-xs text-gym-muted">{session.notes}</p>
      )}
    </Link>
  )
}
