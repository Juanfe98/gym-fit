'use client'

import { useQueries } from '@tanstack/react-query'
import {
  getPreferences,
  getEquipment,
  getBodyInfo,
  getLimitations,
  getLatestMeasurement,
} from '../services/profile-service'
import type { ProfileOverviewData } from '../types'

type UseProfileOverviewResult = {
  isLoading: boolean
  isError: boolean
  data: ProfileOverviewData | null
  refetch: () => void
}

export function useProfileOverview(
  userId: string,
  displayName: string,
  avatarUrl: string | null,
): UseProfileOverviewResult {
  const results = useQueries({
    queries: [
      {
        queryKey: ['profile', 'preferences', userId],
        queryFn: () => getPreferences(userId),
      },
      {
        queryKey: ['profile', 'equipment', userId],
        queryFn: () => getEquipment(userId),
      },
      {
        queryKey: ['profile', 'body-info', userId],
        queryFn: () => getBodyInfo(userId),
      },
      {
        queryKey: ['profile', 'limitations', userId],
        queryFn: () => getLimitations(userId),
      },
      {
        queryKey: ['profile', 'measurements', userId],
        queryFn: () => getLatestMeasurement(userId),
      },
    ],
  })

  const isLoading = results.some((r) => r.isLoading)
  const isError = results.some((r) => r.isError)

  const [prefsResult, equipResult, bodyResult, limitResult, measureResult] = results

  const data: ProfileOverviewData | null =
    !isLoading && !isError
      ? {
          displayName,
          avatarUrl,
          preferences: prefsResult.data ?? null,
          equipment: equipResult.data ?? null,
          bodyInfo: bodyResult.data ?? null,
          limitations: limitResult.data ?? [],
          latestMeasurement: measureResult.data ?? null,
        }
      : null

  function refetch() {
    results.forEach((r) => r.refetch())
  }

  return { isLoading, isError, data, refetch }
}
