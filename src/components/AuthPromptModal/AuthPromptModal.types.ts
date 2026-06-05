import type { UseOverlayStateReturn } from '@heroui/react'

export interface AuthPromptModalProps {
  onLogin: () => void
  onRegister: () => void
  state: UseOverlayStateReturn
}
