import type { ReactNode } from 'react'

interface ChipProps {
  children: ReactNode
  /** When provided the chip becomes an interactive toggle button. */
  onClick?: () => void
  active?: boolean
  className?: string
}

/**
 * Pill used for tags and filters. Renders as a button when `onClick` is set
 * (44px min tap target), otherwise as a static label.
 */
export function Chip({ children, onClick, active = false, className }: ChipProps) {
  const base =
    'inline-flex items-center gap-1 rounded-full px-3 text-xs font-medium whitespace-nowrap transition-colors'
  const tone = active
    ? 'bg-gym-accent text-white'
    : 'bg-gym-surface-2 text-gym-muted'

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`${base} ${tone} min-h-[44px] ${className ?? ''}`}
      >
        {children}
      </button>
    )
  }

  return <span className={`${base} ${tone} py-1 ${className ?? ''}`}>{children}</span>
}
