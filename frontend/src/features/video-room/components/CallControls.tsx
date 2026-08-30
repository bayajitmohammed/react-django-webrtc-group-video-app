import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react"

import { Button } from "@/components/ui/button"

interface CallControlsProps {
  isCameraOn: boolean
  isMicOn: boolean
  onToggleCamera: () => void
  onToggleMic: () => void
  onLeave: () => void
}

export function CallControls({
  isCameraOn,
  isMicOn,
  onToggleCamera,
  onToggleMic,
  onLeave,
}: CallControlsProps) {
  return (
    <div className="flex justify-center gap-3 rounded-full border border-border bg-background px-4 py-2">
      <Button variant={isMicOn ? "outline" : "destructive"} size="icon" onClick={onToggleMic}>
        {isMicOn ? <Mic className="size-4" /> : <MicOff className="size-4" />}
      </Button>
      <Button
        variant={isCameraOn ? "outline" : "destructive"}
        size="icon"
        onClick={onToggleCamera}
      >
        {isCameraOn ? <Video className="size-4" /> : <VideoOff className="size-4" />}
      </Button>
      <Button variant="destructive" size="icon" onClick={onLeave}>
        <PhoneOff className="size-4" />
      </Button>
    </div>
  )
}
