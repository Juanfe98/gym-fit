# Gym Exercise Tracker — User-Facing Application Specification

## 1. Product Overview

### Product Name
Gym Exercise Tracker

### Product Goal
Build a modern, enterprise-level user-facing application that allows users to create workout plans, track gym sessions, monitor progress, manage goals, and maintain consistency in their fitness journey.

The product should feel simple for daily use but powerful enough to support long-term training history, analytics, personalization, and future premium features.

### Target Users

#### Primary User
A person who goes to the gym and wants to track exercises, sets, reps, weight, progress, and workout consistency.

#### Secondary User
A more advanced gym user who wants structured training plans, progress analytics, personal records, body measurements, and goal tracking.

#### Future User Types
- Users following AI-generated plans
- Users receiving plans from coaches
- Users participating in challenges
- Users syncing data from wearables

---

## 2. Product Principles

The user-facing app should follow these principles:

1. **Fast workout logging**
   - The user should be able to log a set with minimum friction.
   - The workout tracking flow is the core product experience.

2. **Progress visibility**
   - Users should clearly see if they are improving over time.
   - Progress charts should be easy to understand.

3. **Flexible structure**
   - Users can follow a predefined plan or create their own.
   - The app should support different training styles.

4. **Mobile-first experience**
   - The app should work very well on mobile.
   - Desktop/tablet layouts can enhance analytics and planning.

5. **Offline-friendly tracking**
   - Users should not lose workout data if the connection fails.
   - Workout sessions should autosave locally and sync later.

6. **Enterprise-ready foundation**
   - The app should support scalability, analytics, auditability, feature flags, and future modules.

---

## 3. Scope

### In Scope — User-Facing Application

The first full user-facing application should include:

- Authentication screens
- Onboarding flow
- User fitness profile
- Exercise library
- Workout plan creation
- Workout plan management
- Workout session tracking
- Workout history
- Progress dashboard
- Personal records
- Goals
- Calendar/scheduling
- Notifications/preferences UI
- Settings
- Profile management
- Basic help/feedback entry point

### Out of Scope for This Spec

The following are not part of the first user-facing spec, but should be considered for future expansion:

- Admin panel
- Coach portal
- Subscription management
- Full nutrition tracking
- Social/community features
- Marketplace
- Wearable integrations
- Full AI assistant implementation
- Content moderation

---

## 4. Supported Platforms

### Initial Platform Recommendation
Build as a mobile-first web application or React Native app depending on the product direction.

If the goal is fast iteration and easy deployment:
- React / Next.js web app first

If the goal is native workout tracking experience:
- React Native with Expo

### Responsive Requirements
The user-facing UI should support:

- Mobile
- Tablet
- Desktop

The primary UX should be optimized for mobile because users will likely track workouts at the gym.

---

## 5. User Roles

### Regular User
A regular user can:

- Create and manage their own profile
- Create workout plans
- Start workout sessions
- Track exercises
- View progress
- Manage goals
- Manage settings

### Premium User — Future
A premium user may eventually access:

- Advanced analytics
- AI workout generation
- More templates
- Cloud backup/history expansion
- Wearable integrations
- Advanced goal insights

---

## 6. Main Navigation

### Recommended User-Facing Navigation

```txt
Home
Today
Plans
Exercises
Progress
Calendar
Profile
```

### Mobile Bottom Navigation

Recommended primary bottom tabs:

```txt
Home
Workout
Plans
Progress
Profile
```

Secondary sections can be accessed from screen-level actions or profile/settings.

---

## 7. Core User Journeys

## 7.1 New User Journey

### Flow

1. User opens the app.
2. User signs up.
3. User verifies email if required.
4. User completes onboarding.
5. User creates fitness profile.
6. User chooses training goal.
7. User selects preferred workout days.
8. User selects available equipment.
9. User chooses to create a plan manually or start from a template.
10. User lands on Home / Today screen.

### Acceptance Criteria

- User can create an account successfully.
- User can complete onboarding without being blocked by optional fields.
- Required profile fields are validated.
- User can skip non-critical onboarding steps.
- User lands on a useful first experience after onboarding.

---

## 7.2 Returning User Journey

### Flow

1. User opens the app.
2. App checks active session.
3. User lands on Home / Today screen.
4. App shows next scheduled workout if available.
5. User can start workout quickly.

### Acceptance Criteria

- Authenticated user remains logged in unless session expired.
- User sees today’s workout when available.
- User sees a useful empty state if no workout is scheduled.
- User can start a workout in one or two taps.

---

## 7.3 Create Workout Plan Journey

### Flow

1. User goes to Plans.
2. User selects Create Plan.
3. User chooses manual creation or template.
4. User defines plan name, goal, duration, and days per week.
5. User creates workout days.
6. User adds exercises to each day.
7. User configures sets, reps, rest, tempo, and notes.
8. User saves the plan.
9. User can schedule the plan.

### Acceptance Criteria

- User can create a plan manually.
- User can add multiple workout days.
- User can add multiple exercises per day.
- User can reorder exercises.
- User can remove exercises.
- User can save a valid plan.
- Invalid plans show clear validation errors.

---

## 7.4 Start Workout Journey

### Flow

