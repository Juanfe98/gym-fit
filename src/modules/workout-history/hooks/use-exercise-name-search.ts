import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { historyKeys } from './query-keys'
import { searchSessionsByExercise } from '../services/history-supabase'

export function useExerciseNameSearch(term: string): {
  sessionIds: string[] | null
  isSearching: boolean
} {
  const [debouncedTerm, setDebouncedTerm] = useState(term)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const id = setTimeout(() => setDebouncedTerm(term), 250)
    return () => clearTimeout(id)
  }, [term])

  const { data, isFetching } = useQuery({
    queryKey: [...historyKeys.all, 'exercise-search', debouncedTerm],
    queryFn: () => searchSessionsByExercise({ supabase, term: debouncedTerm }),
    enabled: debouncedTerm !== '',
    staleTime: 30_000,
  })

  if (term === '') return { sessionIds: null, isSearching: false }

  return {
    sessionIds: data?.sessionIds ?? null,
    isSearching: term !== debouncedTerm || isFetching,
  }
}
