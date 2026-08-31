import { MessageSquare, Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react"

import { cn } from "@/lib/utils"

interface CallControlsProps {
  isCameraOn: boolean
  isMicOn: boolean
  isChatOpen: boolean
  onToggleCamera: () => void
  onToggleMic: () => void
  onToggleChat: () => void
  onLeave: () => void
}

function ControlButton({
  active,
  danger,
  onClick,
  children,
  label,
}: {
  active?: boolean
  danger?: boolean
  onClick: () => void
  children: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full text-white transition-colors",
        danger
          ? "bg-red-600 hover:bg-red-500"
          : active
            ? "bg-white/15 hover:bg-white/25"
            : "bg-white/90 text-neutral-900 hover:bg-white",
      )}
    >
      {children}
    </button>
  )
}

export function CallControls({
  isCameraOn,
  isMicOn,
  isChatOpen,
  onToggleCamera,
  onToggleMic,
  onToggleChat,
  onLeave,
}: CallControlsProps) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-neutral-900/90 px-4 py-2.5 shadow-lg backdrop-blur">
      <ControlButton label={isMicOn ? "Mute microphone" : "Unmute microphone"} danger={!isMicOn} onClick={onToggleMic}>
        {isMicOn ? <Mic className="size-5" /> : <MicOff className="size-5" />}
      </ControlButton>
      <ControlButton label={isCameraOn ? "Turn camera off" : "Turn camera on"} danger={!isCameraOn} onClick={onToggleCamera}>
        {isCameraOn ? <Video className="size-5" /> : <VideoOff className="size-5" />}
      </ControlButton>
      <ControlButton label="Toggle chat" active={isChatOpen} onClick={onToggleChat}>
        <MessageSquare className="size-5" />
      </ControlButton>
      <div className="mx-1 h-6 w-px bg-white/15" />
      <ControlButton label="Leave call" danger onClick={onLeave}>
        <PhoneOff className="size-5" />
      </ControlButton>
    </div>
  )
}
