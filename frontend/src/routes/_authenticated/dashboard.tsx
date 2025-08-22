import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { PlayCircle, Users } from 'lucide-react'
import { playsApi, usersApi } from '@/lib/api'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const { auth } = Route.useRouteContext()

  const { data: playsCount, isLoading: playsCountLoading } = useQuery({
    queryKey: ['plays', 'count'],
    queryFn: playsApi.getCount,
  })

  const { data: usersCount, isLoading: usersCountLoading } = useQuery({
    queryKey: ['users', 'count'],
    queryFn: usersApi.getCount,
  })

  return (
    <div className="min-h-screen bg-theater-gradient">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-display font-bold text-theater-gradient mb-4">
            Welcome back, {auth.user?.firstName}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Ready to dive into the world of theater?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Link
            to="/plays"
            className="group block bg-theater-card border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 rounded-2xl p-8 shadow-2xl hover:scale-105 hover:shadow-purple-500/20"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <PlayCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                Browse Plays
              </h3>
              <p className="text-muted-foreground mb-4">
                Discover thousands of world-class theater performances
              </p>
              {playsCountLoading ? (
                <div className="text-lg text-accent">Loading...</div>
              ) : (
                <div className="text-lg text-accent font-semibold">
                  {playsCount?.count || 0} plays available
                </div>
              )}
            </div>
          </Link>

          <div className="bg-theater-card border-slate-700/50 rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                Community
              </h3>
              <p className="text-muted-foreground mb-4">
                Join theater enthusiasts from around the world
              </p>
              {usersCountLoading ? (
                <div className="text-lg text-accent">Loading...</div>
              ) : (
                <div className="text-lg text-accent font-semibold">
                  {usersCount?.count || 0} members
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/plays"
            className="inline-flex items-center gap-2 btn-theater-primary text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:btn-theater-primary transition-all"
          >
            <PlayCircle className="w-6 h-6" />
            Start Watching
          </Link>
        </div>
      </div>
    </div>
  )
}
