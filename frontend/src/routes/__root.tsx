import {
  Outlet,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from 'sonner'
import Header from '../components/Header'
import TanStackQueryLayout from '../integrations/tanstack-query/layout'
import type { QueryClient } from '@tanstack/react-query'
import type { User } from '../lib/api'

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

interface MyRouterContext {
  queryClient: QueryClient
  auth: AuthState
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  const showHeader = location.pathname !== '/'

  return (
    <>
      {showHeader && <Header />}
      <Outlet />
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
      <Toaster position="top-right" richColors />
    </>
  )
}
