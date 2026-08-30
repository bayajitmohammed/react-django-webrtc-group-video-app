import { request } from "@/lib/apiClient"
import type { User } from "@/types/user"
import type { ChangePasswordValues, ProfileDetailsValues } from "@/features/profile/schema"

interface BackendUser {
  id: number
  email: string
  first_name: string
  last_name: string
}

function mapUser(data: BackendUser): User {
  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
  }
}

export async function updateProfile(values: ProfileDetailsValues): Promise<User> {
  const user = await request<BackendUser>("/api/auth/me/", {
    method: "PATCH",
    body: { first_name: values.firstName, last_name: values.lastName },
  })
  return mapUser(user)
}

export async function changePassword(values: ChangePasswordValues): Promise<void> {
  await request("/api/auth/change-password/", {
    method: "POST",
    body: {
      current_password: values.currentPassword,
      new_password: values.newPassword,
    },
  })
}
