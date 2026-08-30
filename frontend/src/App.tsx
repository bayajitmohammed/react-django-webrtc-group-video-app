import { useEffect } from "react"

import { AppRoutes } from "@/app/routes"
import { QueryProvider } from "@/app/providers/QueryProvider"
import { Toaster } from "@/components/ui/sonner"
import { useAuthStore } from "@/features/auth/store"

function App() {
  const status = useAuthStore((state) => state.status)

  useEffect(() => {
    useAuthStore.getState().bootstrap()
  }, [])

  return (
    <QueryProvider>
      <Toaster />
      {status !== "idle" && <AppRoutes />}
    </QueryProvider>
  )
}

export default App
