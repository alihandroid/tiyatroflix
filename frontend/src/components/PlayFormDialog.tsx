import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PlayForm } from './PlayForm'
import type { Play } from '@/types/play'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { playsApi } from '@/lib/api'

interface PlayFormDialogProps {
  play?: Play
  isOpen: boolean
  onClose: () => void
}

export function PlayFormDialog({ play, isOpen, onClose }: PlayFormDialogProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: Omit<Play, 'id'>) => {
      if (play) {
        return playsApi.update(play.id, data)
      }
      return playsApi.create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plays'] })
      toast.success(
        play ? 'Play updated successfully' : 'Play created successfully',
      )
      onClose()
    },
    onError: () => {
      toast.error(play ? 'Failed to update play' : 'Failed to create play')
    },
  })

  const handleSubmit = async (data: Omit<Play, 'id'>) => {
    await mutation.mutateAsync(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{play ? 'Edit Play' : 'Create New Play'}</DialogTitle>
        </DialogHeader>
        <PlayForm
          play={play}
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
        />
      </DialogContent>
    </Dialog>
  )
}
