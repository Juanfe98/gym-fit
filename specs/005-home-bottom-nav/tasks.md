# Tasks: Home Screen + Bottom Navigation (App Shell)

**Input**: Design documents from `specs/005-home-bottom-nav/`
**Branch**: `005-home-bottom-nav`
**Tests**: Not requested — validation via `npm run build` + manual 375px visual check per constitution DoD.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared state dependencies)
- **[Story]**: User story label (US1–US5 maps to spec.md user stories)
- Exact file paths in every description

---

## Phase 1: Setup

**Purpose**: Module directory structure, types, and i18n keys. No app behaviour changes.

- [x] T001 Create home module directory structure: `src/modules/home/components/`, `src/modules/home/hooks/`, `src/modules/home/types/` — empty dirs only, no files yet
- [x] T002 [P] Add i18n keys to `src/i18n/ui.ts` in both `en` and `es` blocks: `navHome`, `navWorkout`, `navProfile`, `signOut`, `homeGreeting` (with `{name}` param), `homeRecentWorkoutLabel`, `homeRecentWorkoutError`, `homeRetry`, `profileComingSoon` — English/Spanish values per `contracts/app-shell.md` i18n table
- [x] T003 [P] Create `src/modules/home/types/index.ts` — export `ShellUser` type (`id: string`, `displayName: string`, `avatarUrl: string | null`); create stub `src/modules/home/index.ts` barrel (empty exports for now, filled in T009/T019)

**Checkpoint**: Module dirs exist; i18n keys available; ShellUser type defined.

---

## Phase 2: Foundational — App Shell Infrastructure

**Purpose**: Convert `(app)/layout.tsx` to Server Component and create AppShell Client Component. This restores QueryClientProvider and unblocks all user stories.

**⚠️ CRITICAL**: No user story work can begin until T004 and T005 are complete — they own the QueryClient mount and the authenticated layout structure.

- [x] T004 Create `src/modules/home/components/AppShell.tsx` — `'use client'`; props: `{ user: ShellUser; children: React.ReactNode }`; owns `QueryClient` via `useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } } }))`; renders `<QueryClientProvider client={queryClient}><div className="flex min-h-screen flex-col"><main className="flex-1 pb-16">{children}</main></div></QueryClientProvider>`; BottomNav wired in T008; `user` prop stored but not forwarded yet (used in US4)
- [x] T005 Refactor `src/app/(app)/layout.tsx` to Server Component: remove `'use client'`, `useState`, `usePathname`, `QueryClientProvider`, and the inline `NAV_ITEMS`/nav JSX; import `AppShell` from `@/modules/home`; render `<AppShell user={{ id: '', displayName: '', avatarUrl: null }}>{children}</AppShell>` as placeholder (real auth + ShellUser added in T006); keep file as `async` Server Component ready for T006's `await` call

**Checkpoint**: App renders without crash on `/workout` and `/history`. QueryClientProvider restored. Layout is Server Component (`npm run build` passes).

---

## Phase 3: User Story 3 — Auth Gate (Priority: P1)

**Goal**: Every `(app)` route is protected — unauthenticated users always redirect to `/login`.

**Independent Test**: Open incognito → navigate to `/workout` → verify redirect to `/login`. Log in → verify `router.push('/')` lands on `/` (may 404 until T015, but redirect itself is correct).

- [x] T006 [US3] Update `src/app/(app)/layout.tsx` auth gate: add `import { createServerClient } from '@/lib/supabase/server'` and `import { redirect } from 'next/navigation'`; call `const { data: { user } } = await createServerClient().auth.getUser()`; if `!user` call `redirect('/login')`; derive `ShellUser`: `{ id: user.id, displayName: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User', avatarUrl: user.user_metadata?.avatar_url ?? null }`; pass real `shellUser` to `<AppShell user={shellUser}>`

**Checkpoint**: Unauthenticated access to any `(app)` route redirects to `/login`. Authenticated users pass through. Session preserved on page refresh.

---

## Phase 4: User Story 1 — Bottom Navigation (Priority: P1)

**Goal**: 4-tab persistent bottom nav bar with correct active state, ARIA, and visual distinction beyond color.

**Independent Test**: Log in → verify BottomNav renders with Home/Workout/History/Profile tabs → tap each tab → verify active tab highlights (accent color, heavier icon, semibold label) → tap active tab again → verify scroll-to-top behavior (no extra nav push) → verify nav visible on nested screens (e.g. `/history/[sessionId]`).

