import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createRoom, deleteRoom, getRoom, listRooms, updateRoom } from "@/features/lobby/api"
import type { RoomFormValues } from "@/types/room"

const roomsQueryKey = ["rooms"]

export function useRooms() {
  return useQuery({ queryKey: roomsQueryKey, queryFn: listRooms })
}

export function useRoom(slug: string | undefined) {
  return useQuery({
    queryKey: [...roomsQueryKey, slug],
    queryFn: () => getRoom(slug as string),
    enabled: Boolean(slug),
  })
}

export function useCreateRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: RoomFormValues) => createRoom(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: roomsQueryKey }),
  })
}

export function useUpdateRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ slug, values }: { slug: string; values: RoomFormValues }) =>
      updateRoom(slug, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: roomsQueryKey }),
  })
}

export function useDeleteRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (slug: string) => deleteRoom(slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: roomsQueryKey }),
  })
}
