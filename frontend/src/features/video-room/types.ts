export interface Participant {
  userId: number
  displayName: string
}

export interface ChatMessage {
  from: number
  displayName: string
  message: string
}

export interface WireParticipant {
  user_id: number
  display_name: string
}

export type SignalData =
  | { kind: "offer"; payload: RTCSessionDescriptionInit }
  | { kind: "answer"; payload: RTCSessionDescriptionInit }
  | { kind: "candidate"; payload: RTCIceCandidateInit }

export type ServerMessage =
  | { type: "room_state"; participants: WireParticipant[] }
  | { type: "peer_joined"; user_id: number; display_name: string }
  | { type: "peer_left"; user_id: number }
  | { type: "signal"; from: number; data: SignalData }
  | { type: "chat"; from: number; display_name: string; message: string }

export type ClientMessage =
  | { type: "signal"; to: number; data: SignalData }
  | { type: "chat"; message: string }
