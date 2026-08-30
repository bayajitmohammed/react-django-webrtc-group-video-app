import { useMutation } from "@tanstack/react-query"

import { changePassword, updateProfile } from "@/features/profile/api"
import { useAuthStore } from "@/features/auth/store"

export function useUpdateProfile() {
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => useAuthStore.getState().setUser(user),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  })
}
