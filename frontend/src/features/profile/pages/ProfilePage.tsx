import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FormItem } from "@/shared/components/FormItem"
import { ApiError } from "@/lib/apiClient"
import { useAuthStore } from "@/features/auth/store"
import { useChangePassword, useUpdateProfile } from "@/features/profile/hooks"
import {
  changePasswordSchema,
  profileDetailsSchema,
  type ChangePasswordValues,
  type ProfileDetailsValues,
} from "@/features/profile/schema"

export function ProfilePage() {
  const currentUser = useAuthStore((state) => state.user)
  const updateProfile = useUpdateProfile()
  const changePassword = useChangePassword()

  const detailsForm = useForm<ProfileDetailsValues>({
    resolver: zodResolver(profileDetailsSchema),
    defaultValues: {
      firstName: currentUser?.firstName ?? "",
      lastName: currentUser?.lastName ?? "",
    },
  })

  const passwordForm = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  })

  function saveDetails(values: ProfileDetailsValues) {
    updateProfile.mutate(values, {
      onSuccess: () => toast.success("Profile updated."),
      onError: (error) => {
        toast.error(error instanceof ApiError ? error.message : "Unable to update profile.")
      },
    })
  }

  function submitChangePassword(values: ChangePasswordValues) {
    changePassword.mutate(values, {
      onSuccess: () => {
        toast.success("Password updated.")
        passwordForm.reset()
      },
      onError: (error) => {
        toast.error(error instanceof ApiError ? error.message : "Unable to update password.")
      },
    })
  }

  if (!currentUser) return null

  return (
    <div className="grid max-w-lg gap-6">
      <div className="flex items-center gap-4">
        <Avatar className="size-14">
          <AvatarFallback className="text-lg">
            {currentUser.firstName[0]}
            {currentUser.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-semibold">
            {currentUser.firstName} {currentUser.lastName}
          </h1>
          <p className="text-sm text-muted-foreground">{currentUser.email}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Display name</CardTitle>
          <CardDescription>This is the name other participants will see.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="details-form"
            className="grid grid-cols-2 gap-4"
            onSubmit={detailsForm.handleSubmit(saveDetails)}
          >
            <FormItem
              label="First name"
              htmlFor="firstName"
              error={detailsForm.formState.errors.firstName?.message}
            >
              <Input id="firstName" {...detailsForm.register("firstName")} />
            </FormItem>
            <FormItem
              label="Last name"
              htmlFor="lastName"
              error={detailsForm.formState.errors.lastName?.message}
            >
              <Input id="lastName" {...detailsForm.register("lastName")} />
            </FormItem>
          </form>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" form="details-form" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>Choose a strong password you don&apos;t use elsewhere.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="password-form"
            className="grid gap-4"
            onSubmit={passwordForm.handleSubmit(submitChangePassword)}
          >
            <FormItem
              label="Current password"
              htmlFor="currentPassword"
              error={passwordForm.formState.errors.currentPassword?.message}
            >
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                {...passwordForm.register("currentPassword")}
              />
            </FormItem>
            <FormItem
              label="New password"
              htmlFor="newPassword"
              error={passwordForm.formState.errors.newPassword?.message}
            >
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                {...passwordForm.register("newPassword")}
              />
            </FormItem>
            <FormItem
              label="Confirm new password"
              htmlFor="confirmPassword"
              error={passwordForm.formState.errors.confirmPassword?.message}
            >
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...passwordForm.register("confirmPassword")}
              />
            </FormItem>
          </form>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" form="password-form" disabled={changePassword.isPending}>
            {changePassword.isPending ? "Updating..." : "Update password"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
