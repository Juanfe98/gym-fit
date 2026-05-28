<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 2.0.0
Added sections:
  - Principle I rewritten: Static-First → User-First Architecture (BREAKING)
  - Principle VI added: Offline-First Session Tracking
  - Architecture & Stack Constraints fully updated (framework, auth, DB, state)
  - Definition of Done updated for auth/data/offline requirements
Modified principles:
  - III: Content Integrity — narrowed to exercise library only, not all data
  - IV: External Media Isolation — unchanged
  - V: Minimal, Reviewable Changes — unchanged
Removed: static output mode, no-backend constraint, no-localStorage rule
Templates requiring updates:
  ✅ plan-template.md — Constitution Check section now references v2.0.0 constraints
  ✅ specs/003-workout-session-tracking/plan.md — gate failure resolved, re-plan required
Deferred TODOs: None
Rationale for breaking change: Product scope expanded from static routine viewer (001)
  to full user-facing gym tracker (002) requiring auth, user data, and offline sync.
  Astro static-first is architecturally incompatible with the new product requirements.
-->

# Gym Planner Constitution

## Core Principles

### I. User-First Architecture (NON-NEGOTIABLE)

The app is a full-stack user-facing application. Every authenticated user owns their data.
The frontend is a dynamic, auth-gated web app. The backend is provided exclusively by a BaaS
(Supabase) — no custom backend server for MVP.

- MUST use Next.js App Router as the frontend framework — not Astro
- MUST use Supabase for auth, database (Postgres), and file storage
- MUST isolate all user data behind Supabase Row-Level Security (RLS) policies
- MUST NOT introduce a custom backend server or API layer beyond Supabase and Next.js
  Server Actions / Route Handlers where strictly necessary
- Static exercise library data MAY still live in `src/data/` as TypeScript files for
  performance, but MUST be enriched with user-specific data (favorites, custom exercises)
  via Supabase at runtime
- MUST deploy to Vercel using the Next.js adapter (not static output)

**Rationale**: The product's core value is personal progress tracking over time. A static
site cannot store user sessions, workout logs, or personal records. Supabase provides auth,
Postgres, and RLS in a single managed service — eliminating the need for a custom server
while keeping data ownership and security sound.

---

### II. Mobile-First UI (NON-NEGOTIABLE)

The primary usage context is a gym floor — one hand, portrait orientation, variable lighting.
Every UI decision must pass the gym-floor test first.

- MUST design and test at 375px viewport width before any wider breakpoint
- MUST ensure all interactive elements have a minimum 44×44px tap target
- MUST use a minimum 16px body font size — no zooming required to read content
- MUST NOT rely on hover states for primary interactions (no hover-only affordances)
- Exercise media MUST render usably at mobile widths without horizontal scroll
- High contrast is preferred — assume variable lighting conditions
- Bottom navigation pattern MUST be used for primary mobile navigation

**Rationale**: The app is a gym-floor tool. A desktop-first approach produces a product
that fails at its primary use case.

---

### III. Exercise Content Integrity

The static exercise library is manually authored and curated. It is a reference layer,
not user-generated content.

- MUST hardcode the base exercise catalog in `src/data/exercises/` as TypeScript files
- Form cues, common mistakes, and rationale text MUST target intermediate-to-advanced level
- MUST NOT commit placeholder or lorem ipsum content to the exercise library
- Adding or modifying base exercise content requires manual review — treat as product copy
- User-created custom exercises are stored in Supabase, not in `src/data/`

**Rationale**: The base exercise library is a product asset. Generic or auto-generated copy
breaks trust with the target audience. User custom exercises are separate from this concern.

---

### IV. External Media Isolation

ExerciseDB (and any future media provider) is a runtime enhancement, not a dependency.
The app MUST function as a complete product without it.

- Exercise cards MUST render all text content without any external API call
- GIFs and muscle diagram data MAY be fetched from ExerciseDB at runtime, but MUST have
  a visible fallback if the fetch fails or times out
- MUST NOT use ExerciseDB data to determine exercise selection or content decisions
- ExerciseDB integration MUST be isolated behind `src/services/exercisedb.ts`
- MUST NOT commit API keys or credentials to the repository

**Rationale**: ExerciseDB is a free third-party service with rate limits and no SLA.
Coupling the core UX to it creates an unreliable product. It is a media layer only.

---

### V. Minimal, Reviewable Changes (NON-NEGOTIABLE)

Each change MUST be the smallest correct implementation of the requirement. No scope creep.

- MUST NOT refactor surrounding code while implementing a feature unless required
- MUST NOT add speculative error handling or validation for impossible states
- MUST NOT add comments explaining WHAT the code does — only WHY when non-obvious
- MUST NOT add features for hypothetical future requirements (YAGNI)
- Three similar lines is better than a premature abstraction
- MUST NOT install new dependencies without explicit user approval — propose first, wait

**Rationale**: This is a focused MVP built task-by-task. Over-engineering compounds across
sessions and makes future changes harder to reason about.

---

### VI. Offline-First Session Tracking (NON-NEGOTIABLE)

The active workout session is the most critical user flow. Network availability MUST NOT
block set logging at any point.

- Active workout session state MUST be persisted to IndexedDB (via Dexie.js) on every change
- IndexedDB write MUST be the primary save path — Supabase sync is secondary
- MUST display a sync status indicator when offline
- MUST auto-sync pending session data to Supabase when connectivity returns
- MUST NOT show a loading spinner or block the UI while waiting for a Supabase write
  during an active session