1. User opens Today or Workout screen.
2. User selects Start Workout.
3. App creates a workout session.
4. User sees list of planned exercises.
5. User logs sets, reps, and weight.
6. User uses rest timer between sets.
7. User can add, skip, replace, or reorder exercises.
8. User completes workout.
9. App saves workout history.
10. App updates progress metrics.

### Acceptance Criteria

- User can start a workout from today’s scheduled plan.
- User can start an empty workout.
- User can log sets quickly.
- User can edit logged sets.
- User can delete logged sets.
- User can finish a workout.
- Workout progress is autosaved.
- User does not lose data if app reloads.

---

## 7.5 Track Progress Journey

### Flow

1. User opens Progress.
2. User sees overview metrics.
3. User can select exercise-specific progress.
4. User can view charts by date range.
5. User can view personal records.
6. User can view body measurements if tracked.

### Acceptance Criteria

- User can see workout consistency.
- User can see total volume over time.
- User can see progress by exercise.
- User can see PRs.
- Charts have useful empty states.
- Date filters work correctly.

---

## 7.6 Goal Tracking Journey

### Flow

1. User opens Goals.
2. User creates a new goal.
3. User selects goal type.
4. User enters target value and deadline if applicable.
5. App tracks progress automatically where possible.
6. User can update or complete goal.

### Acceptance Criteria

- User can create strength goals.
- User can create consistency goals.
- User can create body measurement goals.
- Goal progress updates based on workout data when possible.
- User can mark a goal as completed manually.

---

# 8. Modules and Functional Requirements

---

## 8.1 Authentication Module

### Purpose
Allow users to securely access the application.

### Screens

- Sign In
- Sign Up
- Forgot Password
- Reset Password
- Verify Email
- Session Expired

### Functional Requirements

#### Sign Up
User should be able to create an account using:

- Email
- Password
- Name

Optional future providers:

- Google
- Apple

#### Sign In
User should be able to sign in with:

- Email
- Password

#### Password Recovery
User should be able to:

- Request password reset
- Receive reset link
- Set new password

#### Session Handling
App should:

- Persist active session securely
- Refresh tokens if applicable
- Redirect unauthenticated users to sign in
- Handle expired sessions gracefully

### Validation Rules

- Email must be valid.
- Password must match minimum security requirements.
- Required fields must show clear errors.

### Acceptance Criteria

- User can sign up.
- User can sign in.
- User can log out.
- User can reset password.
- Invalid credentials show safe generic error.
- Protected routes cannot be accessed without authentication.

---

## 8.2 Onboarding Module

### Purpose
Collect initial user information to personalize the experience.

### Screens

The canonical application flow is documented in [`docs/core-application-flow.md`](./core-application-flow.md).

- Welcome
- Fitness Goal
- Experience Level
- Preferred Workout Frequency
- Available Workout Time
- Available Equipment
- Optional Body Information
- Optional Limitations / Injuries
- Onboarding Summary

### Functional Requirements

The onboarding should collect:

- Primary fitness goal
- Experience level
- Preferred training days / workout frequency
- Available workout time / time per workout
- Equipment access
- Height
- Weight
- Optional body measurements
- Optional limitations/injuries

### Required Fields

Minimum required fields:

- Fitness goal
- Experience level
- Training days per week
- Equipment access

### Optional Fields

- Height
- Weight
- Body measurements
- Injuries or limitations

### Acceptance Criteria

- User can complete onboarding.
- User can skip optional steps.
- User can edit onboarding data later in profile.
- User sees progress indicator during onboarding.
- User lands on Home after completion.
- Returning users who have completed onboarding land directly on Home Dashboard at app launch.

---

## 8.3 User Fitness Profile Module

### Purpose
Store user profile and fitness context.

### Screens

- Profile Overview
- Edit Personal Info
- Edit Fitness Info
- Body Measurements
- Preferences

### Functional Requirements

User can manage:

- Name
- Avatar
- Age/date of birth, optional
- Height
- Weight
- Unit preference
- Experience level
- Main goal
- Workout frequency
- Equipment access
- Physical limitations
- Body measurements

### Body Measurements
Supported measurements:

- Body weight
- Chest
- Waist
- Hips
- Arms
- Thighs
- Shoulders

### Acceptance Criteria

- User can update profile.
- User can update fitness information.
- User can add body measurements over time.
- User can change unit preferences.
- Changes are reflected across the app.

---

## 8.4 Home Module

### Purpose
Give the user a useful daily summary and quick access to workout tracking.

### Screen

- Home Dashboard

### Functional Requirements

Home should show:

- Greeting
- Today’s scheduled workout
- Quick Start Workout button
- Current streak
- Weekly workout progress
- Latest personal record
- Active goals summary
- Recent workout summary

### Empty State
If user has no plan:

- Show CTA to create a plan
- Show CTA to start empty workout
- Show suggested templates if available

### Acceptance Criteria

- User can start workout from Home.
- User can navigate to active plan.
- User can see weekly progress.
- User sees meaningful empty states.

---

## 8.5 Exercise Library Module

### Purpose
Allow users to browse, search, understand, and select exercises.

### Screens

- Exercise Library
- Exercise Detail
- Create Custom Exercise
- Exercise Filters

### Exercise Data Fields

