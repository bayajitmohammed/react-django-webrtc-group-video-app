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
  className?: string
}

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function VideoTile({ name, stream, isMuted, isCameraOn = true, isLocal, className }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream ?? null
    }
  }, [stream])

  return (
    <div
      className={cn(
        "relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-800 ring-1 ring-white/10",
        className,
      )}
    >
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

      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
        {isMuted ? <MicOff className="size-3.5 text-red-400" /> : null}
        {name}
      </div>
    </div>
  )
}
