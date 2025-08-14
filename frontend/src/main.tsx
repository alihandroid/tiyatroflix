import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

import App from './App.tsx'

// Initialize Sentry
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
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
