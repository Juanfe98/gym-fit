'use client'

import { Loader2 } from 'lucide-react'

type AuthSubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}

/** Primary auth action button with brand glow and a loading spinner. */
export function AuthSubmitButton({
  loading = false,
  disabled,
  className,
  children,
  ...rest
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`glow-accent flex h-11 items-center justify-center gap-2 rounded-lg bg-gym-accent font-semibold text-white transition-all hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none ${className ?? ''}`}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}
