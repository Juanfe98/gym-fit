type SectionCardProps = {
  title: string
  children: React.ReactNode
}

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <div className="card-elevated flex flex-col gap-3 p-4">
      <h2 className="heading text-lg text-gym-text">{title}</h2>
      {children}
    </div>
  )
}
