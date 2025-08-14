import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { AuthProvider, useAuth } from './auth'
import { router } from './router'
import { ErrorBoundary } from './components/ErrorBoundary'
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

function App() {
  return (
    <StrictMode>
      <ErrorBoundary>
        <TanStackQueryProvider.Provider>
          <AuthProvider>
            <InnerApp />
          </AuthProvider>
        </TanStackQueryProvider.Provider>
      </ErrorBoundary>
    </StrictMode>
  )
}

export default App
