import type { RefObject } from 'react'

export interface EmptyStateProps {
  onSelectPrompt: (text: string) => void
  textareaRef: RefObject<HTMLTextAreaElement | null>
}
