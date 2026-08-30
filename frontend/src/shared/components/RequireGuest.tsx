import { Navigate, Outlet } from "react-router"

import { useAuthStore } from "@/features/auth/store"

export function RequireGuest() {
  const status = useAuthStore((state) => state.status)

  if (status === "authenticated") return <Navigate to="/rooms" replace />

  return <Outlet />
}
