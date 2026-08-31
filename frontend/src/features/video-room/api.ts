import { request } from "@/lib/apiClient"

export interface TurnCredentials {
  username: string
  credential: string
  ttl: number
  urls: string[]
}

export function getTurnCredentials() {
  return request<TurnCredentials>("/api/turn-credentials/")
}
