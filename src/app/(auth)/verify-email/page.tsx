'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useI18n } from '@/i18n/client'
import { AuthFormWrapper } from '@/modules/auth'

type ResendStatus = 'idle' | 'sending' | 'sent' | 'error'

export default function VerifyEmailPage() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [resendStatus, setResendStatus] = useState<ResendStatus>('idle')

  async function handleResend() {
    if (!email) return
    setResendStatus('sending')
    const supabase = createClient()
    const { error } = await supabase.auth.resend({ type: 'signup', email })
    setResendStatus(error ? 'error' : 'sent')
  }

  return (
    <AuthFormWrapper>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-xl font-semibold text-gym-text">{t('verifyEmailTitle')}</h2>
          <p className="text-sm text-gym-muted">{t('verifyEmailBody')}</p>
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="resend-email" className="sr-only">{t('email')}</label>
          <input
            id="resend-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('email')}
            className="h-11 rounded-lg border border-gym-border bg-gym-surface px-3 text-sm focus:border-gym-border-strong focus:outline-none"
          />
          <button
            type="button"
            disabled={resendStatus === 'sending' || !email}
            onClick={handleResend}
            className="h-11 rounded-lg bg-gym-accent font-semibold text-white disabled:opacity-50"
          >
            {resendStatus === 'sending' ? t('resendingEmail') : t('resendEmail')}
          </button>
          {resendStatus === 'sent' && (
            <p role="alert" className="text-center text-sm text-gym-muted">{t('emailResentConfirm')}</p>
          )}
          {resendStatus === 'error' && (
            <p role="alert" className="text-center text-sm text-red-400">{t('authNetworkError')}</p>
          )}
        </div>
        <Link href="/login" className="text-center text-sm text-gym-accent hover:underline">
          {t('backToSignIn')}
        </Link>
      </div>
    </AuthFormWrapper>
  )
}
