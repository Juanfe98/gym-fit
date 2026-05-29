# Quickstart: Exercise Library

## Prerequisites

- Active Supabase project with migration `003_user_exercise_favorites.sql` applied
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set in `.env.local`
- `npm install` (no new packages — all dependencies already present)

## Migration

```bash
supabase migration new user_exercise_favorites
# paste contents of supabase/migrations/003_user_exercise_favorites.sql
supabase db push
```

## Dev Server

```bash
npm run dev
# open http://localhost:3000/exercises
```

## Manual Test Paths

### US1 — Browse & Search
1. Open `/exercises` → full list renders
2. Type `squat` → results filter in real-time
3. Select `upper legs` body part chip → further filtered
4. Select `barbell` equipment chip → further filtered
5. Clear all → full list returns
6. Scroll to bottom → more exercises load (pagination)

### US2 — Detail
1. Tap any exercise → `/exercises/[id]` opens
2. GIF loads (skeleton shows first)
3. Muscle diagram highlights primary + secondary muscles
4. Tap a catalog exercise (e.g. `EIeI8Vf` = Barbell Bench Press) → form cues, mistakes, rationale visible
5. Tap a non-catalog exercise → no coaching sections rendered
6. Simulate GIF failure: open DevTools → Block `static.exercisedb.dev` → reload → fallback placeholder shows
7. Tap back → list scroll position restored

### US3 — Favorites
1. On any detail page, tap heart icon → fills immediately (optimistic)
2. Navigate away and back → still filled
3. Return to list → heart indicator visible on that exercise row
4. Apply Favorites filter → only favorited exercises show
5. Un-favorite → heart empties immediately; removed from favorites filter

### US4 — Add to Session
1. Start an active workout session
2. Navigate to Exercise Library → detail page
3. "Add to session" button visible → tap it
4. Toast auto-dismisses after ~2s
5. Navigate to workout → exercise appended
6. With no active session: button not shown

## DoD Checklist

- [ ] `npm run build` passes — zero TypeScript errors
- [ ] All screens render at 375px without horizontal overflow
- [ ] GIF fallback verified (block CDN in DevTools)
- [ ] Favorites persist across page reload (not just in-memory)
- [ ] Add to session works end-to-end
- [ ] Heart icon shows on list rows for favorited exercises
- [ ] Muscle diagram highlights correct muscles
- [ ] All i18n keys present in both `en` and `es`
- [ ] Bottom nav shows Exercises tab; no existing tab removed
- [ ] Migration applied and RLS verified (user A cannot see user B's favorites)