Each exercise should include:

- ID
- Name
- Description
- Primary muscle group
- Secondary muscle groups
- Equipment
- Difficulty
- Movement pattern
- Instructions
- Common mistakes
- Safety tips
- Media URL
- Tags
- Alternatives

### Search and Filtering
Users should be able to search/filter by:

- Name
- Muscle group
- Equipment
- Difficulty
- Movement pattern
- Favorites

### Favorites
User can:

- Favorite exercises
- View favorite exercises
- Remove from favorites

### Custom Exercises
User can create custom exercises with:

- Name
- Muscle group
- Equipment
- Notes

### Acceptance Criteria

- User can search exercises.
- User can filter exercises.
- User can open exercise details.
- User can favorite exercises.
- User can create custom exercises.
- Exercise details should be readable during workout creation.

---

## 8.6 Workout Plans Module

### Purpose
Allow users to create, edit, view, and manage structured workout plans.

### Screens

- Plans List
- Plan Detail
- Create Plan
- Edit Plan
- Workout Day Editor
- Add Exercise to Plan
- Plan Templates

### Plan Types

Supported plan types:

- Manual plan
- Template-based plan
- Future: AI-generated plan
- Future: Coach-assigned plan

### Workout Plan Fields

A workout plan should include:

- ID
- Name
- Description
- Goal
- Level
- Duration in weeks
- Days per week
- Is active
- Workout days
- Created date
- Updated date

### Workout Day Fields

A workout day should include:

- ID
- Name
- Day order
- Target muscle groups
- Exercises

### Plan Exercise Fields

Each exercise in a plan should include:

- Exercise ID
- Order
- Target sets
- Target reps
- Target weight, optional
- Rest seconds
- Tempo, optional
- RPE target, optional
- Notes

### Functional Requirements

User can:

- Create workout plan
- Edit workout plan
- Delete/archive workout plan
- Duplicate workout plan
- Activate one plan
- Deactivate current plan
- Add workout days
- Edit workout days
- Reorder workout days
- Add exercises to workout days
- Remove exercises from workout days
- Reorder exercises
- Configure exercise targets

### Validation Rules

- Plan name is required.
- A plan should have at least one workout day.
- A workout day should have at least one exercise.
- Target sets should be greater than zero.
- Target reps should be greater than zero when defined.

### Acceptance Criteria

- User can create and save a valid plan.
- User can edit an existing plan.
- User can activate a plan.
- User can duplicate a plan.
- User can archive a plan.
- Invalid data shows clear field-level errors.

---

## 8.7 Workout Session Module

### Purpose
Allow users to track workouts in real time.

### Screens

- Start Workout
- Active Workout
- Exercise Logging
- Rest Timer
- Finish Workout Summary
- Replace Exercise
- Add Exercise During Workout

### Session Types

Supported workout sessions:

- Planned workout session
- Empty workout session
- Quick workout session

### Workout Session Fields

A workout session should include:

- ID
- User ID
- Source plan ID, optional
- Source workout day ID, optional
- Status
- Started at
- Finished at
- Duration
- Exercises
- Notes

### Session Statuses

Supported statuses:

- in_progress
- completed
- cancelled
- discarded

### Logged Exercise Fields

Each logged exercise should include:

- Exercise ID
- Exercise name snapshot
- Order
- Sets
- Notes
- Was replaced
- Original exercise ID, optional

### Logged Set Fields

Each logged set should include:

- Set number
- Weight
- Reps
- RPE, optional
- Duration, optional
- Distance, optional
- Is warmup
- Is completed
- Notes

### Functional Requirements

User can:

- Start planned workout
- Start empty workout
- Log sets
- Edit sets
- Delete sets
- Add warmup sets
- Add exercises during workout
- Replace exercises
- Skip exercises
- Reorder exercises during workout
- Use rest timer
- Pause/resume workout
- Finish workout
- Discard workout
- Add workout notes

### Rest Timer

User can:

- Start timer automatically after set completion
- Manually start timer
- Pause timer
- Skip timer
- Adjust default rest time

### Autosave

The app should autosave:

- Active workout session
- Logged sets
- Notes
- Timer state if useful

### Offline Support

If network fails:

- User can continue logging workout locally.
- App shows sync status.
- App syncs when connection returns.
- User should not lose workout data.

### Acceptance Criteria

- User can complete a full workout session.
- User can log sets quickly.
- Workout session persists after refresh/reopen.
- App handles network failure gracefully.
- User can finish workout and see summary.
- Completed workout appears in history.

---

## 8.8 Workout History Module

### Purpose
Allow users to review previous workouts.

### Screens

- Workout History List
- Workout History Detail
- Workout Summary

### Functional Requirements

User can:

- View completed workouts
- Filter workouts by date
- Search workout by exercise name
- Open workout details
- See logged exercises and sets
- Edit previous workout, optional for V1
- Delete previous workout, optional for V1
- Duplicate previous workout as new plan/day, future

### Workout Detail Should Show

- Workout name
- Date
- Duration
- Exercises completed
- Total sets
- Total volume
- Personal records achieved
- Notes

### Acceptance Criteria

- User can view workout history.
- User can open a workout detail.
- User can see all logged sets.
- History is sorted by most recent first.
- Empty state appears if no workouts exist.

