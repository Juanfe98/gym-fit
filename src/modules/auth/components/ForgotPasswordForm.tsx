'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { forgotPasswordSchema, type ForgotPasswordInput } from '../validation/forgot-password.schema'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/i18n/client'

const inputClass =
  'h-11 rounded-lg border border-gym-border bg-gym-surface px-3 text-sm focus:border-gym-border-strong focus:outline-none'

export function ForgotPasswordForm() {
  const { t } = useI18n()
  const [succeeded, setSucceeded] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) })

  async function onSubmit({ email }: ForgotPasswordInput) {
    const supabase = createClient()
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: (process.env.NEXT_PUBLIC_SITE_URL ?? '') + '/auth/callback?next=/reset-password',
      })
      setSucceeded(true)
    } catch {
      setError('root', { message: t('authNetworkError') })
    }
  }

  if (succeeded) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="font-semibold text-gym-text">{t('resetLinkSent')}</p>
        <p className="text-sm text-gym-muted">{t('resetLinkSentBody')}</p>
        <Link href="/login" className="text-sm text-gym-accent hover:underline">
          {t('backToSignIn')}
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1">
        <p className="text-center text-sm text-gym-muted">{t('forgotPasswordSubtitle')}</p>
      </div>

      {errors.root && (
        <p role="alert" className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {errors.root.message}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="sr-only">{t('email')}</label>
        <input
          id="email"
          type="email"
          placeholder={t('email')}
          autoComplete="email"
          aria-required="true"
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
          className={inputClass}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="glow-accent h-11 rounded-lg bg-gym-accent font-semibold text-white transition-all hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50"
      >
        {isSubmitting ? t('sendingResetLink') : t('sendResetLink')}
      </button>

      <Link href="/login" className="text-center text-sm text-gym-accent hover:underline">
        {t('backToSignIn')}
      </Link>
    </form>
  )
}
