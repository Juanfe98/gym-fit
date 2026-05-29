'use client'

import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useI18n } from '@/i18n/client'

type PasswordInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>

/**
 * Password field with a show/hide toggle. Forwards its ref so it works with
 * react-hook-form `register`, and spreads all other input props.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ className, ...props }, ref) {
    const { t } = useI18n()
    const [show, setShow] = useState(false)

    return (
      <div className="relative">
        <input
          ref={ref}
          type={show ? 'text' : 'password'}
          className={`w-full pr-11 ${className ?? ''}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? t('hidePassword') : t('showPassword')}
          className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-gym-muted transition-colors hover:text-gym-text"
          tabIndex={-1}
        >
          {show ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    )
  }
)
