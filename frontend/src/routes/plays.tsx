import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import type { Play } from '@/types/play'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

async function fetchPlays(): Promise<Array<Play>> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/plays`)
  if (!response.ok) {
    throw new Error('Error fetching plays')
  }
  return await response.json()
}

export const Route = createFileRoute('/plays')({
  component: PlaysRoute,
  beforeLoad: () => {
    return {
      playsQueryOptions: {
        queryKey: ['plays'],
        queryFn: () => fetchPlays(),
        staleTime: 2 * 60 * 1000, // 2 minutes
      },
    }
  },
  loader: async ({ context: { queryClient, playsQueryOptions } }) => {
    await queryClient.prefetchQuery(playsQueryOptions)
  },
})

function PlaysRoute() {
  const playsQueryOptions = Route.useRouteContext().playsQueryOptions
  const {
    isLoading,
    error,
    data: plays,
  } = useQuery<Array<Play>>(playsQueryOptions)

  if (isLoading) return <div className="text-center py-20">Loading...</div>
  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        Error: {error.message}
      </div>
    )

  return (
    <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Explore Plays</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {plays?.map((play) => (
          <Link
            to={'/plays/$id'}
            params={{ id: play.id.toString() }}
            key={play.id}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden pt-0 h-full">
              <div className="aspect-[3/2] overflow-hidden bg-gray-100">
                <img
                  src={play.posterImageUrl || '/placeholder-poster.jpg'}
                  alt={play.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg truncate">{play.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2 font-semibold">
                  Director: {play.director}
                </p>
                <p className="text-sm text-gray-500 line-clamp-3">
                  {play.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
