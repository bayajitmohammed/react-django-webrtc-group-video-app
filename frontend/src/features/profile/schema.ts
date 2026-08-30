import { z } from "zod"

export const profileDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
})

export type ProfileDetailsValues = z.infer<typeof profileDetailsSchema>

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>
