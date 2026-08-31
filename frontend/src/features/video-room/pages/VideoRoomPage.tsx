import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CallControls } from "@/features/video-room/components/CallControls"
import { ChatPanel } from "@/features/video-room/components/ChatPanel"
import { VideoTile } from "@/features/video-room/components/VideoTile"
import { useLocalMediaContext } from "@/features/video-room/LocalMediaContext"
import { useChatMessages } from "@/features/video-room/useChatMessages"
import { useTurnCredentials } from "@/features/video-room/hooks"
import { usePeerConnections } from "@/features/video-room/usePeerConnections"
import { useSignalingSocket } from "@/features/video-room/useSignalingSocket"
import { useAuthStore } from "@/features/auth/store"
import { useRoom } from "@/features/lobby/hooks"
import { ApiError } from "@/lib/apiClient"
import { cn } from "@/lib/utils"

const PUBLIC_STUN_SERVER: RTCIceServer = { urls: "stun:stun.l.google.com:19302" }

export function VideoRoomPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  const { stream, error: mediaError, isCameraOn, isMicOn, toggleCamera, toggleMic } = useLocalMediaContext()
  const { data: room, isLoading, error: roomError } = useRoom(slug)
  const { data: turnCredentials } = useTurnCredentials()
  const [isChatOpen, setIsChatOpen] = useState(false)

  const iceServers = useMemo<RTCIceServer[]>(() => {
    if (!turnCredentials?.urls.length) return [PUBLIC_STUN_SERVER]
    return [
      PUBLIC_STUN_SERVER,
      { urls: turnCredentials.urls, username: turnCredentials.username, credential: turnCredentials.credential },
    ]
  }, [turnCredentials])

  const { status, closedPermanently, send, subscribe } = useSignalingSocket(
    slug as string,
    accessToken,
    Boolean(slug) && Boolean(stream),
  )
  const { participants, remoteStreams, handleMessage } = usePeerConnections({
    myUserId: user?.id ?? 0,
    localStream: stream,
    iceServers,
    send,
  })
  const chatMessages = useChatMessages(subscribe)

  useEffect(() => subscribe(handleMessage), [subscribe, handleMessage])

  function handleLeave() {
    navigate("/rooms")
  }

  function handleSendChat(message: string) {
    send({ type: "chat", message })
  }

  if (isLoading) {
    return <p className="p-4 text-sm text-white/70">Loading room...</p>
  }

  if (roomError || !room) {
    const message =
      roomError instanceof ApiError && roomError.status === 404
        ? "This room doesn't exist or you don't have access to it."
        : "Unable to load this room. Please try again."

    return (
      <div className="mx-auto grid max-w-md gap-4 p-4">
        <Alert variant="destructive">
          <AlertTitle>Can't join room</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
        <Button render={<Link to="/rooms" />} variant="outline" className="w-full">
          Back to rooms
        </Button>
      </div>
    )
  }

  if (closedPermanently) {
    return (
      <div className="mx-auto grid max-w-md gap-4 p-4">
        <Alert variant="destructive">
          <AlertTitle>Disconnected</AlertTitle>
          <AlertDescription>
            You've been disconnected from this room and can't reconnect.
          </AlertDescription>
        </Alert>
        <Button render={<Link to="/rooms" />} variant="outline" className="w-full">
          Back to rooms
        </Button>
      </div>
    )
  }

  const participantCount = participants.size + 1
  const tileCount = participantCount

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-neutral-950 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-6 py-4">
        <span className="truncate text-sm font-medium text-white/90">{room.title}</span>
        <span className="rounded-full bg-black/40 px-3 py-1 text-xs text-white/70">
          {status === "open" ? `${participantCount} participant${participantCount === 1 ? "" : "s"}` : "Reconnecting..."}
        </span>
      </div>

      {mediaError ? (
        <div className="absolute inset-x-0 top-16 z-20 px-6">
          <Alert variant="destructive">
            <AlertTitle>Camera unavailable</AlertTitle>
            <AlertDescription>{mediaError}</AlertDescription>
          </Alert>
        </div>
      ) : null}

      <div className="flex flex-1 overflow-hidden">
        <div
          className={cn(
            "grid flex-1 auto-rows-fr content-center gap-3 p-4 pt-16 pb-28",
            tileCount === 1 && "grid-cols-1 place-items-center",
            tileCount === 2 && "grid-cols-1 sm:grid-cols-2",
            tileCount > 2 && tileCount <= 4 && "grid-cols-2",
            tileCount > 4 && "grid-cols-2 lg:grid-cols-3",
          )}
        >
          <VideoTile
            name="You"
            stream={stream}
            isCameraOn={isCameraOn}
            isMuted={!isMicOn}
            isLocal
            className={tileCount === 1 ? "max-h-full max-w-3xl" : undefined}
          />
          {Array.from(participants.values()).map((participant) => (
            <VideoTile
              key={participant.userId}
              name={participant.displayName}
              stream={remoteStreams.get(participant.userId)}
              isCameraOn={remoteStreams.has(participant.userId)}
            />
          ))}
        </div>

        {isChatOpen ? (
          <div className="w-80 shrink-0 border-l border-white/10 bg-neutral-900 pt-16">
            <ChatPanel messages={chatMessages} onSend={handleSendChat} />
          </div>
        ) : null}
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center">
        <CallControls
          isCameraOn={isCameraOn}
          isMicOn={isMicOn}
          isChatOpen={isChatOpen}
          onToggleCamera={toggleCamera}
          onToggleMic={toggleMic}
          onToggleChat={() => setIsChatOpen((open) => !open)}
          onLeave={handleLeave}
        />
      </div>
    </div>
  )
}
