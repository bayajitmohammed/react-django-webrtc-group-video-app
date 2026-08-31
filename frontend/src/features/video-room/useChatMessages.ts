import { useEffect, useState } from "react"

import type { ChatMessage, ServerMessage } from "@/features/video-room/types"

type Subscribe = (listener: (message: ServerMessage) => void) => () => void

export function useChatMessages(subscribe: Subscribe) {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(
    () =>
      subscribe((message) => {
        if (message.type !== "chat") return
        setMessages((previous) => [
          ...previous,
          { from: message.from, displayName: message.display_name, message: message.message },
        ])
      }),
    [subscribe],
  )

  return messages
}
