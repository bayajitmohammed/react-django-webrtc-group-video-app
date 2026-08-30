import { request } from "@/lib/apiClient"
import type { Room, RoomFormValues, RoomType } from "@/types/room"

interface BackendRoomOwner {
  id: number
  email: string
  first_name: string
  last_name: string
}

interface BackendRoom {
  slug: string
  title: string
  description: string
  room_type: RoomType
  owner: BackendRoomOwner
  created_at: string
  updated_at: string
}

function mapRoom(data: BackendRoom): Room {
  return {
    slug: data.slug,
    title: data.title,
    description: data.description,
    roomType: data.room_type,
    owner: {
      id: data.owner.id,
      email: data.owner.email,
      firstName: data.owner.first_name,
      lastName: data.owner.last_name,
    },
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

function toBody(values: RoomFormValues) {
  return {
    title: values.title,
    description: values.description,
    room_type: values.roomType,
  }
}

export async function listRooms(): Promise<Room[]> {
  const rooms = await request<BackendRoom[]>("/api/rooms/")
  return rooms.map(mapRoom)
}

export async function getRoom(slug: string): Promise<Room> {
  const room = await request<BackendRoom>(`/api/rooms/${slug}/`)
  return mapRoom(room)
}

export async function createRoom(values: RoomFormValues): Promise<Room> {
  const room = await request<BackendRoom>("/api/rooms/", {
    method: "POST",
    body: toBody(values),
  })
  return mapRoom(room)
}

export async function updateRoom(slug: string, values: RoomFormValues): Promise<Room> {
  const room = await request<BackendRoom>(`/api/rooms/${slug}/`, {
    method: "PATCH",
    body: toBody(values),
  })
  return mapRoom(room)
}

export async function deleteRoom(slug: string): Promise<void> {
  await request(`/api/rooms/${slug}/`, { method: "DELETE" })
}
