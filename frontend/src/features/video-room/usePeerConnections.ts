import { useCallback, useEffect, useRef, useState } from "react"

import type { ClientMessage, Participant, ServerMessage, SignalData } from "@/features/video-room/types"

interface PeerEntry {
  connection: RTCPeerConnection
  pendingCandidates: RTCIceCandidateInit[]
}

interface UsePeerConnectionsArgs {
  myUserId: number
  localStream: MediaStream | null
  iceServers: RTCIceServer[]
  send: (message: ClientMessage) => void
}

const CLOSED_CONNECTION_STATES = new Set(["failed", "closed", "disconnected"])

export function usePeerConnections({ myUserId, localStream, iceServers, send }: UsePeerConnectionsArgs) {
  const [participants, setParticipants] = useState<Map<number, Participant>>(new Map())
  const [remoteStreams, setRemoteStreams] = useState<Map<number, MediaStream>>(new Map())
  const peersRef = useRef(new Map<number, PeerEntry>())
  const localStreamRef = useRef(localStream)

  useEffect(() => {
    localStreamRef.current = localStream
  }, [localStream])

  const closePeer = useCallback((userId: number) => {
    peersRef.current.get(userId)?.connection.close()
    peersRef.current.delete(userId)
    setRemoteStreams((previous) => {
      const next = new Map(previous)
      next.delete(userId)
      return next
    })
  }, [])

  const getOrCreatePeer = useCallback(
    (userId: number, isInitiator: boolean) => {
      const existing = peersRef.current.get(userId)
      if (existing) return existing

      const connection = new RTCPeerConnection({ iceServers })
      const entry: PeerEntry = { connection, pendingCandidates: [] }
      peersRef.current.set(userId, entry)

      localStreamRef.current?.getTracks().forEach((track) => {
        connection.addTrack(track, localStreamRef.current as MediaStream)
      })

      connection.ontrack = (event) => {
        setRemoteStreams((previous) => new Map(previous).set(userId, event.streams[0]))
      }

      connection.onicecandidate = (event) => {
        if (event.candidate) {
          send({ type: "signal", to: userId, data: { kind: "candidate", payload: event.candidate.toJSON() } })
        }
      }

      connection.onconnectionstatechange = () => {
        if (CLOSED_CONNECTION_STATES.has(connection.connectionState)) {
          closePeer(userId)
        }
      }

      if (isInitiator) {
        connection
          .createOffer()
          .then((offer) => connection.setLocalDescription(offer).then(() => offer))
          .then((offer) => send({ type: "signal", to: userId, data: { kind: "offer", payload: offer } }))
      }

      return entry
    },
    [iceServers, send, closePeer],
  )

  const connectToParticipant = useCallback(
    (userId: number) => {
      if (userId === myUserId) return
      getOrCreatePeer(userId, myUserId < userId)
    },
    [myUserId, getOrCreatePeer],
  )

  const flushPendingCandidates = useCallback(async (entry: PeerEntry) => {
    const candidates = entry.pendingCandidates.splice(0)
    for (const candidate of candidates) {
      await entry.connection.addIceCandidate(candidate)
    }
  }, [])

  const handleSignal = useCallback(
    async (fromUserId: number, data: SignalData) => {
      const entry = getOrCreatePeer(fromUserId, false)
      const { connection } = entry

      if (data.kind === "offer") {
        await connection.setRemoteDescription(data.payload)
        await flushPendingCandidates(entry)
        const answer = await connection.createAnswer()
        await connection.setLocalDescription(answer)
        send({ type: "signal", to: fromUserId, data: { kind: "answer", payload: answer } })
      } else if (data.kind === "answer") {
        await connection.setRemoteDescription(data.payload)
        await flushPendingCandidates(entry)
      } else if (connection.remoteDescription) {
        await connection.addIceCandidate(data.payload)
      } else {
        entry.pendingCandidates.push(data.payload)
      }
    },
    [getOrCreatePeer, flushPendingCandidates, send],
  )

  const syncParticipants = useCallback(
    (next: Map<number, Participant>) => {
      setParticipants(next)
      peersRef.current.forEach((_entry, userId) => {
        if (!next.has(userId)) closePeer(userId)
      })
      next.forEach((_participant, userId) => connectToParticipant(userId))
    },
    [closePeer, connectToParticipant],
  )

  const handleMessage = useCallback(
    (message: ServerMessage) => {
      if (message.type === "room_state") {
        const next = new Map(
          message.participants.map((p) => [p.user_id, { userId: p.user_id, displayName: p.display_name }] as const),
        )
        syncParticipants(next)
      } else if (message.type === "peer_joined") {
        setParticipants((previous) =>
          new Map(previous).set(message.user_id, { userId: message.user_id, displayName: message.display_name }),
        )
        connectToParticipant(message.user_id)
      } else if (message.type === "peer_left") {
        setParticipants((previous) => {
          const next = new Map(previous)
          next.delete(message.user_id)
          return next
        })
        closePeer(message.user_id)
      } else if (message.type === "signal") {
        void handleSignal(message.from, message.data)
      }
    },
    [syncParticipants, connectToParticipant, closePeer, handleSignal],
  )

  useEffect(() => {
    const peers = peersRef.current
    return () => {
      peers.forEach((peer) => peer.connection.close())
      peers.clear()
    }
  }, [])

  return { participants, remoteStreams, handleMessage }
}
