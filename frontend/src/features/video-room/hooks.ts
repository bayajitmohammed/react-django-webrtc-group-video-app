import { useQuery } from "@tanstack/react-query"

import { getTurnCredentials } from "@/features/video-room/api"

export function useTurnCredentials() {
  return useQuery({
    queryKey: ["turn-credentials"],
    queryFn: getTurnCredentials,
    staleTime: 60 * 60 * 1000,
  })
}
