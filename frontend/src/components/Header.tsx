import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from './ui/button'
import { useAuth } from '@/auth'

export default function Header() {
  const auth = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    auth.logout()
    navigate({ to: '/', replace: true })
  }

  return (
    <header className="w-full bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <nav className="flex flex-row items-center">
          <div className="px-3 py-2 font-display font-bold text-xl">
            <Link
              to="/"
              className="text-theater-gradient hover:opacity-80 transition-opacity"
            >
              TiyatroFlix
            </Link>
          </div>
          {auth.user && (
            <>
              <div className="px-3 py-2 font-medium">
                <Link
                  to="/dashboard"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </div>

              {auth.user.roles.includes('Admin') && (
                <div className="px-3 py-2 font-medium">
                  <Link
                    to="/admin"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Admin
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>

        <div className="flex flex-row items-center gap-3">
          {auth.user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {auth.user.firstName} {auth.user.lastName}
              </span>
              <Button asChild>
                <Link
                  to="/"
                  onClick={handleLogout}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                >
                  Logout
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                search={{ redirect: '/plays' }}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                search={{ redirect: '/plays' }}
                className="px-4 py-2 btn-theater-primary text-white rounded-lg hover:btn-theater-primary transition-all font-medium shadow-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
