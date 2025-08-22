import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, X } from 'lucide-react'
import type { Play } from '@/types/play'
import { Button } from '@/components/ui/button'
import { createYouTubeFullscreenEmbedUrl } from '@/lib/youtube'

const fetchPlay = async (id: string | number): Promise<Play> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/plays/${id}`,
  )
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return await response.json()
}

export const Route = createFileRoute('/_authenticated/plays_/$id_/watch')({
  component: WatchPlay,
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

function WatchPlay() {
  const { playQueryOptions } = Route.useRouteContext()
  const { data: play, isLoading, error } = useQuery(playQueryOptions)
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading play...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-red-400">
          <p className="text-xl mb-4">Error loading play: {error.message}</p>
          <Button
            onClick={() => navigate({ to: '/plays' })}
            variant="outline"
            className="border-red-400/50 text-red-300 hover:bg-red-500/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plays
          </Button>
        </div>
      </div>
    )
  }

  if (!play) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl mb-4">Play not found.</p>
          <Button
            onClick={() => navigate({ to: '/plays' })}
            variant="outline"
            className="border-purple-400/50 text-purple-300 hover:bg-purple-500/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plays
          </Button>
        </div>
      </div>
    )
  }

  const embedUrl = play.videoUrl
    ? createYouTubeFullscreenEmbedUrl(play.videoUrl)
    : null

  if (!embedUrl) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl mb-4">Video not available for this play.</p>
          <Button
            onClick={() =>
              navigate({ to: '/plays/$id', params: { id: play.id.toString() } })
            }
            variant="outline"
            className="border-purple-400/50 text-purple-300 hover:bg-purple-500/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Play Details
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Control Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() =>
                navigate({
                  to: '/plays/$id',
                  params: { id: play.id.toString() },
                })
              }
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="text-white">
              <h1 className="text-lg font-semibold">
                {play.title ?? 'Untitled Play'}
              </h1>
            </div>
          </div>
          <Button
            onClick={() => navigate({ to: '/plays' })}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Video Player */}
      <div className="w-full h-screen pt-16">
        <iframe
          src={embedUrl}
          title={`${play.title ?? 'Play'} - Full Video`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  )
}
