import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ExternalLink, Play as PlayIcon } from 'lucide-react'
import type { Play } from '@/types/play'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const fetchPlay = async (id: string | number): Promise<Play> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/plays/${id}`,
  )
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return await response.json()
}

export const Route = createFileRoute('/plays_/$id')({
  component: PlayDetails,
  beforeLoad: ({ params }) => {
    return {
      playQueryOptions: {
        queryKey: ['plays', params.id],
        queryFn: () => fetchPlay(params.id),
        staleTime: 2 * 60 * 1000, // 2 minutes
      },
    }
  },
  loader: async ({ context: { queryClient, playQueryOptions } }) => {
    await queryClient.prefetchQuery(playQueryOptions)
  },
})

function PlayDetails() {
  const { playQueryOptions } = Route.useRouteContext()
  const { data: play, isLoading, error } = useQuery(playQueryOptions)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-theater-gradient flex items-center justify-center">
        <div className="text-center text-foreground">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl">Loading play details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-theater-gradient flex items-center justify-center">
        <div className="text-center text-destructive">
          <p className="text-xl">Error loading play: {error.message}</p>
        </div>
      </div>
    )
  }

  if (!play) {
    return (
      <div className="min-h-screen bg-theater-gradient flex items-center justify-center">
        <div className="text-center text-foreground">
          <p className="text-xl">Play not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-theater-gradient">
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-display font-bold text-center mb-12 text-theater-gradient">
          {play.title ?? 'Untitled Play'}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Card className="bg-theater-card border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden shadow-2xl hover:shadow-purple-500/20 p-0">
              <div className="aspect-[2/3] overflow-hidden bg-slate-800 relative">
                {play.posterImageUrl ? (
                  <img
                    src={play.posterImageUrl}
                    alt={`${play.title ?? 'Untitled Play'} Poster`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <PlayIcon className="w-24 h-24 text-purple-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <Card className="bg-theater-card border-slate-700/50 p-8 shadow-2xl">
              <CardContent className="space-y-6 p-0">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Description
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {play.description ?? 'No description available.'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  {play.trailerUrl && (
                    <Button
                      asChild
                      className="btn-theater-primary hover:btn-theater-primary text-white font-semibold"
                    >
                      <a
                        href={play.trailerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <PlayIcon className="w-5 h-5" />
                        Watch Trailer
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {play.videoUrl && (
                    <Button
                      asChild
                      variant="outline"
                      className="border-purple-400/50 text-purple-300 hover:bg-purple-500/10 font-semibold"
                    >
                      <a
                        href={play.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <PlayIcon className="w-5 h-5" />
                        Watch Full Play
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
