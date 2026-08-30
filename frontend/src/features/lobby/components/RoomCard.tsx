import { useState } from "react"
import { Link } from "react-router"
import { Copy, MoreVertical, Pencil, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Room } from "@/types/room"

interface RoomCardProps {
  room: Room
  isOwner: boolean
  onEdit: (room: Room) => void
  onDelete: (room: Room) => void
}

export function RoomCard({ room, isOwner, onEdit, onDelete }: RoomCardProps) {
  const [linkCopied, setLinkCopied] = useState(false)
  const canEnter = room.roomType === "OTA" || isOwner
  const inviteUrl = `${window.location.origin}/rooms/${room.slug}/lobby`

  async function copyInviteLink() {
    await navigator.clipboard.writeText(inviteUrl)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            {room.title}
            <Badge variant={room.roomType === "IO" ? "secondary" : "default"}>
              {room.roomType === "IO" ? "Invite only" : "Open to all"}
            </Badge>
          </CardTitle>
          <CardDescription>Hosted by {room.owner.firstName} {room.owner.lastName}</CardDescription>
        </div>

        {isOwner ? (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(room)} className="flex items-center gap-2">
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(room)}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground">{room.description}</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2">
        {room.roomType === "IO" && isOwner ? (
          <Button variant="outline" size="sm" onClick={copyInviteLink}>
            <Copy className="size-4" />
            {linkCopied ? "Copied" : "Copy invite link"}
          </Button>
        ) : (
          <span />
        )}

        {canEnter ? (
          <Button render={<Link to={`/rooms/${room.slug}/lobby`} />} size="sm">
            Enter room
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  )
}
