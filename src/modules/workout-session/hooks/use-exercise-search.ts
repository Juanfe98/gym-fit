'use client'

import { useQuery } from '@tanstack/react-query'
import exercisesJson from '@/data/exercises/exercises.json'

export interface ExerciseSearchResult {
  id: string
  name: string
  bodyPart: string
  target: string
  equipment: string
  gifUrl: string
  secondaryMuscles: string[]
}

export interface ExerciseSearchOptions {
  query?: string
  bodyPart?: string
  equipment?: string
  page?: number
  pageSize?: number
}

export interface ExerciseSearchPage {
  exercises: ExerciseSearchResult[]
  total: number
  hasMore: boolean
}

const ALL_EXERCISES = exercisesJson as ExerciseSearchResult[]

export const BODY_PARTS = [...new Set(ALL_EXERCISES.map((e) => e.bodyPart))].sort()
export const EQUIPMENT_OPTIONS = [...new Set(ALL_EXERCISES.map((e) => e.equipment))].sort()

function searchExercises(opts: Required<ExerciseSearchOptions>): ExerciseSearchPage {
  const { query, bodyPart, equipment, page, pageSize } = opts

  let results = ALL_EXERCISES

  if (query) {
    const q = query.toLowerCase()
    results = results.filter((e) => e.name.toLowerCase().includes(q))
  }
  if (bodyPart) {
    results = results.filter((e) => e.bodyPart === bodyPart)
  }
  if (equipment) {
    results = results.filter((e) => e.equipment === equipment)
  }

  const total = results.length
  const start = page * pageSize
  return {
    exercises: results.slice(start, start + pageSize),
    total,
    hasMore: start + pageSize < total,
  }
}

export function useExerciseSearch(options: ExerciseSearchOptions = {}) {
  const { query = '', bodyPart = '', equipment = '', page = 0, pageSize = 20 } = options

  return useQuery({
    queryKey: ['exercise-search', query, bodyPart, equipment, page, pageSize],
    queryFn: () => searchExercises({ query, bodyPart, equipment, page, pageSize }),
    staleTime: Infinity,
  })
}
