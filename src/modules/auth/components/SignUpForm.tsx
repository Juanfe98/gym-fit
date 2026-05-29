'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUpSchema, type SignUpInput } from '../validation/sign-up.schema'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/i18n/client'
import { PasswordInput } from './PasswordInput'
import { AuthSubmitButton } from './AuthSubmitButton'

const inputClass =
  'h-11 rounded-lg border border-gym-border bg-gym-surface px-3 text-sm focus:border-gym-border-strong focus:outline-none'

export function SignUpForm() {
  const { t } = useI18n()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) })

  async function onSubmit({ name, email, password }: SignUpInput) {
    const supabase = createClient()
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    if (error) {
      setError('root', { message: t('authError') })
      return
    }
    if (data.session !== null) {
      router.push('/onboarding/welcome')
    } else if (data.user !== null) {
      router.push('/verify-email')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <h2 className="text-center text-xl font-semibold text-gym-text">{t('signUpTitle')}</h2>

      {errors.root && (
        <p role="alert" className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {errors.root.message}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="sr-only">{t('name')}</label>
          <input
            id="name"
            type="text"
            placeholder={t('name')}
            autoComplete="name"
            aria-required="true"
            aria-describedby={errors.name ? 'name-error' : undefined}
            {...register('name')}
            className={inputClass}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="text-xs text-danger">{errors.name.message}</p>
          )}
        </div>

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
            <p id="email-error" role="alert" className="text-xs text-danger">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="sr-only">{t('password')}</label>
          <PasswordInput
            id="password"
            placeholder={t('password')}
            autoComplete="new-password"
            aria-required="true"
            aria-describedby={errors.password ? 'password-error' : 'password-hint'}
            {...register('password')}
            className={inputClass}
          />
          {errors.password ? (
            <p id="password-error" role="alert" className="text-xs text-danger">{errors.password.message}</p>
          ) : (
            <p id="password-hint" className="text-xs text-gym-muted">{t('passwordRequirements')}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword" className="sr-only">{t('confirmPassword')}</label>
          <PasswordInput
            id="confirmPassword"
            placeholder={t('confirmPassword')}
            autoComplete="new-password"
            aria-required="true"
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            {...register('confirmPassword')}
            className={inputClass}
          />
          {errors.confirmPassword && (
            <p id="confirmPassword-error" role="alert" className="text-xs text-danger">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-3 min-h-[44px]">
            <input
              type="checkbox"
              aria-required="true"
              aria-describedby={errors.termsAccepted ? 'terms-error' : undefined}
              {...register('termsAccepted')}
              className="h-5 w-5 accent-gym-accent"
            />
            <span className="text-sm text-gym-muted">{t('termsLabel')}</span>
          </label>
          {errors.termsAccepted && (
            <p id="terms-error" role="alert" className="text-xs text-danger">{errors.termsAccepted.message}</p>
          )}
        </div>
      </div>

      <AuthSubmitButton loading={isSubmitting}>
        {isSubmitting ? t('signingUp') : t('signUp')}
      </AuthSubmitButton>

      <p className="text-center text-sm text-gym-muted">
        {t('alreadyHaveAccount')}{' '}
        <Link href="/login" className="text-gym-accent hover:underline">
          {t('signIn')}
        </Link>
      </p>
    </form>
  )
}
