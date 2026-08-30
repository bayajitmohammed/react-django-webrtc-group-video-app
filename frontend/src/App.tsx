import { AppRoutes } from "@/app/routes"
import { QueryProvider } from "@/app/providers/QueryProvider"

function App() {
  return (
    <QueryProvider>
      <AppRoutes />
    </QueryProvider>
  )
}

export default App
