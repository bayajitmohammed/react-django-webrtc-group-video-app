import { createContext, useContext, type ReactNode } from "react"

import { useLocalMedia } from "@/features/video-room/useLocalMedia"

type LocalMediaValue = ReturnType<typeof useLocalMedia>

const LocalMediaContext = createContext<LocalMediaValue | null>(null)

export function LocalMediaProvider({ children }: { children: ReactNode }) {
  const localMedia = useLocalMedia()
  return <LocalMediaContext.Provider value={localMedia}>{children}</LocalMediaContext.Provider>
}

export function useLocalMediaContext() {
  const value = useContext(LocalMediaContext)
  if (!value) throw new Error("useLocalMediaContext must be used within LocalMediaProvider")
  return value
}
