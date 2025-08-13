import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { SortingState } from '@tanstack/react-table'
import type { Play } from '@/types/play'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { PlayFormDialog } from '@/components/PlayFormDialog'
import { Skeleton } from '@/components/ui/skeleton'
import { playsApi } from '@/lib/api'

export const Route = createFileRoute('/_authenticated/admin/plays')({
  component: PlaysManagementComponent,
})

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  )
}

function PlaysManagementComponent() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [playToDelete, setPlayToDelete] = useState<Play | null>(null)
  const [playToEdit, setPlayToEdit] = useState<Play | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: plays = [], isLoading } = useQuery({
    queryKey: ['plays'],
    queryFn: playsApi.getAll,
  })

  const deleteMutation = useMutation({
    mutationFn: playsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plays'] })
      setPlayToDelete(null)
      toast.success('Play deleted successfully')
    },
    onError: (error) => {
      console.error('Failed to delete play:', error)
      toast.error('Failed to delete play. Please try again.')
    },
  })

  const columns = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: (info: any) => info.getValue(),
    },
    {
      accessorKey: 'director',
      header: 'Director',
      cell: (info: any) => info.getValue(),
      enableHiding: true,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: (info: any) => (
        <div className="max-w-[300px] lg:max-w-[500px] truncate">
          {info.getValue()}
        </div>
      ),
      enableHiding: true,
    },
    {
      id: 'actions',
      cell: (info: any) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPlayToEdit(info.row.original)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPlayToDelete(info.row.original)}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: plays,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const handleDelete = async (play: Play) => {
    try {
      await deleteMutation.mutateAsync(play.id)
    } catch (error) {
      // Error will be handled by mutation error callback
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold">Manage Plays</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Add New Play
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No plays found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} plays total
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <AlertDialog
        open={!!playToDelete}
        onOpenChange={() => setPlayToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the play "{playToDelete?.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => playToDelete && handleDelete(playToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PlayFormDialog
        play={playToEdit ?? undefined}
        isOpen={!!playToEdit || isCreateDialogOpen}
        onClose={() => {
          setPlayToEdit(null)
          setIsCreateDialogOpen(false)
        }}
      />
    </>
  )
}
