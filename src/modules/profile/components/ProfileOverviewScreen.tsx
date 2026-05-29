'use client'

import { useI18n } from '@/i18n/client'
import { PageHeader } from '@/components/ui'
import { useProfileOverview } from '../hooks/use-profile-overview'
import { calcCompletion } from '../utils/completion'
import { ProfileSkeleton } from './ProfileSkeleton'
import { ProfileError } from './ProfileError'
import { ProfileHeader } from './ProfileHeader'
import { GoalSection } from './GoalSection'
import { ExperienceLevelSection } from './ExperienceLevelSection'
import { AvailabilitySection } from './AvailabilitySection'
import { EquipmentSection } from './EquipmentSection'
import { BodyInfoSection } from './BodyInfoSection'
import { LimitationsSection } from './LimitationsSection'
import { MeasurementsSection } from './MeasurementsSection'

type ProfileOverviewScreenProps = {
  userId: string
  displayName: string
  avatarUrl: string | null
}

export function ProfileOverviewScreen({ userId, displayName, avatarUrl }: ProfileOverviewScreenProps) {
  const { t } = useI18n()
  const { isLoading, isError, data, refetch } = useProfileOverview(userId, displayName, avatarUrl)

  if (isLoading) return <ProfileSkeleton />
  if (isError) return <ProfileError onRetry={refetch} />

  const prefs = data?.preferences ?? null
  const equipment = data?.equipment ?? null
  const bodyInfo = data?.bodyInfo ?? null
  const limitations = data?.limitations ?? []
  const latestMeasurement = data?.latestMeasurement ?? null

  const completion = calcCompletion({
    hasName: !!displayName && displayName !== 'User',
    hasGoal: prefs?.fitnessGoal != null,
    hasLevel: prefs?.experienceLevel != null,
    hasAvailability: prefs?.daysPerWeek != null,
    hasEquipment: (equipment?.equipmentItems.length ?? 0) > 0,
    hasUnits: prefs != null,
  })

  const weightUnit = prefs?.weightUnit ?? 'kg'
  const heightUnit = prefs?.heightUnit ?? 'cm'

  return (
    <div className="flex flex-col">
      <PageHeader title={t('profileTitle')} />

      <div className="flex flex-col gap-4 px-4 pb-6">
        <ProfileHeader
          displayName={displayName}
          avatarUrl={avatarUrl}
          fitnessGoal={prefs?.fitnessGoal ?? null}
          experienceLevel={prefs?.experienceLevel ?? null}
          completion={completion}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Row 1 */}
          <GoalSection goal={prefs?.fitnessGoal ?? null} />
          <ExperienceLevelSection level={prefs?.experienceLevel ?? null} />

          {/* Row 2 */}
          <AvailabilitySection
            daysPerWeek={prefs?.daysPerWeek ?? null}
            sessionDurationMinutes={prefs?.sessionDurationMinutes ?? null}
            preferredDays={prefs?.preferredDays ?? []}
          />
          <EquipmentSection
            preset={equipment?.preset ?? null}
            equipmentItems={equipment?.equipmentItems ?? []}
          />

          {/* Row 3 */}
          <BodyInfoSection
            heightCm={bodyInfo?.heightCm ?? null}
            weightKg={bodyInfo?.weightKg ?? null}
            heightUnit={heightUnit}
            weightUnit={weightUnit}
          />
          <LimitationsSection limitations={limitations} />

          {/* Row 4 — full width */}
          <div className="md:col-span-2">
            <MeasurementsSection
              latestMeasurement={latestMeasurement}
              weightUnit={weightUnit}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
