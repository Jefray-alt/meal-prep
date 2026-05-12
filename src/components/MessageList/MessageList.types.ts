import type { RefObject } from 'react'

export interface Message {
  content: string
  id: string
  role: Role
}

export interface MessageListProps {
  bottomRef: RefObject<HTMLDivElement | null>
  isLoading: boolean
  messages: Message[]
}

export type Role = 'assistant' | 'user'
