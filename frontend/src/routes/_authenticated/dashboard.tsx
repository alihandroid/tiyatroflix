import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { PlayCircle, Users } from 'lucide-react'
import { playsApi, usersApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

  const handleLogout = async () => {
    await auth.logout()
  }

  const stats = [
    {
      title: 'Total Plays',
      value: playsCountLoading ? '...' : playsCount?.count.toString() || '0',
      icon: <PlayCircle className="w-8 h-8 text-blue-500" />,
      description: 'View all plays',
      link: '/plays',
    },
    {
      title: 'Users',
      value: usersCountLoading ? '...' : usersCount?.count.toString() || '0',
      icon: <Users className="w-8 h-8 text-green-500" />,
      description: 'Registered users',
    },
  ]

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Welcome back!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Hello, <strong>{auth.user?.firstName}</strong>! You are successfully
            authenticated.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Email: {auth.user?.email}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => {
          const CardComponent = stat.link ? Link : 'div'
          const cardProps = stat.link ? { to: stat.link } : {}

          return (
            <CardComponent
              key={stat.title}
              {...cardProps}
              className={
                stat.link ? 'block transition-transform hover:scale-105' : ''
              }
            >
              <Card
                className={
                  stat.link
                    ? 'cursor-pointer hover:shadow-lg transition-shadow'
                    : ''
                }
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </CardComponent>
          )
        })}
      </div>
    </div>
  )
}
