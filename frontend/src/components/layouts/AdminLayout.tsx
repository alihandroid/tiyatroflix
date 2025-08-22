import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  LayoutDashboard,
  LogOut,
  PlayCircle,
  Users,
} from 'lucide-react'
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
    navigate({ to: '/login', search: { redirect: '/plays' } })
  }

  const navItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: '/admin',
    },
    {
      title: 'Plays',
      icon: <PlayCircle className="w-5 h-5" />,
      href: '/admin/plays',
    },
    {
      title: 'Users',
      icon: <Users className="w-5 h-5" />,
      href: '/admin/users',
    },
  ]

  return (
    <div className="min-h-screen flex bg-theater-gradient">
      {/* Sidebar */}
      <aside className="w-72 bg-theater-card backdrop-blur-md border-r border-slate-700/50">
        <div className="p-6">
          <h1 className="text-2xl font-display font-bold text-theater-gradient">
            Admin Panel
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Theater Management
          </p>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href as any}
              className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all duration-200"
              activeProps={{
                className:
                  'bg-primary/20 text-primary border border-primary/30',
              }}
            >
              {item.icon}
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4 space-y-3">
          <Link
            to="/plays"
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all duration-200 w-full"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Plays</span>
          </Link>

          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start px-4 py-2 text-muted-foreground hover:text-foreground border border-border/50 rounded-lg hover:border-border transition-all font-medium"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-theater-gradient">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
