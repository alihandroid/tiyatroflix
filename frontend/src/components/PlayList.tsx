import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import type { Play } from '../types/play'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const PlayList: React.FC = () => {
  const {
    isLoading,
    error,
    data: plays,
  } = useQuery<Array<Play>>({
    queryKey: ['plays'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/plays`)
      if (!response.ok) {
        throw new Error('Error fetching plays')
      }
      return (await response.json()) as Array<Play>
    },
  })

  if (isLoading) return <div className="text-center py-20">Loading...</div>
  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        Error: {error.message}
      </div>
    )

  return (
    <section className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Explore Plays</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {plays?.map((play) => (
          <Link to={`/plays/${play.id}`} key={play.id}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg truncate">{play.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-w-2 aspect-h-3 mb-4 overflow-hidden rounded-md">
                  <img
                    src={play.posterImageUrl || '/placeholder-poster.jpg'}
                    alt={play.title}
                    className="w-full h-full object-cover"
                  />
                </div>
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

export default PlayList