- [x] T007 [US1] Create `src/modules/home/components/BottomNav.tsx` — `'use client'`; define `NAV_TABS` constant: `[{ href: '/', labelKey: 'navHome', Icon: Home }, { href: '/workout', labelKey: 'navWorkout', Icon: Dumbbell }, { href: '/history', labelKey: 'history', Icon: History }, { href: '/profile', labelKey: 'navProfile', Icon: User }]` (icons from `lucide-react`); use `usePathname()` for active detection: Home tab uses `pathname === '/'`, others use `pathname.startsWith(href)`; active styles: `text-gym-accent font-semibold`; inactive styles: `text-gym-muted font-normal`; active icon: `strokeWidth={2.5}`; inactive icon: `strokeWidth={1.5}`; each `<Link>` gets `aria-current={active ? 'page' : undefined}` and `className="flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[44px] text-xs transition-colors"`; icons get `aria-hidden="true"`; wrap all links in `<nav aria-label="Main navigation" className="fixed bottom-0 left-0 right-0 h-16 border-t border-gym-border bg-gym-surface"><div className="flex h-full">`; add `onClick` handler on active tab link: `if (active) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }`
- [x] T008 [US1] Wire BottomNav into `src/modules/home/components/AppShell.tsx`: add `import { BottomNav } from './BottomNav'`; render `<BottomNav />` inside the layout div, after `<main>`, so the full shell is: `<QueryClientProvider>...<main className="flex-1 pb-16">{children}</main><BottomNav /></QueryClientProvider>`
- [x] T009 [P] [US1] Update `src/modules/home/index.ts` barrel: export `AppShell`, `BottomNav`; export type `ShellUser` from `./types`

**Checkpoint**: 4-tab nav visible and functional on all authenticated routes. Active tab highlighted with color + icon weight + label weight. Scroll-to-top on re-tap. ARIA labels correct. Renders at 375px without overflow.

---

## Phase 5: User Story 2 — Home Dashboard (Priority: P1)

**Goal**: Home screen at `/` shows recent workout summary (or empty state) and a persistent Start Workout CTA.

**Independent Test**: Log in → land on `/` → verify Start Workout button visible → verify either RecentWorkoutCard (if sessions exist) or empty state message renders → verify skeleton shows briefly while loading → verify error state if network is blocked.

- [x] T010 [P] [US2] Create `src/modules/home/hooks/use-recent-workout.ts` — `import { useMemo } from 'react'`; `import { useQuery } from '@tanstack/react-query'`; `import { createClient } from '@/lib/supabase/client'`; `import { fetchHistoryList } from '@/modules/workout-history/services/history-supabase'`; `import type { WorkoutHistorySummary } from '@/modules/workout-history/types'`; `const supabase = useMemo(() => createClient(), [])`; queryKey: `['home', 'recent-workout', userId]`; queryFn: `async () => { const result = await fetchHistoryList({ supabase, userId, limit: 1 }); if (result.error) throw new Error(result.error); return result.data?.[0] ?? null }`; destructure and return `{ data, isLoading, isError, refetch }` from `useQuery` — `refetch` is required by T014's retry button
- [x] T011 [P] [US2] Create `src/modules/home/components/StartWorkoutCTA.tsx` — `'use client'`; `import { useI18n } from '@/i18n/client'`; `import Link from 'next/link'`; render `<Link href="/workout" className="flex h-11 w-full items-center justify-center rounded-lg bg-gym-accent font-semibold text-white active:scale-[0.98] transition-all">{t('startWorkout')}</Link>`
- [x] T012 [P] [US2] Create `src/modules/home/components/RecentWorkoutSkeleton.tsx` — `'use client'`; renders a single card-height skeleton matching RecentWorkoutCard layout using `animate-pulse` on `div` elements with `bg-gym-surface-2` fill; approximate height: `h-24 rounded-xl`
- [x] T013 [US2] Create `src/modules/home/components/RecentWorkoutCard.tsx` — `'use client'`; props: `{ session: WorkoutHistorySummary }`; `import { useI18n } from '@/i18n/client'`; display: date from `new Date(session.startedAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })` as title; show duration (`Math.round(session.durationSeconds / 60)` min), `session.totalVolume` (or `—` if null), `session.totalSets` sets, `session.exerciseCount` exercises using `t('duration')`, `t('volume')`, `t('sets')`, `t('exercises')` labels; wrap in `<div className="rounded-xl border border-gym-border bg-gym-surface-2 p-4">`
- [x] T014 [US2] Create `src/modules/home/components/RecentWorkoutSection.tsx` — `'use client'`; props: `{ userId: string }`; `import { useI18n } from '@/i18n/client'`; `import { useRecentWorkout } from '../hooks/use-recent-workout'`; render: if `isLoading` → `<RecentWorkoutSkeleton />`; if `isError` → error div with `t('homeRecentWorkoutError')` + retry `<button onClick={() => refetch()}>` with `t('homeRetry')`; if `data === null` → empty state div with `t('historyEmpty')` + `t('historyEmptyCtaStart')` styled as muted text; if `data` → `<div className="flex flex-col gap-1"><p className="text-xs font-medium uppercase tracking-wide text-gym-muted">{t('homeRecentWorkoutLabel')}</p><RecentWorkoutCard session={data} /></div>`; also destructure `refetch` from `useRecentWorkout` for the retry handler
- [x] T015 [US2] Create `src/app/(app)/page.tsx` Home Server Component and delete `src/app/page.tsx`: new file reads `const { data: { user } } = await createServerClient().auth.getUser()` (user is guaranteed non-null by T006 layout gate); extract `userId = user!.id`; render `<div className="flex flex-col gap-6 px-4 pt-6 pb-4"><StartWorkoutCTA /><RecentWorkoutSection userId={userId} /></div>`; import both from `@/modules/home`; delete `src/app/page.tsx` in same task

