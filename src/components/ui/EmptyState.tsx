import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  Icon: LucideIcon
  title: string
  message?: string
  /** Optional action node (e.g. a button or link). */
  action?: ReactNode
  className?: string
}

/** Centered empty / error placeholder with an icon, copy, and optional action. */
export function EmptyState({ Icon, title, message, action, className }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center gap-3 px-6 py-12 text-center ${className ?? ''}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gym-surface-2 text-gym-muted">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="heading text-lg text-gym-text">{title}</p>
        {message && <p className="text-sm text-gym-muted">{message}</p>}
      </div>
      {action}
    </div>
  )
}
