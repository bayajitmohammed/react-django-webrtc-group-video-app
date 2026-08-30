import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RoomCard } from "@/features/lobby/components/RoomCard"
import { RoomFormDialog } from "@/features/lobby/components/RoomFormDialog"
import { DeleteRoomDialog } from "@/features/lobby/components/DeleteRoomDialog"
import { useCreateRoom, useDeleteRoom, useRooms, useUpdateRoom } from "@/features/lobby/hooks"
import { useAuthStore } from "@/features/auth/store"
import { ApiError } from "@/lib/apiClient"
import type { RoomFormSchemaValues } from "@/features/lobby/schema"
import type { Room } from "@/types/room"

export function LobbyPage() {
  const currentUserId = useAuthStore((state) => state.user?.id)
  const { data: rooms = [], isLoading, isError } = useRooms()
  const createRoom = useCreateRoom()
  const updateRoom = useUpdateRoom()
  const deleteRoom = useDeleteRoom()

  const [search, setSearch] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null)

  const visibleRooms = rooms.filter((room) =>
    room.title.toLowerCase().includes(search.toLowerCase())
  )

  function handleCreate(values: RoomFormSchemaValues) {
    createRoom.mutate(values, {
      onSuccess: () => setIsCreateOpen(false),
      onError: (error) => {
        toast.error(error instanceof ApiError ? error.message : "Unable to create room.")
      },
    })
  }

  function handleEdit(values: RoomFormSchemaValues) {
    if (!editingRoom) return
    updateRoom.mutate(
      { slug: editingRoom.slug, values },
      {
        onSuccess: () => setEditingRoom(null),
        onError: (error) => {
          toast.error(error instanceof ApiError ? error.message : "Unable to update room.")
        },
      }
    )
  }

  function handleDelete(room: Room) {
    deleteRoom.mutate(room.slug, {
      onSuccess: () => setDeletingRoom(null),
      onError: (error) => {
        toast.error(error instanceof ApiError ? error.message : "Unable to delete room.")
      },
    })
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Rooms</h1>
          <p className="text-sm text-muted-foreground">Join an open room or create your own.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="size-4" />
          Create room
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Search rooms"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading rooms...</p>
      ) : isError ? (
        <p className="text-sm text-destructive">Unable to load rooms. Please try again.</p>
      ) : visibleRooms.length === 0 ? (
        <p className="text-sm text-muted-foreground">No rooms match your search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleRooms.map((room) => (
            <RoomCard
              key={room.slug}
              room={room}
              isOwner={room.owner.id === currentUserId}
              onEdit={setEditingRoom}
              onDelete={setDeletingRoom}
            />
          ))}
        </div>
      )}

      <RoomFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Create a room"
        description="Give your room a title and choose who can join."
        submitLabel="Create room"
        pendingLabel="Creating..."
        isSubmitting={createRoom.isPending}
        onSubmit={handleCreate}
      />

      <RoomFormDialog
        open={editingRoom !== null}
        onOpenChange={(open) => !open && setEditingRoom(null)}
        title="Edit room"
        description="Update your room's details."
        submitLabel="Save changes"
        pendingLabel="Saving..."
        isSubmitting={updateRoom.isPending}
        defaultValues={
          editingRoom
            ? {
                title: editingRoom.title,
                description: editingRoom.description,
                roomType: editingRoom.roomType,
              }
            : undefined
        }
        onSubmit={handleEdit}
      />

      <DeleteRoomDialog
        room={deletingRoom}
        isDeleting={deleteRoom.isPending}
        onOpenChange={(open) => !open && setDeletingRoom(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
