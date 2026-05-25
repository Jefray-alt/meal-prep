import type { UseOverlayStateReturn } from '@heroui/react'

export interface LogoutConfirmModalProps {
  isLoggingOut: boolean
  onCancel: () => void
  onConfirm: () => void
  state: UseOverlayStateReturn
}
