import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Room } from "@/types/room"

interface DeleteRoomDialogProps {
  room: Room | null
  onOpenChange: (open: boolean) => void
  onConfirm: (room: Room) => void
}

export function DeleteRoomDialog({ room, onOpenChange, onConfirm }: DeleteRoomDialogProps) {
  return (
    <AlertDialog open={room !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete room?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete &quot;{room?.title}&quot;. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => room && onConfirm(room)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