- Completed sessions MUST NOT be re-synced if already confirmed in Supabase
- App MUST restore an in-progress session from IndexedDB on next launch if force-quit

**Rationale**: Gyms have poor connectivity. Losing a workout mid-session is the highest-severity
UX failure. IndexedDB provides durable local storage that survives app restart, unlike
in-memory state or sessionStorage.

---

## Architecture & Stack Constraints

### Locked Stack

The following are locked and MUST NOT be changed without explicit user instruction:

| Concern        | Tool                     | Notes                                               |
|----------------|--------------------------|-----------------------------------------------------|
| Framework      | Next.js 15+ (App Router) | Dynamic routing, server actions, auth middleware    |
| Styling        | Tailwind CSS v4          | Config via CSS `@theme`, no tailwind.config.ts      |
| Language       | TypeScript               | strict mode enabled                                 |
| Auth           | Supabase Auth            | Email/password primary; Google/Apple future         |
| Database       | Supabase (Postgres)      | RLS required on all user tables                     |
| File Storage   | Supabase Storage         | Future: user avatars, exercise media uploads        |
| Offline Store  | Dexie.js (IndexedDB)     | Active session only; not a full offline DB          |
| Server State   | TanStack Query v5        | All Supabase data reads go through TQ               |
| Client State   | Zustand                  | Active session draft, UI state, offline queue       |
| Forms          | React Hook Form + Zod    | All user input forms                                |
| Package Mgr    | npm                      | Default; do not switch to pnpm/yarn without approval|
| Deployment     | Vercel                   | Next.js adapter; no static output mode              |
| Media API      | ExerciseDB (free)        | Runtime only, isolated, replaceable                 |

### File & Folder Conventions

```
src/
  app/                        ← Next.js App Router pages and layouts
    (auth)/                   ← Auth route group (login, signup, reset)
    (app)/                    ← Authenticated route group
      layout.tsx              ← Auth guard + nav shell
      dashboard/
      workout/
      plans/
      exercises/
      progress/
      goals/
      calendar/
      profile/
      settings/
  modules/                    ← Feature modules (co-located logic)
    auth/
    onboarding/
    workout-session/
    exercise-library/
    workout-plans/
    progress/
    goals/
    calendar/
    profile/
    settings/
  shared/
    components/               ← Reusable UI primitives (Button, Input, Card, etc.)
    hooks/                    ← Shared hooks
    utils/                    ← Pure utility functions
    types/                    ← Shared domain types
    validation/               ← Zod schemas
  data/
    exercises/                ← Static exercise catalog (TypeScript)
    routines/                 ← Hardcoded routine templates (TypeScript)
  services/
    exercisedb.ts             ← ExerciseDB integration (media only)
    offline-db.ts             ← Dexie.js schema and instance
  lib/
    supabase/
      client.ts               ← Browser Supabase client
      server.ts               ← Server-side Supabase client (Server Actions/RSC)
      middleware.ts            ← Auth session refresh middleware
  styles/
    global.css                ← Tailwind tokens and global styles
```

- Tailwind tokens MUST be defined in `src/styles/global.css` under `@theme`
- Component filenames MUST be PascalCase `.tsx` files
- Each feature module MUST export from an `index.ts` barrel
- Supabase client MUST use the server client in Server Components and Route Handlers;
  browser client MUST be used in Client Components only

### Module Structure

Each feature module follows this layout:

```
modules/feature-name/
  components/         ← UI components for this feature
  hooks/              ← TanStack Query hooks + Zustand slices
  services/           ← Supabase queries for this feature
  types/              ← Feature-specific TypeScript types
  validation/         ← Zod schemas for forms
  utils/              ← Feature-specific pure utilities
  index.ts            ← Public exports
```

### Next.js-Specific Rules

- Route groups MUST separate auth routes `(auth)` from app routes `(app)`
- `(app)/layout.tsx` MUST verify session and redirect unauthenticated users
- Server Actions MUST be used for mutations that require server-side auth context
- Server Components MUST be used for initial data fetches where possible (reduces client JS)
- Client Components (`"use client"`) MUST be used for: forms, active workout tracking,
  rest timer, and any component requiring `useState` / `useEffect`
- MUST NOT use `"use client"` on layout files unless strictly necessary
- Image optimization: use `next/image` for all user-uploaded and static images

---

## Definition of Done

A task is complete when ALL of the following are true:

1. `npm run build` passes with zero TypeScript errors
2. Changed UI is visually verified at 375px viewport width
3. New Supabase tables have RLS policies defined and tested
4. If offline behavior is touched: local persistence verified by testing with network disabled
5. If ExerciseDB integration is touched: fallback state is manually verified
6. No new dependency added without prior user approval
7. No `TODO` or placeholder content committed
8. Diff is minimal — no incidental refactors, cleanups, or unrelated changes

---

## Governance

- This constitution supersedes all other practices for the Gym Planner project
- It is read by AI agents at the start of every planning and implementation session
- Amendments require: identifying the violated or missing principle, proposing the updated
  rule, bumping the version per semantic versioning, and running `npm run build` after
  any code changes
- All `specs/###-feature/plan.md` Constitution Check sections MUST reference this document
- When a rule here conflicts with a CLAUDE.md instruction, the more specific rule wins;
  flag the conflict if ambiguous

**Version**: 2.0.0 | **Ratified**: 2026-05-27 | **Last Amended**: 2026-05-27  
**Previous Version**: 1.0.0 (static Astro site — superseded by product scope expansion)
