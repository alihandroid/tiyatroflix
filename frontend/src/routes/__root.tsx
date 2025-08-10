import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Header'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'

interface AuthState {
  isAuthenticated: boolean
  user: { id: string; username: string; email: string } | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

interface MyRouterContext {
  queryClient: QueryClient
  auth: AuthState
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Header />

      <Outlet />
      <TanStackRouterDevtools />

      <TanStackQueryLayout />
    </>
  ),
})
