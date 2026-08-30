import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Link } from "react-router"
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
import { forgotPassword } from "@/features/auth/api"
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/features/auth/schema"

export function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) })

  const forgotPasswordMutation = useMutation({
    mutationFn: (values: ForgotPasswordValues) => forgotPassword(values.email),
    onSuccess: () => setIsSent(true),
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Unable to send reset link.")
    },
  })

  function onSubmit(values: ForgotPasswordValues) {
    forgotPasswordMutation.mutate(values)
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

            <Button type="submit" className="w-full" disabled={forgotPasswordMutation.isPending}>
              {forgotPasswordMutation.isPending ? "Sending link..." : "Send reset link"}
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
