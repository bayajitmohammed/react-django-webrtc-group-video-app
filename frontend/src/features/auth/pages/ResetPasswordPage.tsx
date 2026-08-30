import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"

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
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/features/auth/schema"

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema) })

  async function onSubmit() {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSubmitting(false)
    navigate("/login")
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset password"}
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
