import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { fetchHistoryList } from '@/modules/workout-history/services/history-supabase'
import { WorkoutHistoryList } from '@/modules/workout-history/components/WorkoutHistoryList'

export default async function HistoryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const initialData = await fetchHistoryList({ supabase, userId: user.id })

  return (
    <div className="px-4 py-6">
      <h1 className="mb-6 text-xl font-bold">History</h1>
      <WorkoutHistoryList userId={user.id} initialData={initialData} />
    </div>
  )
}
