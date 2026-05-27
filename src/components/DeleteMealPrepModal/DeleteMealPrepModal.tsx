import type { UseOverlayStateReturn } from '@heroui/react'

import { Button, Modal } from '@heroui/react'
import { useMemo } from 'react'

import type { DeleteMealPrepModalProps } from './DeleteMealPrepModal.types'

export default function DeleteMealPrepModal({
  error,
  isLoading,
  isOpen,
  mealPrepTitle,
  onClose,
  onConfirm,
  tags,
}: DeleteMealPrepModalProps) {
  const state: UseOverlayStateReturn = useMemo(
    () => ({
      close: onClose,
      isOpen,
      open: () => {},
      setOpen: () => {},
      toggle: () => {},
    }),
    [isOpen, onClose],
  )

  return (
    <Modal state={state}>
      <Modal.Trigger aria-hidden className="sr-only" tabIndex={-1} />
      <Modal.Backdrop isDismissable={!isLoading}>
        <Modal.Container placement="center">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading className="text-base font-medium text-bark">
                Delete {mealPrepTitle}?
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-sm text-smoke">This action cannot be undone.</p>
              {tags.length > 0 && (
                <div className="mt-3">
                  <p className="mb-2 text-xs text-smoke/70">
                    The following tags will be permanently removed if they are not used on any other meal prep:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        className="rounded-full border border-ember/25 bg-ember/10 px-3 py-0.5 text-[9px] tracking-[0.15em] text-ember/65 uppercase"
                        key={tag.id}
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {error && (
                <p className="mt-3 text-sm text-red-400" role="alert">
                  {error}
                </p>
              )}
            </Modal.Body>
            <Modal.Footer className="flex justify-end gap-2">
              <Button
                isDisabled={isLoading}
                onPress={onClose}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                aria-label={`Confirm delete ${mealPrepTitle}`}
                isDisabled={isLoading}
                onPress={onConfirm}
                size="sm"
                variant="danger"
              >
                {isLoading ? 'Deleting…' : 'Delete'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
