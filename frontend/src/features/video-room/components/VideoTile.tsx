import { useEffect, useRef } from "react"
import { MicOff } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface VideoTileProps {
  name: string
  stream?: MediaStream | null
  isMuted?: boolean
  isCameraOn?: boolean
  isLocal?: boolean
}

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function VideoTile({ name, stream, isMuted, isCameraOn = true, isLocal }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream ?? null
    }
  }, [stream])

  return (
    <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-secondary">
      {stream && isCameraOn ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={cn("h-full w-full object-cover", isLocal && "-scale-x-100")}
        />
      ) : (
        <Avatar className="size-16">
          <AvatarFallback>{initialsFor(name)}</AvatarFallback>
        </Avatar>
      )}

      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-background/80 px-2 py-1 text-xs font-medium">
        {isMuted ? <MicOff className="size-3.5" /> : null}
        {name}
      </div>
    </div>
  )
}
