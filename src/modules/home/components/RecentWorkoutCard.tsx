'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { formatDuration, relativeDay } from '@/lib/format'
import { useVolumeFormat } from '@/modules/workout-session/hooks/use-volume-format'
import type { WorkoutHistorySummary } from '@/modules/workout-history/types'

type Props = {
  session: WorkoutHistorySummary
}

export function RecentWorkoutCard({ session }: Props) {
  const { t } = useI18n()
  const { formatVolume } = useVolumeFormat()

  const rel = relativeDay(session.startedAt)
  const relText = rel.key === 'timeAgoDays' ? t(rel.key, { count: rel.count }) : t(rel.key)

  const stats: { label: string; value: string }[] = [
    { label: t('duration'), value: formatDuration(session.durationSeconds) },
    {
      label: t('volume'),
      value: session.totalVolume != null ? formatVolume(session.totalVolume) : '—',
    },
    { label: t('sets'), value: String(session.totalSets) },
    { label: t('exercises'), value: String(session.exerciseCount) },
  ]

  return (
    <Link
      href={`/history/${session.id}`}
      prefetch={false}
      className="card flex flex-col gap-3 p-4 transition-colors active:bg-gym-surface-3"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-gym-text">{relText}</span>
        <ChevronRight className="h-4 w-4 shrink-0 text-gym-muted" aria-hidden="true" />
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-0.5">
            <span className="metric text-lg text-gym-text">{s.value}</span>
            <span className="text-xs text-gym-muted">{s.label}</span>
          </div>
        ))}
      </div>
    </Link>
  )
}
