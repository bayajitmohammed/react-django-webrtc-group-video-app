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
import { loginSchema, type LoginValues } from "@/features/auth/schema"

export function LoginPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  async function onSubmit() {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSubmitting(false)
    navigate("/rooms")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>Welcome back, sign in to your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <FormItem label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
          </FormItem>

          <FormItem label="Password" htmlFor="password" error={errors.password?.message}>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
            />
          </FormItem>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-muted-foreground hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-foreground hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
