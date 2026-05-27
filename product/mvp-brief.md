# MVP Product Brief — Gym Planner

## 1. Product Summary

Web app that generates a science-backed gym routine based on user goal, with per-exercise rationale, form cues, and common mistake callouts. No account, no tracking — pure reference and plan delivery.

## 2. Target User

Intermediate–advanced gym-goer (1–4+ years training). Understands movements, lacks structured programming. May have a gym membership but no reliable trainer or coach.

## 3. Problem Statement

Experienced gym-goers can't easily find a structured, goal-aligned routine that explains *why* each exercise is included. Trainers are unreliable. YouTube is fragmented. Generic apps track but don't educate.

## 4. Jobs To Be Done

| Job | Priority |
|-----|----------|
| "Give me a ready-made weekly plan for my goal" | Core |
| "Show me which exercises to do and why" | Core |
| "Teach me proper form so I don't injure myself" | Core |
| "Help me understand how my plan is structured" | Secondary |

## 5. MVP Goal

Prove that intermediate/advanced users find enough value in a goal-based routine + exercise guide to return or share it — without any tracking or personalization features.

## 6. In Scope

- Goal selector: muscle gain, strength, fat loss, conditioning
- Preset weekly routine per goal (e.g. 4-day upper/lower, 5-day PPL)
- Exercise cards: animated GIF (from ExerciseDB API), muscle group diagram (front/back body highlight), form cues, common mistakes, why it's in the plan
- Gym equipment assumed (barbells, dumbbells, cables, machines)
- Responsive web (mobile-friendly — people reference this at the gym)
- No auth required

## 7. Out of Scope

- Workout logging / progress tracking
- Custom routine builder
- Custom video production
- AI / chat interface
- Home workout or bodyweight variants
- Social / sharing features
- User accounts / profiles
- Periodization progression (week-over-week load changes)
- Nutrition guidance
- Paid features / subscriptions

## 8. User Journey

```
Land on homepage
→ See goal options (muscle gain / strength / fat loss / conditioning)
→ Select goal
→ See weekly routine overview (days, muscle groups, exercise list)
→ Tap/click exercise
→ See exercise card (GIF demo + muscle diagram + form cues + why)
→ Reference during training session
→ Return next session or share with friend
```

## 9. UX States

| State | Notes |
|---|---|
| First load | Goal selector is the hero — no clutter |
| Goal selected | Routine renders immediately, no loading delay if presets are static |
| Exercise card | Must be scannable in 10 seconds (gym floor context) |
| Mobile portrait | Primary use case — cards must work one-handed |
| No goal selected | Clear CTA, no empty state confusion |

## 10. Success Metrics / Learning Signals

| Signal | What it tells us |
|---|---|
| Return visits (same device, no login) | Users reference it during training |
| Time on exercise card | Education layer has value |
| Goal selection distribution | Which user segment is largest |
| Social shares / direct link traffic | Organic word-of-mouth |
| Bounce rate on routine page | Routine quality / relevance |

## 11. Risks and Open Questions

| Risk | Severity | Mitigation |
|---|---|---|
| Preset routines feel too generic for intermediate users | High | Include plan rationale ("why this split for this goal") |
| Exercise cards too shallow for experienced lifters | Medium | Include intermediate cues, not just beginner form |
| Mobile readability on gym floor | Medium | Test real use, high contrast, large tap targets |
| Content correctness (bad advice = trust killer) | High | Source from established strength literature |
| No retention without tracking | Low for MVP | Accepted tradeoff — validate first |

**Resolved:** Exercise content (GIFs + muscle data) sourced from ExerciseDB free API (~1300 exercises). Manual curation not needed for MVP.

## 12. Readiness Verdict

**Ready for MVP requirements.**

Problem, user, scope, and success signals are clear. One content question (curation) can be resolved during requirements. No further discovery needed before Spec Kit.
