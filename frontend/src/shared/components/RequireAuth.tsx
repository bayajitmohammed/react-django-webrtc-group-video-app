import { Navigate, Outlet } from "react-router"

import { useAuthStore } from "@/features/auth/store"

export function RequireAuth() {
  const status = useAuthStore((state) => state.status)

  if (status !== "authenticated") return <Navigate to="/login" replace />

  return <Outlet />
}
