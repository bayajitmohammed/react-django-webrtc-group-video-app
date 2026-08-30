import { useState } from "react"
import { Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RoomCard } from "@/features/lobby/components/RoomCard"
import { RoomFormDialog } from "@/features/lobby/components/RoomFormDialog"
import { DeleteRoomDialog } from "@/features/lobby/components/DeleteRoomDialog"
import { mockRooms } from "@/features/lobby/mockRooms"
import type { RoomFormSchemaValues } from "@/features/lobby/schema"
import type { Room } from "@/types/room"

const currentUserId = 1

export function LobbyPage() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms)
  const [search, setSearch] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null)

  const visibleRooms = rooms.filter((room) =>
    room.title.toLowerCase().includes(search.toLowerCase())
  )

  function handleCreate(values: RoomFormSchemaValues) {
    const now = new Date().toISOString()
    const newRoom: Room = {
      slug: crypto.randomUUID(),
      title: values.title,
      description: values.description,
      roomType: values.roomType,
      owner: { id: currentUserId, email: "jane@example.com", firstName: "Jane", lastName: "Doe" },
      createdAt: now,
      updatedAt: now,
    }
    setRooms((current) => [newRoom, ...current])
  }

  function handleEdit(values: RoomFormSchemaValues) {
    if (!editingRoom) return
    setRooms((current) =>
      current.map((room) =>
        room.slug === editingRoom.slug
          ? { ...room, ...values, updatedAt: new Date().toISOString() }
          : room
      )
    )
    setEditingRoom(null)
  }

  function handleDelete(room: Room) {
    setRooms((current) => current.filter((existing) => existing.slug !== room.slug))
    setDeletingRoom(null)
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

      {visibleRooms.length === 0 ? (
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
        onSubmit={handleCreate}
      />

      <RoomFormDialog
        open={editingRoom !== null}
        onOpenChange={(open) => !open && setEditingRoom(null)}
        title="Edit room"
        description="Update your room's details."
        submitLabel="Save changes"
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
        onOpenChange={(open) => !open && setDeletingRoom(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
