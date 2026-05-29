# Quickstart: Home Screen + Bottom Navigation

## How to add a new tab to the bottom nav

Edit `src/modules/home/components/BottomNav.tsx`. Add an entry to the `NAV_TABS` constant:

```ts
{ href: '/my-new-route', label: 'Label', icon: SomeIcon }
```

Then create the route at `src/app/(app)/my-new-route/page.tsx`.

**Rules**: Max 5 tabs before the nav overflows at 375px. New icons must come from `lucide-react`.

---

## How to add a new section to the Home screen

1. Create a new Client Component in `src/modules/home/components/`
2. If it needs data: create a hook in `src/modules/home/hooks/` using TanStack Query
3. Add the component to `src/app/(app)/page.tsx`
4. Export the component from `src/modules/home/index.ts`

---

## How to pass user data from the shell to a child page

The shell layout reads the user server-side and renders `AppShell` with the user prop. Pages under `(app)/` that need the user ID should either:
- Fetch it server-side via `createServerClient().auth.getUser()` in their own Server Component
- Receive it as a search param or via a server action (not via props across Server/Client boundary)

Do NOT use a Zustand store or React Context for the user session — the server already provides it.

---

## How to verify the auth gate works

1. Clear cookies / open an incognito window
2. Navigate to `/`, `/workout`, `/history`, or `/profile`
3. Verify redirect to `/login`
4. Log in → verify landing on `/` (Home)
5. Refresh any authenticated page → verify no redirect

---

## File map for this feature

```
src/
  app/
    (app)/
      layout.tsx                      ← Server Component — session read, renders AppShell
      page.tsx                        ← Home screen (NEW — replaces root page.tsx)
      profile/
        page.tsx                      ← Profile stub (NEW)
  modules/
    home/
      components/
        AppShell.tsx                  ← Client — QueryClientProvider + layout structure
        BottomNav.tsx                 ← Client — 4 tabs, active state, ARIA
        HomeHeader.tsx                ← Client — greeting + sign-out
        RecentWorkoutSection.tsx      ← Client — TQ hook, loading/error/empty/data states
        RecentWorkoutCard.tsx         ← Display-only card
        RecentWorkoutSkeleton.tsx     ← Skeleton loader
        StartWorkoutCTA.tsx           ← Button linking to /workout
        ProfileStubScreen.tsx         ← (optional) if stub has its own component
      hooks/
        use-recent-workout.ts         ← TanStack Query hook
      types/
        index.ts                      ← ShellUser type
      index.ts                        ← Barrel export
```

**Deleted**:
- `src/app/page.tsx` — replaced by `src/app/(app)/page.tsx`
