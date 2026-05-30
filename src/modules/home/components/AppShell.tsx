'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ShellUser } from '../types'
import { BottomNav } from './BottomNav'

type AppShellProps = {
  user: ShellUser
  children: React.ReactNode
}

export function AppShell({ user: _user, children }: AppShellProps) {
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
        <main className="flex-1 pb-16 pt-14">{children}</main>
        <BottomNav />
      </div>
    </QueryClientProvider>
  )
}
