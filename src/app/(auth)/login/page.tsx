'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/i18n/client'
import { AuthFormWrapper, PasswordInput, AuthSubmitButton } from '@/modules/auth'

const inputClass =
  'h-11 w-full rounded-lg border border-gym-border bg-gym-surface px-3 text-sm transition-colors focus:border-gym-border-strong focus:outline-none'

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
    <AuthFormWrapper>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
          >
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <label htmlFor="email" className="sr-only">{t('email')}</label>
          <input
            id="email"
            type="email"
            placeholder={t('email')}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />

          <label htmlFor="password" className="sr-only">{t('password')}</label>
          <PasswordInput
            id="password"
            placeholder={t('password')}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <AuthSubmitButton loading={loading}>
          {loading ? t('signingIn') : t('signIn')}
        </AuthSubmitButton>
      </form>

      <div className="flex flex-col items-center gap-2 text-sm text-gym-muted">
        <Link
          href="/forgot-password"
          className="flex min-h-[44px] items-center transition-colors hover:text-gym-text"
        >
          {t('forgotPassword')}
        </Link>
        <span>
          {t('dontHaveAccount')}{' '}
          <Link href="/signup" className="text-gym-accent hover:underline">
            {t('signUp')}
          </Link>
        </span>
      </div>
    </AuthFormWrapper>
  )
}
