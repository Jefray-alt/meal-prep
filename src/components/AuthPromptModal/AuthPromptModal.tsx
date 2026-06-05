import { Button, Modal } from '@heroui/react'

import type { AuthPromptModalProps } from './AuthPromptModal.types'

export default function AuthPromptModal({ onLogin, onRegister, state }: AuthPromptModalProps) {
  return (
    <Modal state={state}>
      <Modal.Trigger aria-hidden className="sr-only" tabIndex={-1} />
      <Modal.Backdrop isDismissable>
        <Modal.Container placement="center">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading className="text-base font-medium text-bark">
                Sign in to chat with mise
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-sm text-smoke">
                Create an account or sign in to start planning your meals with AI.
              </p>
            </Modal.Body>
            <Modal.Footer className="flex justify-end gap-2">
              <Button
                className="h-auto rounded-lg px-4 py-1.5 text-xs"
                onPress={onRegister}
                size="sm"
                variant="ghost"
              >
                Create an account
              </Button>
              <Button
                className="h-auto rounded-lg px-4 py-1.5 text-xs font-medium"
                onPress={onLogin}
                size="sm"
                variant="primary"
              >
                Sign in
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
