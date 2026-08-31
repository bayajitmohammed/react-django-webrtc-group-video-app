import { Navigate, Route, Routes } from "react-router"

import { AppLayout } from "@/shared/layouts/AppLayout"
import { AuthLayout } from "@/shared/layouts/AuthLayout"
import { NotFoundPage } from "@/shared/components/NotFoundPage"
import { RequireAuth } from "@/shared/components/RequireAuth"
import { RequireGuest } from "@/shared/components/RequireGuest"
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { RegisterPage } from "@/features/auth/pages/RegisterPage"
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage"
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage"
import { LobbyPage } from "@/features/lobby/pages/LobbyPage"
import { RoomSessionLayout } from "@/features/video-room/RoomSessionLayout"
import { PreJoinPage } from "@/features/video-room/pages/PreJoinPage"
import { VideoRoomPage } from "@/features/video-room/pages/VideoRoomPage"
import { ProfilePage } from "@/features/profile/pages/ProfilePage"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/rooms" replace />} />

      <Route element={<RequireGuest />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/rooms" element={<LobbyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route element={<RoomSessionLayout />}>
          <Route path="/rooms/:slug/lobby" element={<PreJoinPage />} />
          <Route path="/rooms/:slug/call" element={<VideoRoomPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
