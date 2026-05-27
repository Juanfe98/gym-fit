# MVP Product Requirements — Gym Planner

## 1. Product Context

Goal-based gym routine generator for intermediate–advanced lifters. No auth, no tracking. Core value: get a structured plan + understand each exercise via GIF, muscle diagram, form cues, and rationale.

## 2. Functional Requirements

| # | Requirement |
|---|---|
| R1 | User can select one goal from four options: muscle gain, strength, fat loss, conditioning |
| R2 | System displays a preset weekly routine matching the selected goal |
| R3 | Routine shows training days, muscle groups per day, and exercise list per day |
| R4 | Each routine includes a short rationale explaining the split choice for that goal |
| R5 | User can open any exercise to see its full card |
| R6 | Exercise card shows: animated GIF, front/back muscle diagram with highlights, form cues, common mistakes, why it's in this plan |
| R7 | All exercise data (GIF + muscle groups) sourced from ExerciseDB free API |
| R8 | App is fully usable on mobile portrait (primary gym-floor use case) |
| R9 | No login, no account creation required |

## 3. Acceptance Criteria

### R1 — Goal selector
- Four options visible on load: Muscle Gain, Strength, Fat Loss, Conditioning
- Only one selectable at a time
- Selection triggers immediate routine display (no extra confirm step)

### R2 + R3 — Routine display
- Routine renders without a loading spinner (presets are static data)
- Each day shows: day label, primary muscle group(s), ordered exercise list
- Routine structure matches goal (e.g. PPL for muscle gain, 3-day full-body for strength)

### R4 — Plan rationale
- Visible on routine page before exercise list
- Explains split logic in 2–4 sentences (e.g. "Upper/lower split allows 2x frequency per muscle group, optimal for hypertrophy")

### R5 — Exercise navigation
- Tap/click on any exercise name opens exercise card
- Back navigation returns to routine view without losing scroll position

### R6 — Exercise card
- GIF autoplays, loops, no tap-to-play required
- Muscle diagram highlights primary and secondary muscles in distinct colors
- Form cues written for intermediate lifter (not "stand straight" level)
- Common mistakes: minimum 2, maximum 4
- "Why this exercise" specific to the goal context (not generic)

### R7 — ExerciseDB integration
- GIF and muscle data fetched from ExerciseDB
- If API call fails, card shows static fallback (no broken image)

### R8 — Mobile
- Usable one-handed in portrait on 375px+ viewport
- Tap targets minimum 44px
- Text readable without zoom (minimum 16px body)

### R9 — No auth
- Zero sign-up prompts, no gating

## 4. UX States

| Screen | State | Behavior |
|---|---|---|
| Homepage | Default | Goal selector hero, no clutter |
| Homepage | Goal selected | Navigate to routine page immediately |
| Routine page | Loading | Not applicable — static presets, instant render |
| Routine page | Loaded | Full week visible, scrollable |
| Exercise card | GIF loading | Skeleton placeholder while GIF fetches |
| Exercise card | GIF error | Static image fallback or muscle diagram only |
| Exercise card | API down | Show card with available static data, hide GIF section gracefully |

## 5. Edge Cases

| Case | Expected behavior |
|---|---|
| ExerciseDB exercise not found for a preset exercise | Use fallback static card with manual content |
| User navigates back from exercise card | Routine scroll position preserved |
| User opens app mid-routine (return visit) | Homepage shown — no session state needed |
| Exercise in multiple goal routines | "Why this exercise" copy is goal-specific, not shared |
| Very long exercise name on mobile | Truncate with ellipsis, full name visible on card |

## 6. Analytics / Learning Signals

| Event | Signal |
|---|---|
| Goal selected | Distribution across 4 goals |
| Exercise card opened | Which exercises get most attention |
| Time on exercise card | Education value |
| Return visit (session count) | Retention proxy without login |
| Bounce from routine page | Routine quality signal |

Simple page-view analytics (e.g. Plausible or GA4) sufficient. No custom backend needed for MVP.

## 7. Non-Goals

- Workout logging or progress tracking
- Custom routine builder
- Video production
- AI recommendations
- Home/bodyweight workouts
- Social or sharing features
- User accounts
- Periodization (progressive overload week-over-week)
- Nutrition

## 8. Open Questions

| # | Question | Status |
|---|---|---|
| Q1 | How many exercises per day per routine? | **Resolved: 5 exercises per day** |
| Q2 | Are routines fully static (hardcoded) or assembled from ExerciseDB data? | **Resolved: hardcoded. ExerciseDB used only for GIF + muscle data at runtime. Long-term intent is to replace ExerciseDB with own data layer.** |
| Q3 | Who writes "why this exercise" copy — manual or generated? | Open |
| Q4 | Any branding/name decided for the app? | Open |

## 9. Readiness Verdict

**Ready for Spec Kit.** Q1 and Q2 resolved. Q3 and Q4 deferred — no blocker.

## 10. Suggested Spec Kit Prompt

```
Build a web app called Gym Planner. Users select one of four goals (muscle gain, strength, fat loss, conditioning) and receive a preset weekly gym routine. Routines are hardcoded (5 exercises per day). Each exercise has a card with: animated GIF from ExerciseDB API, front/back muscle diagram, form cues, common mistakes, and goal-specific rationale. ExerciseDB is used only for media at runtime — routine structure is fully static. No auth, no tracking. Mobile-first, responsive. Graceful fallback when ExerciseDB unavailable.
```
