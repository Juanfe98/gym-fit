# ADR-006: Typography System

**Status:** Accepted  
**Date:** 2026-05-28  
**Deciders:** Product, Engineering

---

## Context

Typography carries most of the personality in a workout app. In the gym, the user glances at the screen: a weight number, a set count, a timer. Those numbers need to communicate instantly.

We need a typography system that:
- Makes metrics (weight, reps, time) instantly readable at a glance
- Feels athletic without being gimmicky
- Has a clear hierarchy between screen titles, data labels, and body text
- Loads fast (self-hosted or Google Fonts with `display: swap`)

---

## Decision

### Font Family

**Barlow Condensed** — headings, screen titles, all metric values  
**Barlow** — body text, labels, descriptions, form fields

Both loaded via `next/font/google` in the root layout with `display: swap`. CSS variables: `--font-heading` (Barlow Condensed) and `--font-body` (Barlow).

**Why Barlow:** Designed for performance contexts. Condensed variant is used by sports brands, cycling computers, athletic apps. The narrow letterforms allow large type without horizontal overflow on 375px.

---

### Type Scale

| Token | Size | Usage |
|-------|------|-------|
| `text-xs` | 12px | Timestamps, metadata, set number badges |
| `text-sm` | 14px | Secondary labels, exercise notes, status text |
| `text-base` | 16px | Body copy, form inputs, default text |
| `text-lg` | 18px | Section headings, card titles |
| `text-xl` | 20px | Screen sub-headings |
| `text-2xl` | 24px | Screen titles |
| `text-3xl` | 30px | Session timer, PR weight display |
| `text-4xl` | 36px | Summary metrics (volume, duration headline) |
| `text-display` | 48px | Rest timer countdown |

---

### Metric Display Rule

Any number representing a workout metric (weight, reps, volume, timer, streak) must use:

```html
<span class="metric">100 kg</span>
```

The `.metric` class applies:
- `font-family: var(--font-heading)` — Barlow Condensed
- `font-variant-numeric: tabular-nums` — numbers don't shift width
- `font-weight: 700`
- `letter-spacing: -0.02em` — tight for athletic feel
- `line-height: 1` — compact

**Never display workout numbers in the body font.**

---

### Heading Rule

Screen titles and section headings:

```tsx
// Screen title
<h1 className="font-heading text-2xl font-semibold uppercase tracking-wide">
  Workout

// Section heading
<h2 className="font-heading text-lg font-semibold uppercase tracking-wider text-gym-muted">
  Exercises
```

Headings use uppercase + tracking to differentiate from metrics. Never apply uppercase to body text or labels.

---

### Weight Conventions

| Context | Weight |
|---------|--------|
| Screen titles | 600 |
| Metric numbers | 700 |
| Section headings | 600 |
| Body text | 400 |
| Secondary labels | 400 |
| Emphasis in body | 500 |

---

### Anti-patterns

- ❌ `font-bold` on body text paragraphs
- ❌ Italic text anywhere (not in the Barlow athletic voice)
- ❌ Text smaller than 12px
- ❌ Body font for numbers that represent training data
- ❌ Mixed case on section headings (always uppercase or always sentence case, never title case for labels)

---

## Consequences

- All metric/number displays must use the `.metric` class or equivalent inline styles
- `next/font/google` handles font loading — do not add Google Fonts `@import` to CSS
- Any new weight (300 or 800) requires updating the font loader in `layout.tsx`
