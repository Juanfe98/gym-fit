import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  DashboardHero,
  TodayWorkoutCard,
  WeeklyCalendarCard,
  ProgressSnapshotCard,
  CurrentSetupCard,
  RecentActivityCard,
} from '@/modules/dashboard'
import type { DashboardSetupData } from '@/modules/dashboard'

export const metadata = { title: 'Dashboard' }

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user?.user_metadata?.onboarding_status !== 'completed') {
    redirect('/onboarding/goal')
  }

  const userId = user!.id
  const firstName =
    (user!.user_metadata?.full_name as string | undefined)?.split(' ')[0] ??
    user!.email?.split('@')[0] ??
    undefined

  const [prefsResult, equipmentResult] = await Promise.all([
    supabase
      .from('user_fitness_preferences')
      .select('fitness_goal, experience_level, days_per_week, session_duration_minutes')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('user_equipment')
      .select('equipment_items')
      .eq('user_id', userId)
      .maybeSingle(),
  ])

  const prefs = prefsResult.data
  const equipment = equipmentResult.data

  const setupData: DashboardSetupData = {
    mainGoal:
      (user!.user_metadata?.mainGoal as string | undefined) ??
      prefs?.fitness_goal ??
      undefined,
    experienceLevel: prefs?.experience_level ?? undefined,
    daysPerWeek: prefs?.days_per_week ?? undefined,
    sessionDurationMinutes: prefs?.session_duration_minutes ?? undefined,
    equipmentItems: Array.isArray(equipment?.equipment_items)
      ? (equipment.equipment_items as string[])
      : [],
  }

  return (
    <div className="flex flex-col gap-6 px-4 pb-8 pt-4">
      <DashboardHero displayName={firstName} />

      <div className="grid gap-6 lg:grid-cols-[1fr_288px]">
        <div className="flex flex-col gap-6">
          <TodayWorkoutCard userId={userId} />
          <WeeklyCalendarCard userId={userId} />
          <RecentActivityCard userId={userId} />
        </div>

        <div className="flex flex-col gap-6">
          <ProgressSnapshotCard userId={userId} />
          <CurrentSetupCard setup={setupData} />
        </div>
      </div>
    </div>
  )
}
