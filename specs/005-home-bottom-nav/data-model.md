# Data Model: Home Screen + Bottom Navigation

This feature introduces **no new Supabase tables**. The home shell reads from existing data sources.

---

## Consumed Data Contracts

### UserIdentity
**Source**: `supabase.auth.getUser()` — available server-side in `(app)/layout.tsx`

| Field          | Type             | Source                              | Notes                              |
|----------------|------------------|-------------------------------------|------------------------------------|
| `id`           | `string`         | `user.id`                           | UUID, required                     |
| `displayName`  | `string`         | `user.user_metadata?.full_name`     | Falls back to email prefix → 'User'|
| `avatarUrl`    | `string \| null` | `user.user_metadata?.avatar_url`    | null if not set; no avatar in MVP  |
| `email`        | `string \| null` | `user.email`                        | Fallback display name source       |

**Derived type** (defined in `src/modules/home/types/index.ts`):
```ts
type ShellUser = {
  id: string
  displayName: string
  avatarUrl: string | null
}
```

---

### RecentWorkoutSummary
**Source**: `workout_sessions` table via `src/modules/workout-history/services/history-supabase.ts`

Only the most recent completed session is needed. Uses existing `WorkoutHistorySummary` type from `src/modules/workout-history/types/index.ts`.

| Field           | Type     | Notes                                  |
|-----------------|----------|----------------------------------------|
| `id`            | `string` | Session UUID                           |
| `name`          | `string` | Workout name                           |
| `startedAt`     | `string` | ISO timestamp                          |
| `durationSecs`  | `number` | Total session duration                 |
| `totalVolume`   | `number` | Sum of (weight × reps) across all sets |
| `totalSets`     | `number` | Total sets logged                      |

**Query parameters**: `{ userId, limit: 1, dateRange: undefined, searchQuery: undefined }`

---

## State Owned by This Feature

### BottomNav active state
**Store**: no Zustand store needed — derived from `usePathname()` at render time. No persistence required.

### QueryClient instance
**Location**: `AppShell` Client Component via `useState`. Single instance per mount, not shared across server boundary.

---

## No New Tables

The app shell and home screen are purely read-only consumers of existing data. No schema migrations are required for this feature.
