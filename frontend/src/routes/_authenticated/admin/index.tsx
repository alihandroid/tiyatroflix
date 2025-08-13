import { createFileRoute } from '@tanstack/react-router'
import { Calendar, PlayCircle, Users } from 'lucide-react'
import { useAuth } from '../../../auth'
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

  const stats = [
    {
      title: 'Total Plays',
      value: '23',
      icon: <PlayCircle className="w-8 h-8 text-blue-500" />,
      description: 'Active plays in the system',
    },
    {
      title: 'Users',
      value: '142',
      icon: <Users className="w-8 h-8 text-green-500" />,
      description: 'Registered users',
    },
    {
      title: 'Upcoming Shows',
      value: '5',
      icon: <Calendar className="w-8 h-8 text-purple-500" />,
      description: 'Shows scheduled this week',
    },
  ]

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
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
        ))}
      </div>
    </>
  )
}