---

## 8.9 Progress Module

### Purpose
Show user improvement over time.

### Screens

- Progress Dashboard
- Exercise Progress Detail
- Volume Analytics
- Personal Records
- Body Progress

### Metrics

The app should calculate:

- Total workouts completed
- Weekly workouts completed
- Training streak
- Total sets
- Total reps
- Total volume
- Volume by muscle group
- Volume by exercise
- Estimated one-rep max
- Personal records
- Body weight trend
- Workout duration trend

### Date Filters

Supported ranges:

- Last 7 days
- Last 30 days
- Last 3 months
- Last 6 months
- Last year
- Custom range, future

### Exercise Progress

For each exercise, show:

- Best weight
- Best reps
- Best estimated 1RM
- Volume trend
- Last performed date
- Historical sets

### Personal Records

PR types:

- Max weight
- Max reps at weight
- Max estimated 1RM
- Max volume in session

### Acceptance Criteria

- User can view progress dashboard.
- User can filter progress by date range.
- User can view exercise-specific progress.
- User can view personal records.
- Charts handle empty states.
- Metrics update after workout completion.

---

## 8.10 Goals Module

### Purpose
Allow users to set, monitor, and complete fitness goals.

### Screens

- Goals List
- Create Goal
- Goal Detail
- Edit Goal

### Goal Types

Supported goals:

- Strength goal
- Body weight goal
- Body measurement goal
- Consistency goal
- Workout count goal
- Custom goal

### Goal Fields

A goal should include:

- ID
- Type
- Title
- Description
- Target value
- Current value
- Unit
- Start date
- Deadline, optional
- Status
- Linked exercise ID, optional

### Goal Statuses

- active
- completed
- paused
- cancelled

### Functional Requirements

User can:

- Create goal
- Edit goal
- Pause goal
- Complete goal
- Delete goal
- View progress percentage
- Link goal to exercise where applicable

### Automatic Progress Calculation

Examples:

- Bench press target weight should update from workout logs.
- Weekly workout goal should update from completed sessions.
- Body weight goal should update from body measurement entries.

### Acceptance Criteria

- User can create different goal types.
- Goal progress is visible.
- Goal status can be changed.
- Linked goals update automatically when data exists.

---

## 8.11 Calendar & Scheduling Module

### Purpose
Allow users to plan and organize workouts.

### Screens

- Calendar Month View
- Calendar Week View
- Schedule Workout
- Reschedule Workout

### Functional Requirements

User can:

- Schedule workouts from active plan
- View scheduled workouts by week/month
- Move workouts to another day
- Mark workout as completed
- Mark workout as skipped
- Reschedule missed workout
- Start workout from calendar

### Calendar Event Fields

A scheduled workout should include:

- ID
- Workout plan ID
- Workout day ID
- Scheduled date
- Status
- Completed workout session ID, optional

### Scheduled Workout Statuses

- scheduled
- completed
- skipped
- missed
- rescheduled

### Acceptance Criteria

- User can see scheduled workouts.
- User can start scheduled workout.
- User can reschedule workout.
- Completed workouts update calendar state.
- Missed workouts are handled clearly.

---

## 8.12 Notifications Preferences Module

### Purpose
Allow users to manage notification preferences.

### Screens

- Notification Settings

### Notification Types

Users should be able to configure:

- Workout reminders
- Rest timer alerts
- Weekly summaries
- Goal updates
- Personal record celebrations
- Missed workout reminders

### Channels

Initial channels:

- In-app notifications
- Push notifications, if mobile/native
- Email, optional

### Preferences

User can configure:

- Enable/disable all notifications
- Enable/disable individual notification types
- Reminder time
- Quiet hours

### Acceptance Criteria

- User can update notification preferences.
- Preferences are persisted.
- Disabled notifications should not be sent.

---

## 8.13 Settings Module

### Purpose
Allow users to configure app behavior.

### Screens

- Settings
- Account Settings
- Privacy Settings
- Units & Preferences
- Theme Settings
- Data Export

### Functional Requirements

User can manage:

- Account information
- Password
- Units: kg/lb, cm/in
- Language
- Theme
- Notifications
- Privacy
- Data export
- Account deletion

### Acceptance Criteria

- User can update settings.
- Unit changes are reflected across the app.
- User can request data export.
- User can delete account after confirmation.

---

## 8.14 In-App Notifications Module

### Purpose
Show important messages inside the app.

### Screens

- Notification Center

### Functional Requirements

User can:

- View notifications
- Mark notification as read
- Delete notification
- Open related screen from notification

### Notification Examples

- Workout reminder
- New personal record
- Goal completed
- Weekly summary ready
- Missed workout

### Acceptance Criteria

- User can see notification list.
- Unread notifications are visually distinct.
- User can mark notifications as read.
- Notification deep links navigate correctly.

---

## 8.15 Help & Feedback Module

### Purpose
Allow users to report issues and provide feedback.

### Screens

- Help Center
- Submit Feedback
- Report Issue

### Functional Requirements

User can:

- Open help page
- Submit feedback
- Report a bug
- Include optional screenshot, future
- Include app metadata automatically, future

### Acceptance Criteria

