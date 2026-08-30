export type RoomType = "OTA" | "IO"

export interface RoomOwner {
  id: number
  email: string
  firstName: string
  lastName: string
}

export interface Room {
  slug: string
  title: string
  description: string
  roomType: RoomType
  owner: RoomOwner
  createdAt: string
  updatedAt: string
}

export interface RoomFormValues {
  title: string
  description: string
  roomType: RoomType
}
