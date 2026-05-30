'use client'

import Link from 'next/link'
import { History, ChevronRight } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { SectionLabel, EmptyState } from '@/components/ui'
import { formatDuration, relativeDay } from '@/lib/format'
import { useRecentWorkoutsList } from '../hooks/use-recent-workouts-list'

type Props = { userId: string }

function Skeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-4 w-32 animate-pulse rounded bg-gym-surface-2" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-xl bg-gym-surface-2" />
      ))}
    </div>
  )
}

export function RecentActivityCard({ userId }: Props) {
  const { t } = useI18n()
  const { data, isLoading, isError, refetch } = useRecentWorkoutsList(userId, 5)

  if (isLoading) return <Skeleton />

  if (isError) {
    return (
      <div className="card p-4 text-center">
        <p className="mb-3 text-sm text-gym-muted">{t('homeRecentWorkoutError')}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="focus-ring text-sm font-semibold text-gym-accent"
        >
          {t('dashboardRetry')}
        </button>
      </div>
    )
  }

  const hasSessions = !!data && data.length > 0

  return (
    <section aria-label={t('dashboardRecentTitle')}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <SectionLabel>{t('dashboardRecentTitle')}</SectionLabel>
        {hasSessions && (
          <Link
            href="/history"
            className="focus-ring inline-flex items-center gap-0.5 text-xs font-semibold text-gym-accent"
          >
            {t('viewAll')}
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        )}
      </div>

      {!hasSessions ? (
        <div className="card">
          <EmptyState
            Icon={History}
            title={t('dashboardRecentEmpty')}
            message={t('dashboardRecentEmptyBody')}
          />
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {data!.map(session => {
            const rel = relativeDay(session.startedAt)
            const relText =
              rel.key === 'timeAgoDays' ? t(rel.key, { count: rel.count }) : t(rel.key)

            const title = session.sourceDayName ?? session.sourcePlanName ?? relText

            return (
              <li key={session.id}>
                <Link
                  href={`/history/${session.id}`}
                  prefetch={false}
                  className="card flex items-center gap-3 p-3 transition-colors active:bg-gym-surface-3"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium text-gym-text">{title}</span>
                    <span className="text-xs text-gym-muted">{relText}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-xs text-gym-muted">
                    <span>{formatDuration(session.durationSeconds)}</span>
                    <span>{t('dashboardExercises', { count: session.exerciseCount })}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-gym-muted" aria-hidden="true" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
