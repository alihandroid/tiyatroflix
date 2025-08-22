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

  if (isLoading)
    return (
      <div className="min-h-screen bg-theater-gradient flex items-center justify-center">
        <div className="text-center text-foreground">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl">Loading plays...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen bg-theater-gradient flex items-center justify-center">
        <div className="text-center text-destructive">
          <p className="text-xl">Error: {error.message}</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-theater-gradient">
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-display font-bold text-center mb-12 text-theater-gradient">
          Explore Plays
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {plays?.map((play) => (
            <Link
              to={'/plays/$id'}
              params={{ id: play.id.toString() }}
              key={play.id}
              className="group"
            >
              <Card className="bg-theater-card border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden h-full shadow-2xl group-hover:scale-105 group-hover:shadow-purple-500/20">
                <div className="aspect-[3/2] overflow-hidden bg-slate-800 relative">
                  <img
                    src={play.posterImageUrl || '/placeholder-poster.jpg'}
                    alt={play.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    style={{ viewTransitionName: `play-poster-${play.id}` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <CardHeader>
                  <CardTitle
                    className="text-lg text-foreground truncate font-display"
                    style={{ viewTransitionName: `play-title-${play.id}` }}
                  >
                    {play.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {play.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
