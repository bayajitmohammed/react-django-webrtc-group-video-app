import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormItem } from "@/shared/components/FormItem"
import { roomFormSchema, type RoomFormSchemaValues } from "@/features/lobby/schema"

interface RoomFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  submitLabel: string
  pendingLabel: string
  isSubmitting?: boolean
  defaultValues?: RoomFormSchemaValues
  onSubmit: (values: RoomFormSchemaValues) => void
}

const emptyValues: RoomFormSchemaValues = {
  title: "",
  description: "",
  roomType: "OTA",
}

export function RoomFormDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  pendingLabel,
  isSubmitting = false,
  defaultValues,
  onSubmit,
}: RoomFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<RoomFormSchemaValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: defaultValues ?? emptyValues,
  })

  useEffect(() => {
    if (open) {
      reset(defaultValues ?? emptyValues)
    }
  }, [open, defaultValues, reset])

  function submit(values: RoomFormSchemaValues) {
    onSubmit(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={handleSubmit(submit)}>
          <FormItem label="Title" htmlFor="title" error={errors.title?.message}>
            <Input id="title" {...register("title")} />
          </FormItem>

          <FormItem
            label="Description"
            htmlFor="description"
            error={errors.description?.message}
          >
            <Textarea id="description" rows={3} {...register("description")} />
          </FormItem>

          <FormItem label="Access" htmlFor="roomType" error={errors.roomType?.message}>
            <Controller
              control={control}
              name="roomType"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => value && field.onChange(value)}
                >
                  <SelectTrigger id="roomType" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OTA">Open to all</SelectItem>
                    <SelectItem value="IO">Invite only</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormItem>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? pendingLabel : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
