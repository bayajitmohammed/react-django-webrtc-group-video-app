import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link } from "react-router"

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
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/features/auth/schema"

export function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) })

  async function onSubmit() {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSubmitting(false)
    setIsSent(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSent ? (
          <p className="text-sm text-muted-foreground">
            If an account exists for that email, a reset link is on its way.
          </p>
        ) : (
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <FormItem label="Email" htmlFor="email" error={errors.email?.message}>
              <Input id="email" type="email" autoComplete="email" {...register("email")} />
            </FormItem>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending link..." : "Send reset link"}
            </Button>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link to="/login" className="text-foreground hover:underline">
            Back to log in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
