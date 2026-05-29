'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Dumbbell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/i18n/client'

export default function LoginPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col gap-8">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gym-accent glow-accent">
            <Dumbbell className="h-8 w-8 text-white" strokeWidth={2} />
          </div>
          <div className="flex flex-col items-center gap-1">
            <h1 className="heading text-3xl tracking-wide text-gym-text">Gym Planner</h1>
            <p className="text-sm text-gym-muted">{t('loginTagline')}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder={t('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 rounded-lg border border-gym-border bg-gym-surface px-3 text-sm transition-colors focus:border-gym-border-strong focus:outline-none"
            />

            <input
              type="password"
              placeholder={t('password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 rounded-lg border border-gym-border bg-gym-surface px-3 text-sm transition-colors focus:border-gym-border-strong focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glow-accent h-11 rounded-lg bg-gym-accent font-semibold text-white transition-all hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? t('signingIn') : t('signIn')}
          </button>
        </form>
        <div className="flex flex-col items-center gap-2 text-sm text-gym-muted">
          <Link href="/forgot-password" className="flex min-h-[44px] items-center transition-colors hover:text-gym-text">
            {t('forgotPassword')}
          </Link>
          <span>
            {t('dontHaveAccount')}{' '}
            <Link href="/signup" className="text-gym-accent hover:underline">
              {t('signUp')}
            </Link>
          </span>
        </div>
      </div>
    </main>
  )
}
