import * as Sentry from '@sentry/react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface ErrorFallbackProps {
  error: unknown
  resetError: () => void
}

function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const errorMessage =
    error instanceof Error ? error.message : 'Unknown error occurred'
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-red-900">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            We've encountered an unexpected error. Our team has been notified.
          </p>
          {import.meta.env.DEV && (
            <details className="bg-gray-50 p-3 rounded text-sm">
              <summary className="cursor-pointer font-medium">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs overflow-auto">{errorMessage}</pre>
            </details>
          )}
          <div className="flex gap-2">
            <Button onClick={resetError} className="flex-1">
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/')}
              className="flex-1"
            >
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const ErrorBoundary = Sentry.withErrorBoundary(
  ({ children }: { children: React.ReactNode }) => <>{children}</>,
  {
    fallback: ErrorFallback,
    beforeCapture: (scope, error) => {
      scope.setTag('errorBoundary', true)
      scope.setContext('errorInfo', {
        componentStack: error instanceof Error ? error.stack : 'Unknown stack',
      })
    },
  },
)
