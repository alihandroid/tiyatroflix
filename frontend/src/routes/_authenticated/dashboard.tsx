import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { PlayCircle, Users } from 'lucide-react'
import { useAuth } from '@/auth'
import { playsApi, usersApi } from '@/lib/api'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const auth = useAuth()

  const { data: playsCount, isLoading: playsCountLoading } = useQuery({
    queryKey: ['plays', 'count'],
    queryFn: playsApi.getCount,
  })

  const { data: usersCount, isLoading: usersCountLoading } = useQuery({
    queryKey: ['users', 'count'],
    queryFn: usersApi.getCount,
  })

  const handleLogout = async () => {
    await auth.logout()
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Welcome back!</h2>
        <p className="text-gray-600">
          Hello, <strong>{auth.user?.firstName}</strong>! You are successfully
          authenticated.
        </p>
        <p className="text-sm text-gray-500 mt-2">Email: {auth.user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Link
          to="/plays"
          className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-600">Plays</h3>
              <p className="text-2xl font-bold text-gray-800">
                {playsCountLoading
                  ? '...'
                  : playsCount?.count.toString() || '0'}
              </p>
              <p className="text-sm text-gray-500">View all plays</p>
            </div>
            <PlayCircle className="w-12 h-12 text-blue-500" />
          </div>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-600">Users</h3>
              <p className="text-2xl font-bold text-gray-800">
                {usersCountLoading
                  ? '...'
                  : usersCount?.count.toString() || '0'}
              </p>
              <p className="text-sm text-gray-500">Registered users</p>
            </div>
            <Users className="w-12 h-12 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
