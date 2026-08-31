import { Outlet } from "react-router"

import { LocalMediaProvider } from "@/features/video-room/LocalMediaContext"

export function RoomSessionLayout() {
  return (
    <LocalMediaProvider>
      <Outlet />
    </LocalMediaProvider>
  )
}
