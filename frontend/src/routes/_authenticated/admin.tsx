import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin')({
  beforeLoad: ({ context }) => {
    console.log(context.auth.user?.roles)
    if (!context.auth.user?.roles.includes('Admin')) {
      throw redirect({ to: '/' })
    }
  },
  component: () => <Outlet />,
})