**Checkpoint**: Navigate to `/` after login → Home screen renders with Start Workout CTA and either recent workout card or empty state. Skeleton shows during load. Error state shows with retry on network failure.

---

## Phase 6: User Story 4 — User Identity + Sign Out (Priority: P2)

**Goal**: Home header shows display name greeting and a sign-out button that destroys the session.

**Independent Test**: Log in with known account → verify display name (or email prefix fallback) in Home header → tap sign-out → verify redirect to `/login` → verify navigating back to `/workout` redirects to `/login`.

- [x] T016 [US4] Create `src/modules/home/components/HomeHeader.tsx` — `'use client'`; props: `{ displayName: string }`; `import { useI18n } from '@/i18n/client'`; `import { useRouter } from 'next/navigation'`; `import { createClient } from '@/lib/supabase/client'`; `import { LogOut } from 'lucide-react'`; render `<header className="flex items-center justify-between px-4 pt-6 pb-2">`; left: `<p className="text-base font-semibold text-gym-text">{t('homeGreeting', { name: displayName })}</p>`; right: sign-out `<button type="button" onClick={handleSignOut} className="flex items-center gap-1.5 text-xs text-gym-muted" aria-label={t('signOut')}><LogOut className="h-4 w-4" aria-hidden="true" /><span>{t('signOut')}</span></button>`; `handleSignOut`: `async () => { await createClient().auth.signOut(); router.push('/login') }`
- [x] T017 [US4] Update `src/app/(app)/page.tsx` to render HomeHeader: add `import { HomeHeader } from '@/modules/home'`; read `displayName` from session: `const displayName = user!.user_metadata?.full_name ?? user!.email?.split('@')[0] ?? 'User'`; add `<HomeHeader displayName={displayName} />` as first child before `StartWorkoutCTA`; export `HomeHeader` from `src/modules/home/index.ts`

**Checkpoint**: Home shows "Hi, [name]" (or "Hi, [email prefix]") in header. Sign-out button present. Tapping it redirects to `/login` and blocks re-entry.

---

## Phase 7: User Story 5 — Profile Tab Stub (Priority: P2)

**Goal**: Profile tab navigates to a placeholder screen without errors. BottomNav stays visible and Profile tab is highlighted active.

**Independent Test**: Tap Profile tab → placeholder screen loads with coming-soon message → BottomNav visible → Profile tab highlighted active → tap another tab → navigates cleanly.

- [x] T018 [US5] Create `src/app/(app)/profile/page.tsx` — `'use client'`; `import { useI18n } from '@/i18n/client'`; render `<main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center"><p className="text-sm text-gym-muted">{t('profileComingSoon')}</p></main>`

**Checkpoint**: Profile tab navigates to stub. BottomNav shows Profile as active. No 404, no crash.

---

## Phase 8: Polish & DoD Validation

