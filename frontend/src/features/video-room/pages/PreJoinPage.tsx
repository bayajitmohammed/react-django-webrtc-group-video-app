import { Link, useNavigate, useParams } from "react-router"
import { Mic, MicOff, Video, VideoOff } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VideoTile } from "@/features/video-room/components/VideoTile"
import { useLocalMedia } from "@/features/video-room/useLocalMedia"

export function PreJoinPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { stream, error, isCameraOn, isMicOn, toggleCamera, toggleMic } = useLocalMedia()

  return (
    <div className="mx-auto grid max-w-md gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Ready to join?</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Camera unavailable</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <VideoTile name="You" stream={stream} isCameraOn={isCameraOn} isLocal />
          )}

          <div className="flex justify-center gap-3">
            <Button
              variant={isMicOn ? "outline" : "destructive"}
              size="icon"
              onClick={toggleMic}
            >
              {isMicOn ? <Mic className="size-4" /> : <MicOff className="size-4" />}
            </Button>
            <Button
              variant={isCameraOn ? "outline" : "destructive"}
              size="icon"
              onClick={toggleCamera}
            >
              {isCameraOn ? <Video className="size-4" /> : <VideoOff className="size-4" />}
            </Button>
          </div>

          <Button className="w-full" onClick={() => navigate(`/rooms/${slug}/call`)}>
            Join room
          </Button>

          <Button render={<Link to="/rooms" />} variant="ghost" className="w-full">
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
