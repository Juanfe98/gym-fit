# Research: Home Screen + Bottom Navigation (App Shell)

## Decision 1: Home Route — `/` vs `/home` vs `/dashboard`

**Decision**: Home route is `/` via `src/app/(app)/page.tsx`. The existing `src/app/page.tsx` is deleted and replaced.

**Rationale**: The root URL is the most natural home destination — no redirect hop after login, cleaner deep-link story, and the middleware already guards `/` for unauthenticated users. The constitution folder layout shows `dashboard/` as a possible sub-route but does not require it. Using `/` is simpler and avoids an extra redirect.

**Migration required**: `src/app/page.tsx` (currently `'use client'` stub with just `t('appName')`) must be deleted. `src/app/(app)/page.tsx` will be created as the Home screen and will be wrapped by `(app)/layout.tsx`.

**Alternatives considered**:
- `/home` — extra segment with no benefit; `/` is universally understood as home
- `/dashboard` — common in admin tools; gym floor apps use root-level home

---

## Decision 2: `(app)/layout.tsx` — Server Component vs Client Component

**Decision**: Refactor `(app)/layout.tsx` into a Server Component. Extract the bottom nav and QueryClient into a separate `AppShell` Client Component.

**Rationale**: Constitution Principle V states "MUST NOT use `'use client'` on layout files unless strictly necessary." The current layout is `'use client'` only because it uses `usePathname()` (for active tab state) and `useState()` (for QueryClient). Both belong in a child Client Component, not the layout. The layout itself only needs to: (1) read the session server-side, (2) extract user identity, (3) render the shell structure with `{children}`. The `BottomNav` + `QueryClientProvider` become a `AppShell` Client Component that receives `userId` and `displayName` as props.

**Impact**: The `(app)/layout.tsx` refactor is the central piece of this feature. All other additions (Home screen, Profile stub, sign-out) depend on it being correct.

**Alternatives considered**:
- Keep layout as `'use client'`, add `useEffect` for session reads — violates constitution, forces client-side auth check which is slower and less secure
- Separate layout per route — over-engineered; one shared layout is correct for the app shell pattern

---

## Decision 3: Auth Gate — Middleware vs Layout Server-Side Check

**Decision**: Rely on middleware as the primary auth gate. The layout adds a secondary server-side check (belt-and-suspenders) by calling `createServerClient().auth.getUser()` and redirecting if no user.

**Rationale**: The existing `src/middleware.ts` already redirects unauthenticated requests to `/login`. However, middleware operates before the React tree renders and cannot inject user data into the layout. The layout's server-side `getUser()` call serves a dual purpose: (1) provides user identity to the shell without an additional client-side fetch, (2) acts as a safety net if middleware is misconfigured. This pattern is the standard Supabase + Next.js App Router approach.

**Alternatives considered**:
- Middleware-only — cannot pass user data to Server Components without an additional fetch; would require a client-side `useUser` hook which adds latency and complexity
- Client-side auth check in layout — violates constitution, causes flash of unauthenticated content

---

## Decision 4: Sign-Out Implementation

**Decision**: Client-side sign-out using the Supabase browser client in a Client Component button, followed by `router.push('/login')`.

**Rationale**: Sign-out does not require server-side auth context — it simply invalidates the client session cookie. A Server Action would add unnecessary round-trip overhead. The pattern `createClient().auth.signOut()` is the idiomatic Supabase approach for browser-initiated sign-out. After sign-out, `router.push('/login')` ensures the user immediately sees the login screen; the middleware will block any back-navigation.

**Alternatives considered**:
- Server Action — correct but overkill; adds a form + action for a stateless operation
- `router.replace('/login')` — also acceptable; `push` is fine here since the user is intentionally leaving

---

## Decision 5: Recent Workout Data on Home Screen

**Decision**: Home screen fetches the most recent completed session using a dedicated TanStack Query hook in `src/modules/home/hooks/use-recent-workout.ts`, which calls the existing `history-supabase.ts` service with a `limit: 1` query.

**Rationale**: The workout-history module already has `history-supabase.ts` with a `fetchHistoryList` function. Rather than duplicating the query, the home module imports the service and creates a lightweight hook. This keeps query logic co-located in the home module (per constitution module structure) while reusing the data layer.

**Alternatives considered**:
- Import `useHistoryList` hook directly from workout-history module — couples Home to history module's hook; home only needs 1 record, not a paginated list
- Re-implement the Supabase query in home module — code duplication

---

## Decision 6: User Display Name Source

**Decision**: Display name comes from `user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User'`. Read server-side in `(app)/layout.tsx` and passed as prop to the shell.

**Rationale**: No `profiles` table exists in the current schema. Supabase email/password auth stores the user's name (if provided at signup) in `user.user_metadata.full_name`. Email prefix is the fallback — it's identifiable without being blank. The hardcoded `'User'` handles edge cases where email is also unavailable (e.g., OAuth without email scope, though not in MVP).

**Alternatives considered**:
- Fetch from a `profiles` table — doesn't exist yet; creating one is out of scope for this feature
- Client-side `useUser()` hook — adds latency; server-side read is free since the layout already calls `getUser()`

---

## Decision 7: Profile Stub Screen

**Decision**: `src/app/(app)/profile/page.tsx` — simple Server Component rendering a centered "Profile coming soon" message using existing design tokens. No module created; stub lives directly in the route file.

**Rationale**: The profile feature is not planned. Creating a `modules/profile/` directory for a placeholder screen would be premature structure. A single page file is the minimum correct implementation.

**Alternatives considered**:
- `modules/profile/` module with component — violates constitution Principle V (YAGNI)
- 404 page — wrong; the tab should navigate somewhere that doesn't crash the shell
