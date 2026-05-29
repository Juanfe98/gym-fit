# Contracts: App Shell + Home Module

---

## `(app)/layout.tsx` — Server Component Contract

**Route**: Wraps all routes under `src/app/(app)/`
**Type**: Server Component (no `'use client'`)

**Responsibilities**:
- Read session via `createServerClient().auth.getUser()`
- Redirect to `/login` if no user (belt-and-suspenders behind middleware)
- Derive `ShellUser` from user metadata
- Render `<AppShell user={shellUser}>{children}</AppShell>`

**Props passed to `AppShell`**:
```ts
type ShellUser = {
  id: string
  displayName: string
  avatarUrl: string | null
}
```

---

## `AppShell` Client Component Contract

**File**: `src/modules/home/components/AppShell.tsx`
**Type**: Client Component (`'use client'`)

**Props**:
```ts
type AppShellProps = {
  user: ShellUser
  children: React.ReactNode
}
```

**Responsibilities**:
- Mount `QueryClientProvider` (owns QueryClient instance)
- Render `<BottomNav />` fixed at bottom
- Render `<main className="flex-1 pb-16">{children}</main>`
- Provide user context to `BottomNav` (via props, not context)

**Does NOT**:
- Fetch data
- Check auth state
- Own any Zustand store

---

## `BottomNav` Client Component Contract

**File**: `src/modules/home/components/BottomNav.tsx`
**Type**: Client Component (`'use client'`)

**Props**: none (reads route via `usePathname()`)

**Tab definitions** (internal constant):
```ts
const NAV_TABS = [
  { href: '/',         label: 'Home',    icon: Home    },
  { href: '/workout',  label: 'Workout', icon: Dumbbell },
  { href: '/history',  label: 'History', icon: History  },
  { href: '/profile',  label: 'Profile', icon: User     },
] as const
```

**Active state logic**:
- Home tab (`/`): `pathname === '/'`
- All other tabs: `pathname.startsWith(href)`
- Active: `text-gym-accent` + icon with `aria-current="page"` on the link
- Inactive: `text-gym-muted`

**Accessibility**:
- `<nav aria-label="Main navigation">`
- Each `<Link>` gets `aria-current="page"` when active
- Icons have `aria-hidden="true"`
- Labels always visible (no icon-only tabs)
- Minimum touch target: `min-h-[44px] min-w-[44px]`

**Active state visual distinction** (beyond color):
- Active icon: `stroke-width-2.5` (heavier)
- Inactive icon: `stroke-width-1.5` (lighter)
- Active label: `font-semibold`
- Inactive label: `font-normal`

---

## `HomeScreen` Server Component Contract

**File**: `src/app/(app)/page.tsx`
**Type**: Server Component (async, reads session for userId)

**Responsibilities**:
- Render `<HomeHeader displayName={displayName} />` (Client Component — owns sign-out)
- Render `<StartWorkoutCTA />` (Server Component — `<Link href="/workout">`, no client interactivity needed)
- Render `<RecentWorkoutSection userId={userId} />` (Client Component — TanStack Query)

**Route**: `/`

---

## `HomeHeader` Client Component Contract

**File**: `src/modules/home/components/HomeHeader.tsx`
**Type**: Client Component (`'use client'`)

**Props**:
```ts
type HomeHeaderProps = {
  displayName: string
}
```

**Responsibilities**:
- Display "Good [morning/afternoon/evening], {displayName}" greeting or just "{displayName}"
- Render sign-out button/icon in top-right corner
- On sign-out tap: call `supabase.auth.signOut()` then `router.push('/login')`

---

## `RecentWorkoutSection` Client Component Contract

**File**: `src/modules/home/components/RecentWorkoutSection.tsx`
**Type**: Client Component (`'use client'`)

**Props**:
```ts
type RecentWorkoutSectionProps = {
  userId: string
}
```

**States**:
- Loading: renders `<RecentWorkoutSkeleton />` (single card-height skeleton)
- Error: renders error card with retry; "Start Workout" CTA remains visible above
- Empty: renders encouraging empty state with CTA to start first workout
- Data: renders `<RecentWorkoutCard session={session} />`

---

## `home` Module Public Barrel

**File**: `src/modules/home/index.ts`

**Exports**:
```ts
export { AppShell } from './components/AppShell'
export { BottomNav } from './components/BottomNav'
export { HomeHeader } from './components/HomeHeader'
export { RecentWorkoutSection } from './components/RecentWorkoutSection'
export type { ShellUser } from './types'
```

---

## `use-recent-workout` Hook Contract

**File**: `src/modules/home/hooks/use-recent-workout.ts`

```ts
function useRecentWorkout(userId: string): {
  data: WorkoutHistorySummary | null | undefined
  isLoading: boolean
  isError: boolean
}
```

**Query key**: `['home', 'recent-workout', userId]`
**Stale time**: 5 minutes (matches QueryClient default)
**Fetcher**:
```ts
const supabase = useMemo(() => createClient(), [])

useQuery({
  queryKey: ['home', 'recent-workout', userId],
  queryFn: async () => {
    const result = await fetchHistoryList({ supabase, userId, limit: 1 })
    if (result.error) throw new Error(result.error)
    return result.data?.[0] ?? null
  },
})
```
`supabase` client MUST be created via `createClient()` from `@/lib/supabase/client` and memoized with `useMemo`. The `fetchHistoryList` function requires `supabase: SupabaseClient` as a required argument (see `src/modules/workout-history/services/history-supabase.ts:27`).

**Import**: `WorkoutHistorySummary` from `src/modules/workout-history/types`

---

## i18n Keys Required

New keys to add to **both** `en` and `es` blocks in `src/i18n/ui.ts`:

| Key | English | Spanish |
|-----|---------|---------|
| `navHome` | `'Home'` | `'Inicio'` |
| `navWorkout` | `'Workout'` | `'Entrenamiento'` |
| `navProfile` | `'Profile'` | `'Perfil'` |
| `signOut` | `'Sign out'` | `'Cerrar sesión'` |
| `homeGreeting` | `'Hi, {name}'` | `'Hola, {name}'` |
| `homeRecentWorkoutLabel` | `'Last workout'` | `'Último entrenamiento'` |
| `homeRecentWorkoutError` | `'Could not load recent workout'` | `'No se pudo cargar el último entrenamiento'` |
| `homeRetry` | `'Retry'` | `'Reintentar'` |
| `profileComingSoon` | `'Profile coming soon'` | `'Perfil próximamente'` |

**Reuse existing keys** (do NOT duplicate):
- `startWorkout` — "Start Workout" CTA button
- `history` — History tab label (`navHistory` not needed)
- `historyEmpty` + `historyEmptyCtaStart` — empty state on Home
- `loading` — skeleton aria-label / generic loading fallback
