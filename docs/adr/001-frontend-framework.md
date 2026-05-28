# ADR-001: Frontend Framework — Next.js over Astro

**Date**: 2026-05-27  
**Status**: Accepted  
**Deciders**: Juan Felipe Montana  

---

## Context

The project started as a static routine viewer (`001-goal-routine-generator`) built with Astro.
The product scope has expanded to a full user-facing gym tracker (`002-gym-planner-app`) requiring:

- Authentication and session management on every route
- User-owned data (workout sessions, sets, plans, progress, goals)
- Complex client-side state: active workout session, rest timer, optimistic UI
- Offline-first set logging with local persistence and server sync
- Dynamic pages: workout history, progress charts, calendar

Astro's design philosophy is static-first with optional islands of interactivity. Building an
auth-gated, data-driven application in Astro means fighting the framework at every step:
every page needs a client island for auth guards, data fetching can't use the App Router
caching model, and the mental model of "mostly static + a few islands" breaks down when
every screen is dynamic.

---

## Decision

**Use Next.js 15+ (App Router) as the frontend framework.**

---

## Rationale

| Criterion | Astro | Next.js |
|---|---|---|
| Auth-gated routing | Manual islands + middleware workarounds | Native middleware + route groups |
| Server-side data fetch | SSR adapter needed, non-standard | RSC + Server Actions, first-class |
| Client state (active session) | Every interactive component needs `client:load` | Standard React model |
| Offline/PWA support | Possible but no first-class tooling | `next-pwa` or native service worker |
| TypeScript + Zod forms | Works but islands fragment the model | React Hook Form + Zod, unified |
| Supabase integration | Adapter-based, limited RSC support | Supabase official Next.js SDK, SSR |
| Tailwind v4 | ✅ Supported | ✅ Supported |
| Vercel deployment | ✅ Static adapter | ✅ Native, no adapter config needed |
| Team / ecosystem | Smaller gym-app community | Dominant choice for React SaaS apps |

Next.js App Router is the industry standard for exactly this product category: authenticated,
data-rich, mobile-first SaaS web apps. The overhead of working against Astro's static model
would compound on every module.

---

## Consequences

- **Breaking**: Existing Astro components (`.astro` files) must be migrated to React (`.tsx`).
- **Positive**: Supabase SSR auth works natively with Next.js middleware.
- **Positive**: TanStack Query, Zustand, React Hook Form, Zod all integrate without friction.
- **Positive**: Vercel deployment is first-class with no adapter configuration.
- **Neutral**: Static exercise data files (`src/data/exercises/`, `src/data/routines/`) are reused as-is.
- **Neutral**: Tailwind CSS v4 config via `@theme` in `global.css` carries over unchanged.
- **Work required**: Project scaffold must be replaced. Existing `.astro` components port to `.tsx`.

---

## Alternatives Considered

### Remix (React Router v7)
Strong SSR model and progressive enhancement. Less ecosystem momentum than Next.js for this
use case. Supabase integration less documented. Not chosen.

### React SPA (Vite + React Router)
Simpler setup, fully client-side. No SSR = poor initial load on mobile. No server-side auth
context. Offline complexity is higher without server rendering. Not chosen.

### React Native (Expo)
Native mobile experience. Better offline primitives. Requires separate codebase from any
web presence. Much higher initial investment. Deferred to future if native mobile is needed.

### Keep Astro
Viable for the original static use case. Architecturally incorrect for auth + user data.
Fighting the framework increases delivery risk on every module. Rejected.
