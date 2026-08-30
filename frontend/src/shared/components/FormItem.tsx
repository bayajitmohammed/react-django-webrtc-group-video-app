import type { ReactNode } from "react"

import { Label } from "@/components/ui/label"

interface FormItemProps {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}

export function FormItem({ label, htmlFor, error, children }: FormItemProps) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