- User can submit feedback.
- User receives success confirmation.
- Required fields are validated.

---

# 9. Screen-by-Screen Specification

---

## 9.1 Sign In Screen

### UI Elements

- App logo
- Email input
- Password input
- Sign In button
- Forgot Password link
- Sign Up link
- Error message area

### States

- Default
- Loading
- Error
- Success redirect

### Acceptance Criteria

- Sign In button is disabled when required fields are empty.
- Loading state appears during request.
- Invalid credentials show generic error.
- Successful login redirects to Home.

---

## 9.2 Sign Up Screen

### UI Elements

- Name input
- Email input
- Password input
- Confirm password input
- Terms acceptance checkbox
- Sign Up button
- Sign In link

### Acceptance Criteria

- User cannot sign up without accepting terms.
- Password and confirm password must match.
- Successful signup redirects to onboarding or email verification.

---

## 9.3 Home Screen

### UI Sections

- Greeting
- Today’s workout card
- Quick start workout button
- Weekly progress
- Current streak
- Recent workout
- Active goals preview

### Acceptance Criteria

- If scheduled workout exists, show it prominently.
- If no workout exists, show create plan CTA.
- Quick start creates an empty session.

---

## 9.4 Exercise Library Screen

### UI Elements

- Search input
- Filter button
- Muscle group chips
- Exercise list
- Favorite button per exercise
- Create custom exercise button

### Acceptance Criteria

- Search filters list in near real time.
- Filter state can be cleared.
- Exercise card opens detail screen.

---

## 9.5 Exercise Detail Screen

### UI Sections

- Exercise name
- Media preview
- Primary muscles
- Secondary muscles
- Equipment
- Instructions
- Common mistakes
- Safety tips
- Alternatives
- Add to plan action
- Favorite action

### Acceptance Criteria

- User can favorite/unfavorite exercise.
- User can add exercise to a plan/day from this screen.

---

## 9.6 Plans List Screen

### UI Sections

- Active plan card
- All plans list
- Create plan button
- Template entry point

### Acceptance Criteria

- Active plan is visually highlighted.
- User can create a new plan.
- User can open plan detail.

---

## 9.7 Plan Detail Screen

### UI Sections

- Plan header
- Goal
- Days per week
- Workout days list
- Activate/deactivate action
- Edit action
- Duplicate action
- Archive action

### Acceptance Criteria

- User can activate plan.
- User can view all workout days.
- User can start a workout from a workout day.

---

## 9.8 Active Workout Screen

### UI Sections

- Workout title
- Timer/duration
- Exercise list
- Active exercise card
- Set logging table/cards
- Rest timer
- Add exercise button
- Finish workout button

### Set Logging UI

Each set row/card should allow:

- Weight input
- Reps input
- RPE input, optional
- Complete checkbox/button
- Delete action

### Acceptance Criteria

- User can log a set with weight and reps.
- Completed sets are visually distinct.
- User can add another set quickly.
- User can finish workout.
- User sees confirmation before discarding workout.

---

## 9.9 Finish Workout Summary Screen

### UI Sections

- Workout completed message
- Duration
- Total volume
- Total sets
- Exercises completed
- Personal records
- Notes
- Save/Done button

### Acceptance Criteria

- Summary is shown after finishing workout.
- Workout appears in history after save.
- Metrics update after completion.

---

## 9.10 Progress Dashboard Screen

### UI Sections

- Date range selector
- Workouts completed
- Volume trend
- Streak
- PR summary
- Muscle group distribution
- Exercise progress shortcuts

### Acceptance Criteria

- Metrics update based on selected date range.
- Empty state appears for new users.
- User can open exercise-specific progress.

---

## 9.11 Goals Screen

### UI Sections

- Active goals
- Completed goals
- Create goal button

### Acceptance Criteria

- User can see active goals.
- User can create goal.
- User can open goal detail.

---

## 9.12 Calendar Screen

### UI Sections

- Week/month toggle
- Scheduled workouts
- Completed workouts
- Missed workouts
- Add/schedule workout action

### Acceptance Criteria

- User can view scheduled workouts by date.
- User can start scheduled workout.
- User can reschedule workout.

---

## 9.13 Profile Screen

### UI Sections

- Avatar
- Name
- Fitness summary
- Body measurements
- Settings entry points
- Logout button

### Acceptance Criteria

- User can access profile data.
- User can navigate to edit profile.
- User can log out.

---

# 10. Data Model — Frontend Domain Types

The frontend should keep clear domain models. Exact backend schemas can differ, but these types should guide frontend implementation.

```ts
export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
};
```

```ts
export type FitnessProfile = {
  id: string;
  userId: string;
  goal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  trainingDaysPerWeek: number;
  preferredWorkoutDurationMinutes?: number;
  height?: number;
  weight?: number;
  unitSystem: UnitSystem;
  equipmentAccess: EquipmentType[];
  limitations?: string[];
  createdAt: string;
  updatedAt: string;
};
```

```ts
export type FitnessGoal =
  | 'muscle_gain'
  | 'fat_loss'
  | 'strength'
  | 'endurance'
  | 'mobility'
  | 'general_fitness';
```

```ts
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
```

```ts
export type UnitSystem = 'metric' | 'imperial';
```

