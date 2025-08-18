import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/auth'

export default function Header() {
  const auth = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    auth.logout()
    navigate({ to: '/', replace: true })
  }

  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between container mx-auto">
      <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/">Home</Link>
        </div>
        {auth.user && (
          <>
            <div className="px-2 font-bold">
              <Link to="/dashboard">Dashboard</Link>
            </div>

            {auth.user.roles.includes('Admin') && (
              <div className="px-2 font-bold">
                <Link to="/admin">Admin</Link>
              </div>
            )}
          </>
        )}
      </nav>

      <div className="flex flex-row items-center gap-2">
        {auth.user ? (
          <>
            <span className="text-sm">
              {auth.user.firstName} {auth.user.lastName}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              search={{ redirect: '/dashboard' }}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
              to="/signup"
              search={{ redirect: '/dashboard' }}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
