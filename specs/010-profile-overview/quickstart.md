# Quickstart: User Profile Overview Page

## What this feature delivers

- Replaces the existing `/profile` page with a fitness dashboard overview
- Creates 5 new Supabase tables with RLS for fitness profile data
- Adds stub routes for all 8 edit destination pages
- Adds a `profile` module with services, hooks, and section components

## Prerequisites

- Supabase project linked (`supabase link` done, `.supabase/.temp/linked-project.json` exists)
- Local dev server running or startable with `npm run dev`
- Supabase CLI available (`supabase --version`)

## Run the migration

```bash
# Push migration to remote Supabase project
supabase db push

# Or apply locally if using local Supabase
supabase db reset
```

Migration file: `supabase/migrations/006_user_fitness_profile.sql`

Creates: `user_fitness_preferences`, `user_equipment`, `user_body_info`, `user_limitations`, `user_body_measurements`

## Start dev server

```bash
npm run dev
```

Navigate to `http://localhost:3000/profile` while authenticated.

## Manual verification checklist

1. Visit `/profile` — page loads with skeleton, then renders header + 8 section cards
2. With no data: all 7 data sections show friendly empty states with CTAs
3. Completion indicator shows "Getting started"
4. Each CTA navigates to the correct stub route (no 404)
5. Resize to 375px — all sections stack vertically, no horizontal scroll
6. Keyboard-navigate through all actions — focus rings visible
7. Simulate fetch error (DevTools → Network → block `*.supabase.co`) — error state + retry button appear

## Key files

| File | Purpose |
|------|---------|
| `supabase/migrations/006_user_fitness_profile.sql` | DB schema + RLS |
| `src/app/(app)/profile/page.tsx` | Server Component — auth guard, passes user to screen |
| `src/modules/profile/components/ProfileOverviewScreen.tsx` | Main client component |
| `src/modules/profile/hooks/useProfileOverview.ts` | 5 parallel TQ queries |
| `src/modules/profile/services/profile-service.ts` | All Supabase reads |
| `src/modules/profile/utils/format-enums.ts` | Enum → i18n key maps |
| `src/modules/profile/utils/completion.ts` | Completion score calculation |
| `src/i18n/ui.ts` | All new i18n keys (en + es) |

## Stub pages

All stub pages live at their final routes and render a "Coming soon" card. They accept no props. They exist only so CTAs don't 404.

| Route | File |
|-------|------|
| `/profile/edit` | `src/app/(app)/profile/edit/page.tsx` |
| `/profile/preferences` | `src/app/(app)/profile/preferences/page.tsx` |
| `/profile/equipment` | `src/app/(app)/profile/equipment/page.tsx` |
| `/profile/body` | `src/app/(app)/profile/body/page.tsx` |
| `/profile/limitations` | `src/app/(app)/profile/limitations/page.tsx` |
| `/profile/measurements` | `src/app/(app)/profile/measurements/page.tsx` |
| `/profile/measurements/new` | `src/app/(app)/profile/measurements/new/page.tsx` |