```ts
export type Exercise = {
  id: string;
  name: string;
  description?: string;
  primaryMuscleGroup: MuscleGroup;
  secondaryMuscleGroups: MuscleGroup[];
  equipment: EquipmentType[];
  difficulty: ExperienceLevel;
  movementPattern: MovementPattern;
  instructions: string[];
  commonMistakes?: string[];
  safetyTips?: string[];
  mediaUrl?: string;
  tags: string[];
  alternatives?: string[];
  isCustom?: boolean;
  createdAt: string;
  updatedAt: string;
};
```

```ts
export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'glutes'
  | 'quads'
  | 'hamstrings'
  | 'calves'
  | 'full_body';
```

```ts
export type EquipmentType =
  | 'bodyweight'
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'cable'
  | 'kettlebell'
  | 'resistance_band'
  | 'smith_machine'
  | 'bench'
  | 'pull_up_bar'
  | 'cardio_machine';
```

```ts
export type MovementPattern =
  | 'push'
  | 'pull'
  | 'squat'
  | 'hinge'
  | 'carry'
  | 'rotation'
  | 'isolation'
  | 'cardio';
```

```ts
export type WorkoutPlan = {
  id: string;
  userId: string;
  name: string;
  description?: string;
  goal: FitnessGoal;
  level: ExperienceLevel;
  durationWeeks?: number;
  daysPerWeek: number;
  isActive: boolean;
  days: WorkoutDay[];
  createdAt: string;
  updatedAt: string;
};
```

```ts
export type WorkoutDay = {
  id: string;
  name: string;
  order: number;
  targetMuscleGroups: MuscleGroup[];
  exercises: PlanExercise[];
};
```

```ts
export type PlanExercise = {
  id: string;
  exerciseId: string;
  order: number;
  targetSets: number;
  targetReps?: number;
  targetRepRange?: {
    min: number;
    max: number;
  };
  targetWeight?: number;
  restSeconds?: number;
  tempo?: string;
  targetRpe?: number;
  notes?: string;
};
```

```ts
export type WorkoutSession = {
  id: string;
  userId: string;
  sourcePlanId?: string;
  sourceWorkoutDayId?: string;
  name: string;
  status: WorkoutSessionStatus;
  startedAt: string;
  finishedAt?: string;
  durationSeconds?: number;
  exercises: LoggedExercise[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
```

```ts
export type WorkoutSessionStatus =
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'discarded';
```

```ts
export type LoggedExercise = {
  id: string;
  exerciseId: string;
  exerciseNameSnapshot: string;
  order: number;
  sets: LoggedSet[];
  notes?: string;
  wasReplaced?: boolean;
  originalExerciseId?: string;
};
```

```ts
export type LoggedSet = {
  id: string;
  setNumber: number;
  weight?: number;
  reps?: number;
  rpe?: number;
  durationSeconds?: number;
  distance?: number;
  isWarmup: boolean;
  isCompleted: boolean;
  notes?: string;
};
```

```ts
export type Goal = {
  id: string;
  userId: string;
  type: GoalType;
  title: string;
  description?: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  startDate: string;
  deadline?: string;
  status: GoalStatus;
  linkedExerciseId?: string;
  createdAt: string;
  updatedAt: string;
};
```

```ts
export type GoalType =
  | 'strength'
  | 'body_weight'
  | 'body_measurement'
  | 'consistency'
  | 'workout_count'
  | 'custom';
```

```ts
export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';
```

```ts
export type ScheduledWorkout = {
  id: string;
  userId: string;
  workoutPlanId: string;
  workoutDayId: string;
  scheduledDate: string;
  status: ScheduledWorkoutStatus;
  completedWorkoutSessionId?: string;
};
```

```ts
export type ScheduledWorkoutStatus =
  | 'scheduled'
  | 'completed'
  | 'skipped'
  | 'missed'
  | 'rescheduled';
```

---

# 11. Frontend Architecture Recommendation

## 11.1 Recommended Structure

```txt
src/
  app/
  modules/
    auth/
    onboarding/
    home/
    exercises/
    workout-plans/
    workout-session/
    workout-history/
    progress/
    goals/
    calendar/
    profile/
    settings/
    notifications/
  shared/
    components/
    hooks/
    utils/
    types/
    api/
    constants/
    validation/
  services/
    auth-service.ts
    exercise-service.ts
    workout-plan-service.ts
    workout-session-service.ts
    progress-service.ts
    goal-service.ts
  state/
    auth-store.ts
    workout-session-store.ts
    user-preferences-store.ts
```

## 11.2 Module Structure

Each module should follow this structure:

```txt
module-name/
  components/
  hooks/
  pages/
  services/
  types/
  utils/
  validation/
  index.ts
```

## 11.3 State Management Strategy

Use server state and client state separately.

### Server State
Use TanStack Query for:

- User profile
- Exercise library
- Workout plans
- Workout history
- Progress metrics
- Goals
- Calendar data

### Client State
Use Zustand or local reducer state for:

- Active workout session draft
- Workout timer
- Temporary form state
- UI preferences
- Offline queue

### Form State
Use React Hook Form + Zod for:

- Profile forms
- Plan creation forms
- Goal creation forms
- Settings forms

---

# 12. API Contract Expectations

