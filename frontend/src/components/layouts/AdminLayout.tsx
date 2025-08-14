import { Link, useNavigate } from '@tanstack/react-router'
import { LayoutDashboard, LogOut, PlayCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { useAuth } from '../../auth'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const auth = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await auth.logout()
    navigate({ to: '/login', search: { redirect: '/admin' } })
  }

  const navItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      href: '/admin',
    },
    {
      title: 'Plays',
      icon: <PlayCircle className="w-4 h-4" />,
      href: '/admin/plays',
    },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href as any}
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              activeProps={{ className: 'bg-gray-800 text-white' }}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 bg-gray-900">
          <Button
            variant="ghost"
            className="w-full text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
