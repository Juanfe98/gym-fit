# ADR-004: State Management — TanStack Query + Zustand

**Date**: 2026-05-27  
**Status**: Accepted  
**Deciders**: Juan Felipe Montana  

---

## Context

The app has two fundamentally different kinds of state:

1. **Server state**: Data that lives in Supabase and is shared across devices.
   Examples: workout history, exercise library, plans, progress metrics, goals, calendar.
   Characteristics: async, needs caching, needs background refetch, needs pagination.

2. **Client state**: Data that is local to the current session and may be ephemeral.
   Examples: active workout session draft, rest timer countdown, offline queue,
   UI preferences (theme, expanded/collapsed panels), modal open/close.
   Characteristics: synchronous, no server round-trip needed, can be in-memory.

A single state management solution that handles both categories well does not exist.
Using a generic state store (Redux, Zustand alone) for server state forces manual cache
management, loading states, and refetch logic. Using TanStack Query alone for client state
is awkward since it is designed for async data.

---

## Decision

**Use TanStack Query v5 for server state and Zustand for client state. Separate concerns explicitly.**

Form state is managed by React Hook Form + Zod, separate from both.

---

## Rationale

### TanStack Query for server state

| Feature | Manual fetch + useState | TanStack Query |
|---|---|---|
| Caching | Manual | Automatic, configurable |
| Background refetch | Manual | Automatic (stale-while-revalidate) |
| Loading / error states | Manual | Built-in |
| Pagination / infinite scroll | Complex manual | `useInfiniteQuery` built-in |
| Optimistic updates | Manual | First-class API |
| Deduplication | Manual | Automatic |
| Next.js RSC integration | N/A | Hydration from Server Components |

TanStack Query eliminates entire categories of bugs (stale data, race conditions, duplicate
requests) that would otherwise require manual implementation.

### Zustand for client state

Zustand is chosen over Redux/Jotai/Valtio for:
- Zero-boilerplate store definition
- TypeScript-first
- Works outside React components (sync from Dexie.js background sync)
- Minimal bundle size (~1KB gzipped)
- Slice pattern keeps active session store separate from UI store

### React Hook Form + Zod for forms

- RHF manages form lifecycle (dirty state, touched, submission) at zero controlled-component cost
- Zod provides single source of truth for validation — same schema used for form validation
  and Supabase insert validation
- RHF + Zod is the de facto standard for Next.js forms

---

## Store Boundaries

```
TanStack Query (server state):
  - Exercise library (cached, rarely invalidated)
  - Workout plans (invalidated on create/edit/delete)
  - Workout history (paginated, invalidated on session complete)
  - Progress metrics (invalidated on session complete)
  - Goals (invalidated on create/update)
  - User profile / fitness profile
  - Scheduled workouts

Zustand stores:
  - workoutSessionStore: active session draft, exercises, sets (synced to Dexie.js)
  - timerStore: rest timer countdown, active state
  - offlineQueueStore: pending sync operations, sync status
  - uiStore: navigation state, modals, toasts

React Hook Form + Zod:
  - Sign up / sign in forms
  - Onboarding steps
  - Plan creation / edit
  - Goal creation / edit
  - Profile edit
  - Settings
```

---

## Key Rules

- TanStack Query keys MUST be defined as constants in each module's `hooks/query-keys.ts`
- Zustand stores MUST be created in `modules/<feature>/hooks/use-<feature>-store.ts`
- MUST NOT put server state in Zustand — if it lives in Supabase, it belongs in TanStack Query
- MUST NOT fetch data in Zustand actions — Zustand is for synchronous local state only
- Optimistic updates for Supabase mutations MUST use TanStack Query's `onMutate` / `onError` rollback pattern
- The active workout session in Zustand is the in-memory representation; Dexie.js is the persistence layer; Supabase is the source of truth after sync

---

## Consequences

- **Positive**: Server state caching reduces Supabase reads significantly — exercise library is fetched once and cached.
- **Positive**: Optimistic updates make set logging feel instant even on slow connections.
- **Positive**: Clear boundaries between server state and client state prevent architectural drift.
- **Neutral**: Two state libraries to learn and maintain. Mitigated by clear boundary rules above.
- **Neutral**: TanStack Query's dehydration/hydration must be configured correctly for Next.js RSC.
- **Work required**: Each module defines its own query keys and hooks. Consistent convention required.

---

## Alternatives Considered

### Redux Toolkit (RTK Query)
RTK Query is a capable server-state layer. However, RTK has more boilerplate than Zustand
for client state, and the combined bundle of RTK + RTK Query is heavier than TanStack Query +
Zustand. Next.js community has largely moved to TanStack Query. Not chosen.

### SWR
Simpler than TanStack Query, but lacks: mutations with optimistic updates, infinite queries,
request deduplication across components, and the full devtools ecosystem. Not chosen for a
data-heavy app.

### Jotai
Atomic state model is elegant. But atoms are less natural for grouped state like an active
workout session (many fields, one write path). Zustand slices fit the domain better. Not chosen.

### Context API
Appropriate for low-frequency global state (theme, user). Would cause excessive re-renders
for high-frequency state like set logging (every keystroke in weight input). Not chosen as
primary solution; acceptable for auth context wrapper only.
