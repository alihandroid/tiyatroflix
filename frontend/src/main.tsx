import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

import App from './App.tsx'

// Initialize Sentry
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Session Replay
  replaysSessionSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
  replaysOnErrorSampleRate: 1.0,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
  tracePropagationTargets: ['localhost', import.meta.env.VITE_API_BASE_URL],
  // Enable in both development and production for testing
  enabled: !!import.meta.env.VITE_SENTRY_DSN,
  debug: import.meta.env.DEV, // Show debug info in development
  beforeSend(event) {
    // Log errors to console in development
    if (import.meta.env.DEV) {
      console.log('Sentry event:', event)
    }
    return event
  },
})

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<App />)
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
