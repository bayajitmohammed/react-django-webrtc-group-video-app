import { useCallback, useEffect, useRef, useState } from "react"

import type { ClientMessage, ServerMessage } from "@/features/video-room/types"

export type SocketStatus = "connecting" | "open" | "closed"

const PERMANENT_CLOSE_CODES = new Set([4401, 4403, 4404])
const RECONNECT_DELAY_MS = 2000

function socketUrl(slug: string, token: string) {
  const configuredBase = import.meta.env.VITE_API_BASE_URL as string
  const base = configuredBase
    ? configuredBase.replace(/^http/, "ws")
    : `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}`
  return `${base}/ws/rooms/${slug}/?token=${token}`
}

export function useSignalingSocket(slug: string, token: string | null, enabled: boolean) {
  const [status, setStatus] = useState<SocketStatus>("connecting")
  const [closedPermanently, setClosedPermanently] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)
  const listenersRef = useRef(new Set<(message: ServerMessage) => void>())

  useEffect(() => {
    if (!enabled || !token) return

    let reconnectTimeout: ReturnType<typeof setTimeout>
    let cancelled = false

    function connect() {
      const socket = new WebSocket(socketUrl(slug, token as string))
      socketRef.current = socket
      setStatus("connecting")

      socket.onopen = () => setStatus("open")

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data) as ServerMessage
        listenersRef.current.forEach((listener) => listener(message))
      }

      socket.onclose = (event) => {
        setStatus("closed")
        if (cancelled) return

        if (PERMANENT_CLOSE_CODES.has(event.code)) {
          setClosedPermanently(true)
          return
        }
        reconnectTimeout = setTimeout(connect, RECONNECT_DELAY_MS)
      }
    }

    connect()

    return () => {
      cancelled = true
      clearTimeout(reconnectTimeout)

      const socket = socketRef.current
      if (socket?.readyState === WebSocket.CONNECTING) {
        socket.addEventListener("open", () => socket.close(), { once: true })
      } else {
        socket?.close()
      }
    }
  }, [slug, token, enabled])

  const send = useCallback((message: ClientMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message))
    }
  }, [])

  const subscribe = useCallback((listener: (message: ServerMessage) => void) => {
    listenersRef.current.add(listener)
    return () => {
      listenersRef.current.delete(listener)
    }
  }, [])

  return { status, closedPermanently, send, subscribe }
}
