import { Outlet } from "react-router"

import { AppNavBar } from "@/shared/components/AppNavBar"

export function AppLayout() {
  return (
    <div className="min-h-screen bg-muted/20">
      <AppNavBar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