The frontend should expect API capabilities like:

## Auth

```txt
POST /auth/signup
POST /auth/signin
POST /auth/logout
POST /auth/refresh
POST /auth/forgot-password
POST /auth/reset-password
GET /auth/me
```

## User Profile

```txt
GET /users/me
PATCH /users/me
GET /users/me/fitness-profile
PUT /users/me/fitness-profile
```

## Exercises

```txt
GET /exercises
GET /exercises/:id
POST /exercises/custom
PATCH /exercises/custom/:id
DELETE /exercises/custom/:id
POST /exercises/:id/favorite
DELETE /exercises/:id/favorite
```

## Workout Plans

```txt
GET /workout-plans
GET /workout-plans/:id
POST /workout-plans
PATCH /workout-plans/:id
DELETE /workout-plans/:id
POST /workout-plans/:id/activate
POST /workout-plans/:id/duplicate
```

## Workout Sessions

```txt
GET /workout-sessions
GET /workout-sessions/:id
POST /workout-sessions
PATCH /workout-sessions/:id
POST /workout-sessions/:id/complete
POST /workout-sessions/:id/discard
```

## Progress

```txt
GET /progress/summary
GET /progress/exercises/:exerciseId
GET /progress/personal-records
GET /progress/body-measurements
POST /progress/body-measurements
```

## Goals

```txt
GET /goals
GET /goals/:id
POST /goals
PATCH /goals/:id
DELETE /goals/:id
POST /goals/:id/complete
```

## Calendar

```txt
GET /scheduled-workouts
POST /scheduled-workouts
PATCH /scheduled-workouts/:id
DELETE /scheduled-workouts/:id
POST /scheduled-workouts/:id/reschedule
POST /scheduled-workouts/:id/skip
```

---

# 13. Validation Requirements

## General Validation

- Required fields should be validated client-side and server-side.
- Errors should be displayed near the relevant field.
- Forms should prevent duplicate submissions.

## Workout Logging Validation

- Weight cannot be negative.
- Reps cannot be negative.
- Sets must have at least one useful value.
- RPE must be between 1 and 10.
- Duration cannot be negative.

## Workout Plan Validation

- Plan name is required.
- Workout day name is required.
- Plan must have at least one day.
- Day must have at least one exercise.
- Target sets must be greater than zero.

## Goal Validation

- Goal title is required.
- Target value is required for measurable goals.
- Deadline cannot be before start date.

---

# 14. Error Handling Requirements

The app should handle:

- Network errors
- Unauthorized errors
- Validation errors
- Server errors
- Empty data
- Failed sync
- Conflicting offline updates

## Error UX

Use:

- Inline field errors for forms
- Toasts for temporary errors
- Empty states for no data
- Full-page error boundaries for unexpected crashes
- Retry actions where possible

---

# 15. Loading State Requirements

Each screen should define loading states.

Use:

- Skeleton loaders for major screens
- Button loading state for submit actions
- Inline loading indicators for partial updates
- Optimistic updates where safe

Examples:

- Favorite exercise can update optimistically.
- Completing a set can update local state immediately.
- Finishing workout should show saving state.

---

# 16. Empty State Requirements

Important empty states:

- No workout plan
- No workout history
- No goals
- No exercises found
- No progress data
- No scheduled workouts

Each empty state should include:

- Clear message
- Helpful explanation
- Primary action

Example:

```txt
No workout plan yet.
Create your first plan or start an empty workout.
```

---

# 17. Offline & Sync Requirements

## Offline First Areas

The most important offline-safe area is active workout tracking.

### Requirements

- Active workout session should be stored locally.
- Logged sets should persist locally immediately.
- User should see sync state.
- When online, app should sync pending workout updates.
- If sync fails, app should keep local copy and retry.

### Sync States

```txt
synced
pending_sync
syncing
sync_failed
```

### Acceptance Criteria

- User can continue active workout without internet.
- User does not lose logged sets after refresh.
- App retries sync when network returns.
- Failed sync is visible but not destructive.

---

# 18. Accessibility Requirements

The app should support:

- Keyboard navigation
- Screen reader labels
- Proper button labels
- Focus states
- Sufficient color contrast
- Semantic HTML where applicable
- Large enough tap targets on mobile
- Reduced motion preferences where animations exist

Workout logging must be accessible because it is a core flow.

---

# 19. Internationalization Requirements

The app should be designed with i18n in mind.

### Requirements

- All user-facing strings should come from translation files.
- Units should adapt to user preference.
- Dates should be locale-aware.
- Number formatting should be locale-aware.

Initial languages:

- English
- Spanish, optional for V1 but recommended

---

# 20. Analytics Events

The app should track important user events.

## Recommended Events

### Auth

- user_signed_up
- user_signed_in
- user_logged_out

### Onboarding

- onboarding_started
- onboarding_completed
- onboarding_skipped_step

### Workout Plans

- workout_plan_created
- workout_plan_activated
- workout_plan_updated
- workout_plan_archived

### Workout Session

- workout_started
- workout_set_logged
- workout_exercise_added
- workout_exercise_replaced
- workout_completed
- workout_discarded

### Progress

- progress_viewed
- exercise_progress_viewed
- personal_records_viewed

### Goals

