'use client'

import { useState } from 'react'
import { Dumbbell } from 'lucide-react'

interface GifPlayerProps {
  gifUrl: string
  alt: string
}

export function GifPlayer({ gifUrl, alt }: GifPlayerProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-gym-surface-2">
        <Dumbbell className="h-10 w-10 text-gym-muted" aria-hidden="true" />
        <span className="sr-only">{alt}</span>
      </div>
    )
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gym-surface-2">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gym-surface-2" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={gifUrl}
        alt={alt}
        className={`h-full w-full object-contain transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  )
}
