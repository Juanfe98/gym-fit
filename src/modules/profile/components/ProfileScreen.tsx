'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { LogOut, Lock, ChevronRight } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { createClient } from '@/lib/supabase/client'
import { PageHeader, SectionLabel } from '@/components/ui'
import { ProfileStats } from './ProfileStats'
import { SettingsSection } from './SettingsSection'

const APP_VERSION = '0.0.1'

type ProfileUser = {
  id: string
  displayName: string
  email: string
  avatarUrl: string | null
  createdAt: string | null
}

export function ProfileScreen({ user }: { user: ProfileUser }) {
  const { t, lang } = useI18n()
  const router = useRouter()

  const initial = user.displayName.charAt(0).toUpperCase()
  const memberSince = useMemo(() => {
    if (!user.createdAt) return null
    return new Intl.DateTimeFormat(lang, { month: 'long', year: 'numeric' }).format(
      new Date(user.createdAt)
    )
  }, [user.createdAt, lang])

  async function handleSignOut() {
    await createClient().auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex flex-col">
      <PageHeader title={t('profileTitle')} />

      <div className="flex flex-col gap-6 px-4 pb-6">
        {/* Identity card */}
        <div className="card-elevated flex items-center gap-4 p-4">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gym-accent glow-accent">
              <span className="metric text-2xl text-white">{initial}</span>
            </div>
          )}
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="heading text-xl text-gym-text">{user.displayName}</p>
            <p className="truncate text-sm text-gym-muted">{user.email}</p>
            {memberSince && (
              <p className="text-xs text-gym-muted">
                {t('profileMemberSince', { date: memberSince })}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <section className="flex flex-col gap-2">
          <SectionLabel>{t('profileStatsLabel')}</SectionLabel>
          <ProfileStats userId={user.id} />
        </section>

        {/* Settings */}
        <section className="flex flex-col gap-2">
          <SectionLabel>{t('profileSettingsLabel')}</SectionLabel>
          <SettingsSection />
        </section>

        {/* History */}
        <section className="flex flex-col gap-2">
          <div className="card divide-y divide-gym-border-subtle">
            <Link
              href="/history"
              className="flex items-center justify-between px-4 py-3 min-h-[44px] border-b border-gym-border"
            >
              <span className="text-sm text-gym-text">{t('workoutHistory')}</span>
              <ChevronRight className="h-4 w-4 text-gym-muted" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* Account */}
        <section className="flex flex-col gap-2">
          <SectionLabel>{t('profileAccountLabel')}</SectionLabel>
          <div className="card divide-y divide-gym-border-subtle">
            <Link
              href="/forgot-password"
              className="flex items-center justify-between gap-3 px-4 py-3 min-h-[44px] text-sm text-gym-text transition-colors active:bg-gym-surface-2"
            >
              <span className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-gym-muted" aria-hidden="true" />
                {t('changePassword')}
              </span>
              <ChevronRight className="h-4 w-4 text-gym-muted" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 px-4 py-3 min-h-[44px] text-sm text-danger transition-colors active:bg-gym-surface-2"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {t('signOut')}
            </button>
          </div>
        </section>

        <p className="pt-2 text-center text-xs text-gym-disabled">
          {t('appVersion', { version: APP_VERSION })}
        </p>
      </div>
    </div>
  )
}
