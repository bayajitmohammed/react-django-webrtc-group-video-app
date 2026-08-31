import { useState, type FormEvent } from "react"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ChatMessage } from "@/features/video-room/types"

interface ChatPanelProps {
  messages: ChatMessage[]
  onSend: (message: string) => void
}

export function ChatPanel({ messages, onSend }: ChatPanelProps) {
  const [draft, setDraft] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const message = draft.trim()
    if (!message) return
    onSend(message)
    setDraft("")
  }

  return (
    <div className="flex h-full flex-col gap-3 p-4 text-sm text-white">
      <span className="font-medium text-white/90">Chat</span>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-white/50">No messages yet.</p>
        ) : (
          messages.map((message, index) => (
            <p key={index}>
              <span className="font-medium text-white/90">{message.displayName}: </span>
              <span className="text-white/80">{message.message}</span>
            </p>
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Message"
          className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
        />
        <Button type="submit" size="icon" variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/15 hover:text-white">
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  )
}
