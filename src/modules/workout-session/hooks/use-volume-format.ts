'use client'

import { useWeightUnitPreference } from './use-weight-unit-preference'
import { toDisplayUnit } from '../utils/unit-conversion'
import { formatCompact } from '@/lib/format'

/**
 * Formats stored volume (always persisted in kg) into the user's preferred
 * weight unit. Reacts to unit changes via {@link useWeightUnitPreference}.
 */
export function useVolumeFormat() {
  const [unit] = useWeightUnitPreference()

  return {
    unit,
    /** Compact volume string in the display unit, e.g. "12.5k". */
    formatVolume: (volumeKg: number | null | undefined) =>
      formatCompact(toDisplayUnit(volumeKg ?? 0, 'kg', unit)),
  }
}
