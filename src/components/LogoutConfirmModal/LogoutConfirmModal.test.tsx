import { fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '../../test-utils'
import LogoutConfirmModal from './LogoutConfirmModal'

const openState = {
  close: vi.fn(),
  isOpen: true,
  open: vi.fn(),
  setOpen: vi.fn(),
  toggle: vi.fn(),
}

const closedState = {
  ...openState,
  isOpen: false,
}

describe('LogoutConfirmModal', () => {
  it('renders confirmation message when open', () => {
    render(
      <LogoutConfirmModal
        isLoggingOut={false}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
        state={openState}
      />,
    )
    expect(screen.getByText(/are you sure you want to sign out/i)).toBeInTheDocument()
  })

  it('does not render modal content when closed', () => {
    render(
      <LogoutConfirmModal
        isLoggingOut={false}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
        state={closedState}
      />,
    )
    expect(screen.queryByText(/are you sure you want to sign out/i)).not.toBeInTheDocument()
  })

  it('calls onConfirm when Confirm button is pressed', () => {
    const onConfirm = vi.fn()
    render(
      <LogoutConfirmModal
        isLoggingOut={false}
        onCancel={vi.fn()}
        onConfirm={onConfirm}
        state={openState}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onCancel when Cancel button is pressed', () => {
    const onCancel = vi.fn()
    render(
      <LogoutConfirmModal
        isLoggingOut={false}
        onCancel={onCancel}
        onConfirm={vi.fn()}
        state={openState}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('disables buttons and shows loading label while logging out', () => {
    render(
      <LogoutConfirmModal
        isLoggingOut
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
        state={openState}
      />,
    )
    expect(screen.getByRole('button', { name: /signing out/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled()
  })
})
