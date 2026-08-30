import { create } from "zustand"

import type { User } from "@/types/user"

const REFRESH_TOKEN_KEY = "refresh_token"
const BASE_URL = import.meta.env.VITE_API_BASE_URL

type AuthStatus = "idle" | "authenticated" | "unauthenticated"

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

interface AuthState {
  accessToken: string | null
  user: User | null
  status: AuthStatus
  setSession: (accessToken: string, refreshToken: string, user: User) => void
  logout: () => void
  refreshAccessToken: () => Promise<boolean>
  bootstrap: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  status: "idle",

  setSession(accessToken, refreshToken, user) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    set({ accessToken, user, status: "authenticated" })
  },

  logout() {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    set({ accessToken: null, user: null, status: "unauthenticated" })
  },

  async refreshAccessToken() {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    if (!refreshToken) return false

    const res = await fetch(`${BASE_URL}/api/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    })
    if (!res.ok) return false

    const data = (await res.json()) as { access: string }
    set({ accessToken: data.access })
    return true
  },

  async bootstrap() {
    const refreshed = await get().refreshAccessToken()
    if (!refreshed) {
      set({ status: "unauthenticated" })
      return
    }

    const res = await fetch(`${BASE_URL}/api/auth/me/`, {
      headers: { Authorization: `Bearer ${get().accessToken}` },
    })
    if (!res.ok) {
      get().logout()
      return
    }

    const me = (await res.json()) as BackendUser
    set({ user: mapUser(me), status: "authenticated" })
  },
}))
