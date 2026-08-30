import { request } from "@/lib/apiClient"
import { useAuthStore } from "@/features/auth/store"
import type { User } from "@/types/user"
import type { RegisterValues } from "@/features/auth/schema"

interface BackendUser {
  id: number
  email: string
  first_name: string
  last_name: string
}

interface TokenPair {
  access: string
  refresh: string
}

function mapUser(data: BackendUser): User {
  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
  }
}

export async function login(email: string, password: string): Promise<User> {
  const tokens = await request<TokenPair>("/api/auth/login/", {
    method: "POST",
    auth: false,
    body: { email, password },
  })

  const me = await request<BackendUser>("/api/auth/me/", { token: tokens.access })
  const user = mapUser(me)
  useAuthStore.getState().setSession(tokens.access, tokens.refresh, user)
  return user
}

export async function register(values: RegisterValues): Promise<User> {
  await request("/api/auth/register/", {
    method: "POST",
    auth: false,
    body: {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      password: values.password,
    },
  })

  return login(values.email, values.password)
}

export async function forgotPassword(email: string): Promise<void> {
  await request("/api/auth/forgot-password/", {
    method: "POST",
    auth: false,
    body: { email },
  })
}

export async function resetPassword(
  uid: string,
  token: string,
  newPassword: string,
): Promise<void> {
  await request("/api/auth/reset-password/", {
    method: "POST",
    auth: false,
    body: { uid, token, new_password: newPassword },
  })
}
