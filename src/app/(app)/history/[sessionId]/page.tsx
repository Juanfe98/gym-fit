import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { fetchHistoryDetail } from '@/modules/workout-history/services/history-supabase'
import { WorkoutHistoryDetail } from '@/modules/workout-history/components/WorkoutHistoryDetail'

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
        <Link
          href="/history"
          className="inline-flex min-h-[44px] items-center gap-1 px-2 text-sm text-gym-muted"
        >
          <ChevronLeft className="h-4 w-4" />
          History
        </Link>
      </div>
      <WorkoutHistoryDetail session={result.data} />
    </>
  )
}
