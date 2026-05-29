interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

/** Small uppercase muted label that introduces a section. */
export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-wide text-gym-muted ${className ?? ''}`}
    >
      {children}
    </p>
  )
}
