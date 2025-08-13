import { Link } from '@tanstack/react-router'
import { useAuth } from '@/auth'

export default function Header() {
  const auth = useAuth()
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
    </header>
  )
}
