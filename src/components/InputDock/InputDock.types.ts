import type { KeyboardEvent, RefObject } from 'react'

export interface InputDockProps {
  input: string
  isLoading: boolean
  onChange: (value: string) => void
  onCreateYourself: () => void
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void
  onSend: () => void
  textareaRef: RefObject<HTMLTextAreaElement | null>
}
