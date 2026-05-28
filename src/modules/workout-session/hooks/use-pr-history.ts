'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { PrMap } from '../types'

export function usePrHistory(userId: string | null) {
  return useQuery({
    queryKey: ['pr-history', userId],
    queryFn: async (): Promise<PrMap> => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('personal_records')
        .select('exercise_id, max_weight, max_weight_unit')
        .eq('user_id', userId!)
      if (error) throw error
      return Object.fromEntries(
        (data ?? []).map((row) => [
          row.exercise_id,
          { maxWeight: row.max_weight, maxWeightUnit: row.max_weight_unit },
        ])
      )
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}
