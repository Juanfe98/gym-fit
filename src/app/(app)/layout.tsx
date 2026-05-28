'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 pb-16">{children}</main>
        {/* Bottom navigation — populated in Phase 9 */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 border-t border-gym-border bg-gym-surface" />
      </div>
    </QueryClientProvider>
  )
}
