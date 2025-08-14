import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin')({
  beforeLoad: ({ context }) => {
    if (!context.auth.user?.roles.includes('Admin')) {
      throw redirect({ to: '/' })
    }
  },
  component: () => (
    <div className="container mx-auto p-4">
      <Outlet />
    </div>
  ),
})
