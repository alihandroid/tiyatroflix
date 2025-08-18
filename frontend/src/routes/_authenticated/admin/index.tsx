import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { PlayCircle, Users } from 'lucide-react'
import { useAuth } from '../../../auth'
import { playsApi, usersApi } from '../../../lib/api'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'

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

  const stats = [
    {
      title: 'Total Plays',
      value: playsCountLoading ? '...' : playsCount?.count.toString() || '0',
      icon: <PlayCircle className="w-8 h-8 text-blue-500" />,
      description: 'Active plays in the system',
      link: '/admin/plays',
    },
    {
      title: 'Users',
      value: usersCountLoading ? '...' : usersCount?.count.toString() || '0',
      icon: <Users className="w-8 h-8 text-green-500" />,
      description: 'Registered users',
      link: '/admin/users',
    },
  ]

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}!</p>
      </div>

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
    </>
  )
}
