# ADR-003: Offline Session Storage — Dexie.js (IndexedDB)

**Date**: 2026-05-27  
**Status**: Accepted  
**Deciders**: Juan Felipe Montana  

---

## Context

The active workout session is the most critical user flow. Per the product spec and constitution
Principle VI, network availability MUST NOT block set logging. Requirements:

- Sets logged during a session must persist immediately — before any network call
- Data must survive browser refresh, app crash, and force-quit
- When connectivity returns, pending data must sync to Supabase automatically
- The sync must be idempotent — no duplicate sets or sessions

Browser storage options evaluated:
- **localStorage**: Synchronous, string-only, 5MB limit. Too small for full session history.
- **sessionStorage**: Cleared on tab close. Cannot survive refresh. Rejected immediately.
- **In-memory (Zustand/Redux)**: Lost on refresh. Rejected for persistence requirement.
- **IndexedDB**: Async, structured data, 50MB+ limit, survives app restart. Correct choice.
- **Cache API (Service Worker)**: Designed for HTTP responses, not structured app state. Not appropriate.

---

## Decision

**Use Dexie.js as the IndexedDB abstraction layer for active session persistence.**

Scope of IndexedDB usage is intentionally narrow: **active workout session only**.
Historical data, plans, and all other user data are fetched from Supabase with TanStack Query.

---

## Rationale

**Why IndexedDB over localStorage:**

| Criterion | localStorage | IndexedDB (Dexie.js) |
|---|---|---|
| Survives refresh | ✅ | ✅ |
| Survives force-quit | ✅ | ✅ |
| Async (non-blocking) | ❌ Synchronous | ✅ |
| Structured data | ❌ String only | ✅ Native objects |
| Storage limit | ~5MB | ~50MB+ |
| Transactional writes | ❌ | ✅ |
| Query capability | ❌ | ✅ Indexed lookups |

**Why Dexie.js over raw IndexedDB:**

Raw IndexedDB is verbose and event-based. Dexie.js provides a Promise-based API, TypeScript
support, schema versioning with migrations, and reactive live queries. It is the standard
choice for React + IndexedDB.

---

## Implementation Pattern

```
Offline DB Schema (Dexie):
  active_sessions:    { id, userId, startedAt, status, notes, syncStatus }
  session_exercises:  { id, sessionId, exerciseId, order, notes }
  set_logs:           { id, sessionExerciseId, weight, reps, setType, timestamp, syncStatus }
  offline_queue:      { id, table, operation, payload, createdAt, attempts }

Sync status values: 'local' | 'pending_sync' | 'syncing' | 'synced' | 'sync_failed'
```

**Write path (set logging):**
1. User taps "log set"
2. Zustand updates in-memory session state (instant UI update)
3. Dexie writes to IndexedDB (async, non-blocking)
4. If online: Supabase write queued via TanStack Mutation
5. If offline: record added to `offline_queue`

**Sync path (when connectivity returns):**
1. `navigator.onLine` event fires (or polling fallback)
2. Drain `offline_queue` — POST each pending record to Supabase
3. Use idempotency keys (client-generated UUIDs) to prevent duplicates
4. Mark records as `synced` in Dexie on success
5. On `sync_failed` after 3 attempts: surface error indicator, keep local copy

---

## Consequences

- **Positive**: Set logging is never blocked by network. Gym users in low-signal environments are fully supported.
- **Positive**: In-progress session survives browser crash / force-quit.
- **Positive**: Dexie.js is 3.5KB gzipped — minimal bundle impact.
- **Neutral**: Two sources of truth (IndexedDB + Supabase) require a sync layer. The sync is scoped to active sessions only, limiting complexity.
- **Neutral**: Dexie schema changes require migration definitions. Handled by Dexie's versioning API.
- **Risk**: IndexedDB can be cleared by the browser under storage pressure. Mitigated by: syncing aggressively when online and using the Storage Persistence API (`navigator.storage.persist()`) to request durable storage.

---

## Alternatives Considered

### localStorage only
Synchronous writes block the main thread. 5MB limit would be exceeded by months of session history.
JSON serialization loses type information. Not chosen.

### Firebase Firestore offline cache
Would require switching from Supabase to Firebase (conflicts with ADR-002). Not chosen.

### WatermelonDB
Designed for React Native. Web support exists but the primary use case and community are mobile.
Heavier than Dexie.js for a web-first app. Not chosen.

### PouchDB + CouchDB sync
CouchDB sync protocol is overkill for this use case. PouchDB is heavier than Dexie.js.
Supabase is already the sync target. Not chosen.
