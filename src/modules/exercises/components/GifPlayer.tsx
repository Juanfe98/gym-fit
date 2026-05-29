'use client'

import { useState } from 'react'

interface GifPlayerProps {
  gifUrl: string
  alt: string
}

export function GifPlayer({ gifUrl, alt }: GifPlayerProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="aspect-video w-full max-w-xs mx-auto rounded-lg bg-gym-surface-2 flex items-center justify-center">
        <span className="text-xs text-gym-muted">{alt}</span>
      </div>
    )
  }

  return (
    <>
      {!loaded && (
        <div className="aspect-video w-full max-w-xs mx-auto rounded-lg bg-gym-surface-2 animate-pulse" />
      )}
      <img
        src={gifUrl}
        alt={alt}
        className={loaded ? 'aspect-video w-full max-w-xs mx-auto rounded-lg object-cover' : 'hidden'}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </>
  )
}
