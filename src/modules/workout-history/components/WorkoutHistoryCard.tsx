import Link from 'next/link'
import { formatSessionName } from '../utils/format-session-name'
import type { WorkoutHistorySummary } from '../types'

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

interface WorkoutHistoryCardProps {
  session: WorkoutHistorySummary
}

export function WorkoutHistoryCard({ session }: WorkoutHistoryCardProps) {
  const title = formatSessionName(session)
  const date = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(session.startedAt))

  return (
    <Link
      href={`/history/${session.id}`}
      prefetch={false}
      className="block rounded-lg border border-gym-border bg-gym-surface p-4 min-h-[44px]"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="shrink-0 text-xs text-gym-muted">{date}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gym-muted">
        <span>{formatDuration(session.durationSeconds)}</span>
        <span>{session.totalVolume != null ? `${session.totalVolume} kg` : '—'}</span>
        <span>{session.totalSets} sets</span>
      </div>
      {session.notes && (
        <p className="mt-2 line-clamp-2 text-xs text-gym-muted">{session.notes}</p>
      )}
    </Link>
  )
}
