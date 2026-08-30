import { useEffect, useRef, useState } from "react"

export function useLocalMedia() {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    let cancelled = false

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        if (cancelled) {
          mediaStream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = mediaStream
        setStream(mediaStream)
      })
      .catch(() => {
        if (!cancelled) {
          setError("Camera and microphone access is required to join the call.")
        }
      })

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  function toggleCamera() {
    const nextValue = !isCameraOn
    streamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = nextValue
    })
    setIsCameraOn(nextValue)
  }

  function toggleMic() {
    const nextValue = !isMicOn
    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = nextValue
    })
    setIsMicOn(nextValue)
  }

  return { stream, error, isCameraOn, isMicOn, toggleCamera, toggleMic }
}
