import { z } from "zod"

export const roomFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().max(2000, "Description is too long"),
  roomType: z.enum(["OTA", "IO"]),
})

export type RoomFormSchemaValues = z.infer<typeof roomFormSchema>
