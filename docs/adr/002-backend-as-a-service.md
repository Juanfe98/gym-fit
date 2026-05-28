# ADR-002: Backend-as-a-Service — Supabase

**Date**: 2026-05-27  
**Status**: Accepted  
**Deciders**: Juan Felipe Montana  

---

## Context

The gym tracker requires:

- User authentication (email/password; Google/Apple future)
- Relational data storage: users, fitness profiles, exercises, plans, sessions, sets, goals, records
- Row-level security so users can only access their own data
- Real-time capabilities (future: live session sharing, coach view)
- File storage (future: user avatars, exercise GIFs)
- No custom backend server for MVP — minimize operational surface

The constitution prohibits a custom backend for MVP. A BaaS provides all of the above
with a managed service layer.

---

## Decision

**Use Supabase as the Backend-as-a-Service.**

---

## Rationale

| Criterion | Supabase | Firebase | PlanetScale + Clerk |
|---|---|---|---|
| Database | Postgres (relational) | Firestore (document) | MySQL (relational) |
| Data model fit | ✅ Excellent — workout sets and plans are relational | ⚠️ Requires denormalization | ✅ Good |
| Auth | Built-in, OAuth2, JWT | Built-in, OAuth2 | Clerk is best-in-class |
| Row-Level Security | ✅ Native Postgres RLS | ❌ Security rules (less expressive) | ⚠️ Application-layer only |
| Offline / local | ❌ No official offline SDK | ✅ Firestore offline cache | ❌ No offline support |
| Next.js SSR SDK | ✅ Official `@supabase/ssr` | ⚠️ Firebase Admin SDK (heavier) | ✅ Clerk has Next.js SDK |
| Open source / self-host | ✅ Fully open source | ❌ Proprietary | ❌ Clerk is proprietary |
| Free tier | Generous (2 projects, 500MB DB) | Generous | Clerk free tier limited |
| Realtime | ✅ Postgres CDC-based | ✅ Native | ❌ Not in PlanetScale |
| Cost at scale | Predictable Postgres pricing | Can spike on reads/writes | Separate auth + DB cost |

Supabase's Postgres database is the correct choice for this data model. Workout sessions,
sets, plans, and goals are inherently relational. RLS at the database level (not application
layer) provides the strongest user data isolation guarantee.

The only weakness vs. Firebase is offline support. This is handled separately by Dexie.js
(ADR-003) — Supabase is the source of truth, not the offline store.

---

## Consequences

- **Positive**: RLS policies enforce user data isolation at the DB layer — no application bugs can leak data.
- **Positive**: Postgres schema fits the relational data model from `docs/gym_tracker_user_facing_app_spec.md` directly.
- **Positive**: Supabase CLI enables local dev with `supabase start` (Docker-based).
- **Positive**: Migrations are SQL files tracked in `supabase/migrations/` — version-controlled and reviewable.
- **Neutral**: Offline sync for session tracking is handled by Dexie.js (ADR-003), not Supabase.
- **Neutral**: Supabase free tier has row limits; production requires a paid plan above ~50K MAU.
- **Work required**: Each table needs an RLS policy. This is non-negotiable per constitution Principle I.

---

## Key Supabase Tables (initial)

```
users (managed by Supabase Auth)
fitness_profiles
exercises (base catalog seeded from src/data, user custom exercises)
workout_plans
workout_plan_days
plan_exercises
workout_sessions
session_exercises
set_logs
personal_records
goals
scheduled_workouts
body_measurements
```

All user-owned tables include `user_id uuid references auth.users` and an RLS policy:
`USING (auth.uid() = user_id)`.

---

## Alternatives Considered

### Firebase (Firestore + Firebase Auth)
Strong offline support (Firestore has a built-in offline cache). However, the document
model requires denormalization of relational data (sets nested in sessions nested in plans),
which makes progress queries and PR calculation significantly more complex. RLS equivalent
is Firestore Security Rules — less expressive than Postgres RLS. Not chosen.

### PlanetScale (MySQL) + Clerk (Auth)
Two separate services with two billing relationships. PlanetScale has no offline support.
Clerk is excellent for auth but adds cost. More moving parts for no meaningful benefit over
Supabase. Not chosen.

### Custom Backend (Node.js/Express or Fastify)
Maximum flexibility but violates the constitution's "no custom backend for MVP" constraint.
Adds infrastructure, deployment, and maintenance overhead. Deferred to post-MVP if Supabase
proves limiting.

### Neon (Postgres) + Supabase Auth
Split DB from auth. More complex setup with no benefit at this scale. Not chosen.