**Purpose**: Barrel completion, build verification, constitution DoD sign-off.

- [x] T019 Update `src/modules/home/index.ts` — export all public symbols: `AppShell`, `BottomNav`, `HomeHeader`, `RecentWorkoutCard`, `RecentWorkoutSection`, `RecentWorkoutSkeleton`, `StartWorkoutCTA`; `export { useRecentWorkout } from './hooks/use-recent-workout'`; `export type { ShellUser } from './types'`
- [x] T020 Run `npm run build` — verify zero TypeScript errors; fix any type errors before proceeding
- [x] T021 Manual 375px DoD check — verify all acceptance scenarios: (1) 4 tabs visible at 375px without overflow; (2) active tab: accent color + heavier icon strokeWidth + semibold label; (3) Home screen renders at 375px without horizontal scroll; (4) all nav tap targets ≥ 44px; (5) sign-out redirects to login; (6) unauthenticated access redirects to login; (7) session preserved on refresh; (8) profile stub loads cleanly; (9) skeleton visible briefly on Home; (10) error state shown when network blocked on Home

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately; T002 and T003 are parallel
- **Phase 2 (Foundational)**: Depends on Phase 1 completion — **BLOCKS all user stories**
- **Phase 3 (US3)**: Depends on Phase 2 — adds auth logic to already-refactored layout
- **Phase 4 (US1)**: Depends on Phase 2 (AppShell must exist to wire BottomNav into)
- **Phase 5 (US2)**: Depends on Phase 2 (QueryClientProvider), Phase 3 (userId from auth), Phase 4 (nav visible) — T010/T011/T012 can start in parallel after Phase 2
- **Phase 6 (US4)**: Depends on Phase 5 (home page exists), Phase 3 (displayName from ShellUser)
- **Phase 7 (US5)**: Depends on Phase 4 (BottomNav Profile tab must link somewhere)
- **Phase 8 (Polish)**: Depends on all phases complete

### User Story Dependencies

| Story | Depends on | Can parallel with |
|-------|-----------|-------------------|
| US3 (auth gate) | Phase 2 | US1 |
| US1 (bottom nav) | Phase 2 | US3 |
| US2 (home dashboard) | US3, US1 | US5 |
| US4 (identity + sign-out) | US2, US3 | US5 |
| US5 (profile stub) | US1 | US2, US4 |

### Parallel Opportunities

- T002 + T003: parallel (different files)
- T010 + T011 + T012: parallel (independent files, all US2 components)
- Phase 3 (T006) + Phase 4 start (T007): parallel after Phase 2 (different files)
- T016 + T018: parallel (different files, US4 and US5)

---

## Parallel Example: Phase 5 (US2)

```
After Phase 2+3 complete, launch in parallel:
  Task T010: use-recent-workout.ts hook
  Task T011: StartWorkoutCTA.tsx component
  Task T012: RecentWorkoutSkeleton.tsx component

Then sequentially:
  Task T013: RecentWorkoutCard.tsx (no dependencies but logical order)
  Task T014: RecentWorkoutSection.tsx (depends on T010, T012, T013)
  Task T015: (app)/page.tsx + delete root page.tsx (depends on T011, T014)
```

---

## Implementation Strategy

### MVP (P1 Stories Only — Phases 1–5)

1. Phase 1: Setup
2. Phase 2: Foundational (app shell infrastructure)
3. Phase 3: US3 Auth gate
4. Phase 4: US1 Bottom nav
5. Phase 5: US2 Home dashboard
6. **STOP**: Build passes, 375px check, all P1 stories testable

### Full Feature (All Stories — Phases 1–8)

1. Complete MVP above
2. Phase 6: US4 User identity + sign-out
3. Phase 7: US5 Profile stub
4. Phase 8: Polish + DoD

---

## Notes

- `[P]` = different files, safe to run concurrently
- `[USN]` = maps to User Story N in `spec.md`
- No test runner configured — DoD is `npm run build` + manual 375px check (T020–T021)
- `WorkoutHistorySummary` has no `name` field — use `startedAt` formatted as date for card title
- `StartWorkoutCTA` is Client Component (needs `useI18n` context from `I18nProvider` in root layout)
- `(app)/page.tsx` and `src/app/page.tsx` cannot coexist — delete old file in T015
- The `history` i18n key already exists — do NOT add `navHistory`; reuse it in BottomNav
