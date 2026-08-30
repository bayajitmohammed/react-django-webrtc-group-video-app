import type { Room } from "@/types/room"

const owner = { id: 1, email: "jane@example.com", firstName: "Jane", lastName: "Doe" }
const otherOwner = { id: 2, email: "sam@example.com", firstName: "Sam", lastName: "Lee" }

export const mockRooms: Room[] = [
  {
    slug: "9c9b1f9e-9f2e-4a0a-a2b0-1a1f2c3d4e5f",
    title: "Weekly Design Sync",
    description: "Reviewing the new component library and design tokens.",
    roomType: "OTA",
    owner,
    createdAt: "2026-08-25T10:00:00Z",
    updatedAt: "2026-08-25T10:00:00Z",
  },
  {
    slug: "1b2c3d4e-5f6a-4b7c-8d9e-0f1a2b3c4d5e",
    title: "Leadership 1:1",
    description: "Private catch-up, invite only.",
    roomType: "IO",
    owner,
    createdAt: "2026-08-24T15:30:00Z",
    updatedAt: "2026-08-24T15:30:00Z",
  },
  {
    slug: "2c3d4e5f-6a7b-4c8d-9e0f-1a2b3c4d5e6f",
    title: "Community Office Hours",
    description: "Open Q&A for anyone with questions about the product.",
    roomType: "OTA",
    owner: otherOwner,
    createdAt: "2026-08-20T09:00:00Z",
    updatedAt: "2026-08-20T09:00:00Z",
  },
]
