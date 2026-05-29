import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  /** Optional element rendered on the right (e.g. an action button). */
  action?: ReactNode
  className?: string
}

/**
 * Standard page header. Title uses the Barlow Condensed `.heading` style for a
 * consistent athletic hierarchy across every screen.
 */
export function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
  return (
    <header
      className={`flex items-start justify-between gap-3 px-4 pt-6 pb-3 ${className ?? ''}`}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <h1 className="heading text-3xl text-gym-text">{title}</h1>
        {subtitle && <p className="text-sm text-gym-muted">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}
