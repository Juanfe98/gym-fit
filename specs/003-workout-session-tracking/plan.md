# Implementation Plan: Workout Session Tracking

**Branch**: `003-workout-session-tracking` | **Date**: 2026-05-27 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/003-workout-session-tracking/spec.md`

## Summary

Build the core daily-use workout session flow: start session → add exercises → log sets (weight/reps) → finish → session summary. Must work offline with local persistence and auto-sync. Includes rest timer, PR detection, and session cancellation.

## Technical Context

**Language/Version**: TypeScript (strict mode) — locked by constitution  
**Primary Dependencies**: Astro + Tailwind CSS v4 — locked by constitution  
**Storage**: NEEDS CLARIFICATION — see Constitution Check below  
**Testing**: npm run build (TypeScript) + manual visual at 375px — per Definition of Done  
**Target Platform**: Mobile-first web (375px primary), static site deployment on Vercel  
**Project Type**: Web application (static-first per constitution)  
**Performance Goals**: Log a set in <5s; session summary loads in <1s (per spec SC-001, SC-005)  
**Constraints**: Offline-capable, no data loss on disconnect, 375px minimum viewport  
**Scale/Scope**: Per-user session history, set logs, PR tracking — see gate failure below

---

## Constitution Check

*GATE: Must pass before Phase 0 research.*

> ⛔ **GATE FAILURE — Planning cannot proceed without resolution.**

### Violations Detected

The workout session tracking spec (003) directly conflicts with **Constitution Principle I: Static-First Architecture (NON-NEGOTIABLE)**.

| Spec Requirement | Constitution Rule Violated |
|---|---|
| User authentication (FR-001 via parent spec) | "no backend, no database, no user data storage" |
| Persist session logs per user (FR-018, FR-028) | "MUST NOT store user data — no localStorage for user state" |
| Offline-first with local save + server sync (FR-027–FR-031) | "zero server functions for MVP" |
| Personal records computed from session history (FR-033–FR-036) | "Every page is pre-rendered at build time" |
| Session history accessible across devices (FR-040) | "no backend, no database" |

The constitution states: *"The app has no server-side logic beyond static asset delivery. There is no backend, no database, and no user data storage."*

The workout session tracking module fundamentally requires all three: user-owned data, persistent storage, and (for cross-device sync) a backend.

### Root Cause

The constitution was written for the original `001-goal-routine-generator` scope — a **static routine reference tool** with hardcoded content. The umbrella spec (`002-gym-planner-app`) defines a full **user-data product** with accounts, session logs, PR history, and offline sync. These are different product categories.

### What Must Happen Before Planning Can Continue

**Option A — Amend the Constitution (Recommended)**

Ratify a new version of `.specify/memory/constitution.md` that replaces Principle I with a revised architecture supporting user data. This requires defining:

1. Auth strategy (e.g., Supabase Auth, Clerk, Firebase Auth)
2. Data persistence layer (e.g., Supabase/Postgres, PlanetScale, Firebase Firestore)
3. Offline storage strategy (e.g., IndexedDB via Dexie.js, localStorage for lightweight state)
4. Sync strategy (e.g., optimistic updates, background sync via Service Worker)
5. Whether the static-site / Vercel deployment model still applies or shifts to a full-stack host

Run `/speckit-constitution` to amend.

**Option B — Re-scope This Module to Static-Compatible**

Constrain workout session tracking to **in-memory / single-session only** with no persistence across page loads. No user account, no history, no cross-device sync. Users export/copy their session data manually.

This delivers almost no value and defeats the product goal. Not recommended.

**Option C — Hybrid (Static shell + external BaaS)**

Keep Astro as the frontend framework (mobile-first, Tailwind, TypeScript) but allow a Backend-as-a-Service (BaaS) like Supabase or Firebase for auth + data. Removes the "no backend" constraint while keeping the frontend stack locked.

This is effectively Option A with a narrower scope of changes to the constitution.

---

> **Planning is paused.** Resolve the constitution conflict first, then re-run `/speckit-plan`.

---

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| User data storage | Sessions, sets, PRs are inherently per-user persistent data | Static data files cannot store user-generated workout logs |
| Backend or BaaS | Offline sync requires a server-side source of truth | localStorage alone cannot sync across devices or survive app reinstall |
| Auth | Session data must be scoped to a user | Anonymous data is not useful for progress tracking over time |