- goal_created
- goal_completed
- goal_updated

### Calendar

- workout_scheduled
- workout_rescheduled
- scheduled_workout_started

---

# 21. Security & Privacy Requirements

The user-facing app should:

- Never expose private tokens in client logs.
- Store tokens securely according to platform.
- Protect authenticated routes.
- Avoid logging sensitive body data unnecessarily.
- Allow account deletion.
- Allow data export.
- Require confirmation for destructive actions.

Sensitive user data includes:

- Body measurements
- Weight
- Injuries or limitations
- Personal photos, future
- Health-related notes

---

# 22. Performance Requirements

The app should:

- Load initial shell quickly.
- Lazy-load heavy screens like charts.
- Paginate workout history.
- Cache exercise library.
- Debounce exercise search.
- Avoid excessive re-renders during active workout logging.
- Keep active workout interactions instant.

### Important Performance Note
The active workout screen should not depend on slow network calls for basic set logging.

---

# 23. Design System Requirements

The app should have reusable components:

- Button
- Input
- Select
- Modal
- Bottom sheet
- Card
- Tabs
- Badge
- Toast
- Empty state
- Loading skeleton
- Exercise card
- Workout day card
- Set logger row/card
- Metric card
- Chart card
- Date range selector

Design should feel:

- Modern
- Clean
- Mobile-first
- Fast
- Focused
- Not overloaded during workout tracking

---

# 24. Non-Functional Requirements

## Reliability

- Workout data should not be lost.
- Failed requests should be recoverable.
- User should receive clear feedback.

## Maintainability

- Use modular feature-based structure.
- Keep domain types explicit.
- Keep business logic out of UI components when it becomes complex.
- Write reusable hooks for repeated flows.

## Testability

Important areas should be covered by tests:

- Plan creation
- Workout logging
- Workout completion
- Progress calculations
- Goal progress
- Offline autosave
- Auth route guards

## Scalability

The app should be ready for:

- More users
- More exercises
- More history
- More analytics
- Premium features
- AI features
- Coach features

---

# 25. Testing Strategy

## Unit Tests

Cover:

- Progress calculation utilities
- Volume calculation
- Estimated 1RM calculation
- Goal progress calculation
- Workout validation
- Date helpers

## Component Tests

Cover:

- Exercise search
- Plan editor
- Set logger
- Goal form
- Progress cards
- Empty states

## Integration Tests

Cover:

- Create workout plan flow
- Start workout flow
- Complete workout flow
- Create goal flow
- Schedule workout flow

## E2E Tests

Critical E2E flows:

1. User signs up and completes onboarding.
2. User creates workout plan.
3. User starts workout from plan.
4. User logs sets and finishes workout.
5. User sees workout in history.
6. User sees progress updated.
7. User creates and completes a goal.

---

# 26. Suggested MVP Cut

If building this with spec-driven development, start with a realistic MVP.

## MVP 1 — Foundation

- Auth
- Onboarding
- Profile
- Exercise library
- Basic plans
- Active workout tracking
- Workout history

## MVP 2 — Progress

- Progress dashboard
- Exercise progress
- Personal records
- Body measurements
- Goals

## MVP 3 — Planning

- Calendar
- Scheduling
- Notifications preferences
- Improved templates

## MVP 4 — Enterprise Readiness

- Offline sync hardening
- Analytics events
- Error monitoring
- Feature flags
- Data export/account deletion

---

# 27. Claude Code Implementation Guidance

## Recommended Implementation Order

1. Project setup and architecture
2. Design system primitives
3. Auth flow scaffolding
4. Onboarding flow
5. Exercise library
6. Workout plan CRUD
7. Active workout session tracking
8. Workout history
9. Progress calculations
10. Goals
11. Calendar scheduling
12. Settings/profile
13. Analytics and testing
14. Offline sync hardening

## Claude Code Prompt Template

Use this pattern per module:

```txt
We are building the Gym Exercise Tracker user-facing app.

Implement the [MODULE_NAME] module following the existing architecture.

Requirements:
- [requirement 1]
- [requirement 2]
- [requirement 3]

Acceptance Criteria:
- [criterion 1]
- [criterion 2]
- [criterion 3]

Technical Notes:
- Keep code modular.
- Use existing shared components.
- Add types in the module types file.
- Add validation schemas where needed.
- Add tests for important behavior.
- Avoid over-engineering.
```

---

# 28. Open Product Questions

Before implementation, these questions should be answered:

1. Is the first version web, mobile, or both?
2. Will the app support offline workout tracking from day one?
3. Will users create all plans manually, or should templates exist in V1?
4. Will exercise media be included initially?
5. Will there be a backend from the start, or local-first prototype first?
6. Do we want AI-generated plans in V1 or later?
7. Do we need Spanish and English from day one?
8. Will the app be free-only initially, or should premium architecture exist early?
9. Should body measurements be part of V1?
10. Should the product support coach/client flows later?

---

# 29. Final Recommended First Version

For the first user-facing release, prioritize:

1. Create profile
2. Browse exercises
3. Create workout plan
4. Start workout
5. Log sets quickly
6. Finish workout
7. See workout history
8. See basic progress

The product should win first on workout tracking quality. Everything else should support that experience.

