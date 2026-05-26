import { Button, Modal } from '@heroui/react'

import type { LogoutConfirmModalProps } from './LogoutConfirmModal.types'

export default function LogoutConfirmModal({ isLoggingOut, onCancel, onConfirm, state }: LogoutConfirmModalProps) {
  return (
    <Modal state={state}>
      {/* Hidden trigger satisfies DialogTrigger's PressResponder — modal is opened programmatically */}
      <Modal.Trigger aria-hidden className="sr-only" tabIndex={-1} />
      <Modal.Backdrop isDismissable={!isLoggingOut}>
        <Modal.Container placement="center">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading className="text-base font-medium text-bark">
                Sign out
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-sm text-smoke">
                Are you sure you want to sign out?
              </p>
            </Modal.Body>
            <Modal.Footer className="flex justify-end gap-2">
              <Button
                isDisabled={isLoggingOut}
                onPress={onCancel}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                isDisabled={isLoggingOut}
                onPress={onConfirm}
                size="sm"
                variant="primary"
              >
                {isLoggingOut ? 'Signing out…' : 'Confirm'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
