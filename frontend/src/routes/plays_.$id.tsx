import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import type { Play } from '@/types/play'

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
    return <div>Loading play details...</div>
  }

  if (error) {
    return <div>Error loading play: {error.message}</div>
  }

  if (!play) {
    return <div>Play not found.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        {play.title ?? 'Untitled Play'}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          {play.posterImageUrl && (
            <img
              src={play.posterImageUrl}
              alt={`${play.title ?? 'Untitled Play'} Poster`}
              className="w-full rounded-lg shadow-lg"
            />
          )}
        </div>
        <div className="md:col-span-2">
          <p className="text-lg mb-4">
            {play.description ?? 'No description available.'}
          </p>
          <p className="mb-2">
            <strong>Director:</strong> {play.director ?? 'Unknown Director'}
          </p>
          {play.trailerUrl && (
            <div className="mt-4">
              <a
                href={play.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Watch Trailer
              </a>
            </div>
          )}
          {play.videoUrl && (
            <div className="mt-2">
              <a
                href={play.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Watch Play
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
