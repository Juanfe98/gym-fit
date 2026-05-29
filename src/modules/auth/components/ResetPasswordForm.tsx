'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { resetPasswordSchema, type ResetPasswordInput } from '../validation/reset-password.schema'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/i18n/client'

const inputClass =
  'h-11 rounded-lg border border-gym-border bg-gym-surface px-3 text-sm focus:border-gym-border-strong focus:outline-none'

export function ResetPasswordForm() {
  const { t } = useI18n()
  const router = useRouter()
  const [isInvalidLink, setIsInvalidLink] = useState(false)
  const [checked, setChecked] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) setIsInvalidLink(true)
      setChecked(true)
    })
  }, [])

  async function onSubmit({ password }: ResetPasswordInput) {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError('root', { message: t('authError') })
      return
    }
    router.push('/login')
  }

  if (!checked) return null

  if (isInvalidLink) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm text-red-400">{t('resetLinkInvalid')}</p>
        <Link href="/forgot-password" className="text-sm text-gym-accent hover:underline">
          {t('requestNewLink')}
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <h2 className="text-center text-xl font-semibold text-gym-text">{t('resetPasswordTitle')}</h2>

      {errors.root && (
        <p role="alert" className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {errors.root.message}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="sr-only">{t('newPassword')}</label>
          <input
            id="password"
            type="password"
            placeholder={t('newPassword')}
            autoComplete="new-password"
            aria-required="true"
            aria-describedby={errors.password ? 'password-error' : 'password-hint'}
            {...register('password')}
            className={inputClass}
          />
          {errors.password ? (
            <p id="password-error" role="alert" className="text-xs text-red-400">{errors.password.message}</p>
          ) : (
            <p id="password-hint" className="text-xs text-gym-muted">{t('passwordRequirements')}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword" className="sr-only">{t('confirmPassword')}</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder={t('confirmPassword')}
            autoComplete="new-password"
            aria-required="true"
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            {...register('confirmPassword')}
            className={inputClass}
          />
          {errors.confirmPassword && (
            <p id="confirmPassword-error" role="alert" className="text-xs text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="glow-accent h-11 rounded-lg bg-gym-accent font-semibold text-white transition-all hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50"
      >
        {isSubmitting ? t('savingPassword') : t('savePassword')}
      </button>
    </form>
  )
}
