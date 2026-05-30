import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { fetchHistoryDetail } from '@/modules/workout-history/services/history-supabase'
import { WorkoutHistoryDetail } from '@/modules/workout-history/components/WorkoutHistoryDetail'
import { HistoryBackLink } from '@/modules/workout-history/components/HistoryBackLink'

interface HistoryDetailPageProps {
  params: Promise<{ sessionId: string }>
}

export default async function HistoryDetailPage({ params }: HistoryDetailPageProps) {
  const { sessionId } = await params
  const supabase = await createClient()
  const result = await fetchHistoryDetail({ supabase, sessionId })

  if (result.data === null) notFound()

  return (
    <>
      <div className="sticky top-0 z-10 flex h-12 items-center border-b border-gym-border bg-gym-surface px-2">
        <HistoryBackLink />
      </div>
      <WorkoutHistoryDetail session={result.data} />
    </>
  )
}
