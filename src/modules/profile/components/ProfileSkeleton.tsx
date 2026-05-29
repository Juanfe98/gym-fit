export function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 pb-6 pt-6 animate-pulse">
      {/* Header card */}
      <div className="card-elevated flex items-center gap-4 p-4">
        <div className="h-16 w-16 rounded-full bg-gym-surface-2" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-5 w-32 rounded bg-gym-surface-2" />
          <div className="h-4 w-24 rounded bg-gym-surface-2" />
          <div className="h-3 w-20 rounded bg-gym-surface-2" />
        </div>
      </div>

      {/* 2-column grid on desktop, single column on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="card-elevated p-4 flex flex-col gap-3">
            <div className="h-5 w-28 rounded bg-gym-surface-2" />
            <div className="h-4 w-full rounded bg-gym-surface-2" />
            <div className="h-4 w-3/4 rounded bg-gym-surface-2" />
          </div>
        ))}
      </div>
    </div>
  )
}
