import { useNavigate, useParams } from "react-router"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CallControls } from "@/features/video-room/components/CallControls"
import { VideoTile } from "@/features/video-room/components/VideoTile"
import { mockParticipants } from "@/features/video-room/mockParticipants"
import { useLocalMedia } from "@/features/video-room/useLocalMedia"

export function VideoRoomPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { stream, error, isCameraOn, isMicOn, toggleCamera, toggleMic } = useLocalMedia()

  function handleLeave() {
    navigate("/rooms")
  }

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-black p-4 text-white">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/70">Room {slug}</span>
        <span className="text-sm text-white/70">
          {mockParticipants.length + 1} participants
        </span>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Camera unavailable</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid flex-1 grid-cols-1 gap-4 content-start sm:grid-cols-2 lg:grid-cols-3">
        <VideoTile name="You" stream={stream} isCameraOn={isCameraOn} isMuted={!isMicOn} isLocal />
        {mockParticipants.map((participant) => (
          <VideoTile key={participant.id} name={participant.name} />
        ))}
      </div>

      <CallControls
        isCameraOn={isCameraOn}
        isMicOn={isMicOn}
        onToggleCamera={toggleCamera}
        onToggleMic={toggleMic}
        onLeave={handleLeave}
      />
    </div>
  )
}
