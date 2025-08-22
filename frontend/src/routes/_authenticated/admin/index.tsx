import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { PlayCircle, Settings, Shield, Users } from 'lucide-react'
import { useAuth } from '../../../auth'
import { playsApi, usersApi } from '../../../lib/api'

export const Route = createFileRoute('/_authenticated/admin/')({
  component: AdminDashboardComponent,
})

function AdminDashboardComponent() {
  const { user } = useAuth()

  const { data: playsCount, isLoading: playsCountLoading } = useQuery({
    queryKey: ['plays', 'count'],
    queryFn: playsApi.getCount,
  })

  const { data: usersCount, isLoading: usersCountLoading } = useQuery({
    queryKey: ['users', 'count'],
    queryFn: usersApi.getCount,
  })

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-display font-bold text-theater-gradient mb-4">
          Admin Dashboard
        </h1>
        <p className="text-xl text-muted-foreground">
          Welcome back, {user?.firstName}! Manage your theater platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Link
          to="/admin/plays"
          className="group block bg-theater-card border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 rounded-2xl p-8 shadow-2xl hover:scale-105 hover:shadow-purple-500/20"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <PlayCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-3">
              Manage Plays
            </h3>
            <p className="text-muted-foreground mb-4">
              Add, edit, and organize theater performances
            </p>
            {playsCountLoading ? (
              <div className="text-lg text-accent">Loading...</div>
            ) : (
              <div className="text-lg text-accent font-semibold">
                {playsCount?.count || 0} plays in system
              </div>
            )}
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="group block bg-theater-card border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 rounded-2xl p-8 shadow-2xl hover:scale-105 hover:shadow-purple-500/20"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-3">
              User Management
            </h3>
            <p className="text-muted-foreground mb-4">
              Manage registered users and permissions
            </p>
            {usersCountLoading ? (
              <div className="text-lg text-accent">Loading...</div>
            ) : (
              <div className="text-lg text-accent font-semibold">
                {usersCount?.count || 0} registered users
              </div>
            )}
          </div>
        </Link>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-theater-card border-slate-700/50 rounded-xl px-6 py-3 shadow-xl">
          <Settings className="w-5 h-5 text-muted-foreground" />
          <span className="text-muted-foreground font-medium">
            Admin Controls Active
          </span>
        </div>
      </div>
    </div>
  )
}
