import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useSearchParams } from "react-router"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FormItem } from "@/shared/components/FormItem"
import { ApiError } from "@/lib/apiClient"
import { resetPassword } from "@/features/auth/api"
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/features/auth/schema"

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const uid = searchParams.get("uid")
  const token = searchParams.get("token")
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema) })

  const resetPasswordMutation = useMutation({
    mutationFn: (values: ResetPasswordValues) => resetPassword(uid!, token!, values.password),
    onSuccess: () => {
      toast.success("Password reset. You can now log in.")
      navigate("/login")
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Unable to reset password.")
    },
  })

  function onSubmit(values: ResetPasswordValues) {
    resetPasswordMutation.mutate(values)
  }

  if (!uid || !token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invalid reset link</CardTitle>
          <CardDescription>
            This password reset link is missing or malformed. Request a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            to="/forgot-password"
            className="text-sm text-foreground hover:underline"
          >
            Request a new link
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Choose a new password for your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <FormItem label="New password" htmlFor="password" error={errors.password?.message}>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
            />
          </FormItem>

          <FormItem
            label="Confirm new password"
            htmlFor="confirmPassword"
            error={errors.confirmPassword?.message}
          >
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
          </FormItem>

          <Button type="submit" className="w-full" disabled={resetPasswordMutation.isPending}>
            {resetPasswordMutation.isPending ? "Resetting..." : "Reset password"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-foreground hover:underline">
              Back to log in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
