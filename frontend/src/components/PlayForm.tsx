import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import type { Play } from '@/types/play'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const playFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  director: z.string().min(1, 'Director is required'),
  description: z.string().min(1, 'Description is required'),
  posterImageUrl: z.string().url('Must be a valid URL').optional(),
  trailerUrl: z.string().url('Must be a valid URL').optional(),
  videoUrl: z.string().url('Must be a valid URL').optional(),
})

type PlayFormValues = z.infer<typeof playFormSchema>

interface PlayFormProps {
  play?: Play
  onSubmit: (data: PlayFormValues) => Promise<void>
  isSubmitting?: boolean
}

export function PlayForm({ play, onSubmit, isSubmitting }: PlayFormProps) {
  const form = useForm<PlayFormValues>({
    resolver: zodResolver(playFormSchema),
    defaultValues: {
      title: play?.title || '',
      director: play?.director || '',
      description: play?.description || '',
      posterImageUrl: play?.posterImageUrl || '',
      trailerUrl: play?.trailerUrl || '',
      videoUrl: play?.videoUrl || '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter play title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="director"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Director</FormLabel>
              <FormControl>
                <Input placeholder="Enter director name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter play description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="posterImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poster Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter poster image URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="trailerUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trailer URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter trailer URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter video URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {play ? 'Update Play' : 'Create Play'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
