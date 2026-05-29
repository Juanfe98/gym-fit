import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { fetchHistoryList } from '@/modules/workout-history/services/history-supabase'
import { WorkoutHistoryList } from '@/modules/workout-history/components/WorkoutHistoryList'
import { HistoryHeader } from '@/modules/workout-history/components/HistoryHeader'

export default async function HistoryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const initialData = await fetchHistoryList({ supabase, userId: user.id })

  return (
    <div className="flex flex-col gap-5 px-4 py-6">
      <HistoryHeader userId={user.id} />
      <WorkoutHistoryList userId={user.id} initialData={initialData} />
    </div>
  )
}
