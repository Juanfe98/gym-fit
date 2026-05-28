# ADR-005: Design Language

**Status:** Accepted  
**Date:** 2026-05-28  
**Deciders:** Product, Engineering

---

## Context

Gym Planner needs a visual identity that:
- Feels serious and performance-oriented, not generic or "AI-generated"
- Works primarily at 375px (in the gym, one hand, gloves)
- Survives a dark environment (gym floors, phone held at arm level)
- Communicates density of data without feeling cluttered
- Scales from the active workout screen (ultra-focused) to analytics (data-rich)

The app competes with Strong, Hevy, and Boostcamp. Those apps succeed because their UI communicates "this is built for serious athletes" — bold numbers, dark surfaces, high-contrast CTAs.

---

## Decision

### Design Style: Athletic Dark

**Core aesthetic:** Steel-black surfaces + athletic orange + condensed type.

Not "dark mode SaaS". Not "gaming neon". Specifically: the visual language of premium athletic equipment — Garmin, Wahoo, Peloton's workout screens.

Key characteristics:
- **Depth through layered surfaces**, not shadows or gradients
- **Typography-first hierarchy** — Barlow Condensed for all metrics and headings; size does the work, not color
- **Orange as the single accent** — used only for primary actions, active states, PR moments; never decorative
- **Space is earned** — workout data is dense by nature; whitespace is used purposefully, not as padding

### Screen Personality Matrix

| Screen | Personality | Typography weight | Color density |
|--------|-------------|-------------------|---------------|
| Active Workout | Focused / urgent | Large metrics | Low — minimal UI chrome |
| Session Summary | Celebratory / reflective | Mixed | Medium |
| Exercise Library | Reference / browsable | Medium | Medium |
| Progress Dashboard | Analytical | Data-driven | High |
| Onboarding | Welcoming / clear | Readable | Low |
| Settings / Profile | Neutral / utility | Small | Low |

Each screen adapts the design language to its personality. The **Active Workout screen is the North Star** — all other screens are secondary.

---

## Icons

Use **Lucide React** exclusively. No emojis as UI icons. No mixing icon sets.

```tsx
import { Dumbbell, Timer, ChevronRight, Plus } from 'lucide-react'
```

**Why Lucide:** Consistent stroke weight (1.5px), clean geometric, works well inverted. Heroicons is an acceptable alternative if needed but don't mix.

Sizing convention:
- Navigation icons: `w-5 h-5` (20px)
- Inline icons: `w-4 h-4` (16px)
- Feature icons (empty states): `w-10 h-10` (40px)
- FAB icons: `w-6 h-6` (24px)

---

## Elevation System

Surfaces create depth through lightness steps, not shadows.

```
gym-bg          → #07111F  page background, behind everything
gym-surface     → #0F1C2E  sheet, panel, bottom nav background
gym-surface-2   → #152438  cards, exercise rows, list items
gym-surface-3   → #1C2F48  inputs, active items, selected rows
```

**Rule:** Never skip elevation levels. A card (`surface-2`) on a panel (`surface`) on background (`bg`). Inputs (`surface-3`) inside cards (`surface-2`).

---

## What This Design Is NOT

- ❌ Glassmorphism / blur effects
- ❌ Gradient backgrounds
- ❌ Rounded pill buttons as primary CTAs (use rounded-lg, not rounded-full)
- ❌ Multiple accent colors (only orange; status colors are informational only)
- ❌ Decorative illustrations on workout screens
- ❌ Light mode (dark-only for V1)
- ❌ Emoji as icons
- ❌ Box shadows as primary elevation signal

---

## Consequences

- All new screens must follow the elevation system
- Feature designs should be reviewed against the screen personality matrix before implementation
- Icons must be from Lucide React; any exception requires ADR update
