/**
 * Contract: Supabase query signatures for the Workout History module.
 * Implemented in: src/modules/workout-history/services/history-supabase.ts
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  WorkoutHistorySummary,
  WorkoutHistoryDetail,
  DateRangeFilter,
} from '../../../src/modules/workout-history/types'

// ---------------------------------------------------------------------------
// Fetch paginated history list (completed sessions only)
// ---------------------------------------------------------------------------

export interface FetchHistoryListParams {
  supabase: SupabaseClient
  userId: string
  dateRange?: DateRangeFilter
  sessionIds?: string[]   // from exercise name search pre-filter
  cursor?: string         // ISO timestamp of last session in previous page (for cursor pagination)
  limit?: number          // default 20
}

export type FetchHistoryListResult =
  | { data: WorkoutHistorySummary[]; hasMore: boolean; error: null }
  | { data: null; hasMore: false; error: string }

export declare function fetchHistoryList(
  params: FetchHistoryListParams
): Promise<FetchHistoryListResult>

// ---------------------------------------------------------------------------
// Fetch full session detail (single session)
// ---------------------------------------------------------------------------

export interface FetchHistoryDetailParams {
  supabase: SupabaseClient
  sessionId: string
}

export type FetchHistoryDetailResult =
  | { data: WorkoutHistoryDetail; error: null }
  | { data: null; error: string }

export declare function fetchHistoryDetail(
  params: FetchHistoryDetailParams
): Promise<FetchHistoryDetailResult>

// ---------------------------------------------------------------------------
// Search session IDs by exercise name snapshot
// ---------------------------------------------------------------------------

export interface SearchSessionsByExerciseParams {
  supabase: SupabaseClient
  term: string            // searched exercise name fragment
}

export type SearchSessionsByExerciseResult =
  | { sessionIds: string[]; error: null }
  | { sessionIds: null; error: string }

export declare function searchSessionsByExercise(
  params: SearchSessionsByExerciseParams
): Promise<SearchSessionsByExerciseResult>
