import { createFileRoute, redirect } from '@tanstack/react-router'
import LandingPage from '@/components/LandingPage'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: LandingPage,
})
