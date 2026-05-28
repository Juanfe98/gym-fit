/**
 * CONTRACT: Next.js Server Actions for Workout Session Tracking
 *
 * These Server Actions run on the server with an authenticated Supabase
 * client. They are called by the offline sync service after a session
 * is completed or when draining the offline queue.
 *
 * All actions assume the calling user is authenticated — middleware
 * enforces this before any (app) route is reached.
 */

import type {
  WorkoutSessionInsert,
  SessionExerciseInsert,
  SetLogInsert,
  PersonalRecordUpsert,
} from './supabase-types'

// ---------------------------------------------------------------------------
// Session sync — called when a completed session is ready to persist
// ---------------------------------------------------------------------------

/**
 * Upsert a completed workout session and all its exercises and sets
 * in a single server action.
 *
 * Uses Postgres upsert (ON CONFLICT DO UPDATE) so re-calling with the
 * same session id is idempotent.
 *
 * Called by: useOfflineSync hook when session status transitions to 'completed'.
 */
export declare function syncCompletedSession(payload: SyncSessionPayload): Promise<SyncResult>

export interface SyncSessionPayload {
  session: WorkoutSessionInsert
  exercises: SessionExerciseInsert[]
  sets: SetLogInsert[]
  personalRecords: PersonalRecordUpsert[]    // PRs from this session
}

export interface SyncResult {
  success: boolean
  error?: string
}

// ---------------------------------------------------------------------------
// Incremental sync — called by offline queue drain for partial writes
// ---------------------------------------------------------------------------

/**
 * Upsert a single set log. Used by the offline queue for incremental sync
 * when individual sets need to be synced without re-sending the full session.
 *
 * Called by: offline queue drain service.
 */
export declare function upsertSetLog(setLog: SetLogInsert): Promise<SyncResult>

/**
 * Delete a set log by id.
 * Called when the user deleted a set while offline and it's now being synced.
 */
export declare function deleteSetLog(setLogId: string): Promise<SyncResult>

/**
 * Update session notes or status.
 * Called when session-level fields change after the initial sync.
 */
export declare function updateSession(
  sessionId: string,
  updates: Pick<WorkoutSessionInsert, 'notes' | 'status' | 'finished_at' | 'duration_seconds'>
): Promise<SyncResult>
