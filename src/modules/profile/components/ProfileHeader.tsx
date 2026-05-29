'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/client'
import { FITNESS_GOAL_KEYS, EXPERIENCE_LEVEL_KEYS } from '../utils/format-enums'
import type { FitnessGoal, ExperienceLevel, ProfileCompletion } from '../types'

type ProfileHeaderProps = {
  displayName: string
  avatarUrl: string | null
  fitnessGoal: FitnessGoal | null
  experienceLevel: ExperienceLevel | null
  completion: ProfileCompletion
}

const TIER_LABELS: Record<string, string> = {
  getting_started: 'profileCompletionGettingStarted',
  almost_ready: 'profileCompletionAlmostReady',
  profile_ready: 'profileCompletionProfileReady',
}

export function ProfileHeader({
  displayName,
  avatarUrl,
  fitnessGoal,
  experienceLevel,
  completion,
}: ProfileHeaderProps) {
  const { t } = useI18n()
  const initial = displayName.charAt(0).toUpperCase()

  const tierKey = TIER_LABELS[completion.tier] as keyof typeof import('@/i18n/ui').UI.en

  return (
    <div className="card-elevated flex items-center gap-4 p-4">
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={`${displayName} avatar`}
          className="h-16 w-16 rounded-full object-cover shrink-0"
        />
      ) : (
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full bg-gym-accent glow-accent shrink-0"
          aria-hidden="true"
        >
          <span className="metric text-2xl text-white">{initial}</span>
        </div>
      )}

      <div className="flex min-w-0 flex-col gap-1 flex-1">
        <p className="heading text-xl text-gym-text truncate">
          {displayName || t('profileTitle')}
        </p>

        {(fitnessGoal || experienceLevel) && (
          <p className="text-sm text-gym-muted truncate">
            {[
              fitnessGoal ? t(FITNESS_GOAL_KEYS[fitnessGoal] as keyof typeof import('@/i18n/ui').UI.en) : null,
              experienceLevel ? t(EXPERIENCE_LEVEL_KEYS[experienceLevel] as keyof typeof import('@/i18n/ui').UI.en) : null,
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gym-border px-2.5 py-0.5 text-xs text-gym-muted">
            <span
              className="h-2 w-2 rounded-full bg-gym-accent"
              aria-hidden="true"
              style={{ opacity: completion.score === 0 ? 0.3 : completion.score <= 4 ? 0.6 : 1 }}
            />
            <span>{t(tierKey)}</span>
            <span aria-label={`${completion.score} of 6 complete`} className="text-gym-disabled">
              {completion.score}/6
            </span>
          </span>

          <Link
            href="/profile/edit"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg px-3 text-sm text-gym-accent active:opacity-70"
          >
            {t('profileEditPersonalInfo')}
          </Link>
        </div>
      </div>
    </div>
  )
}
