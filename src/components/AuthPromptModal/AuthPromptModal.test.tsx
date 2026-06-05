import { fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '../../test-utils'
import AuthPromptModal from './AuthPromptModal'

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

describe('AuthPromptModal', () => {
  it('renders content when open', () => {
    render(
      <AuthPromptModal
        onLogin={vi.fn()}
        onRegister={vi.fn()}
        state={openState}
      />,
    )
    expect(screen.getByText(/sign in to chat with mise/i)).toBeInTheDocument()
  })

  it('does not render content when closed', () => {
    render(
      <AuthPromptModal
        onLogin={vi.fn()}
        onRegister={vi.fn()}
        state={closedState}
      />,
    )
    expect(screen.queryByText(/sign in to chat with mise/i)).not.toBeInTheDocument()
  })

  it('calls onLogin when Sign in is pressed', () => {
    const onLogin = vi.fn()
    render(
      <AuthPromptModal
        onLogin={onLogin}
        onRegister={vi.fn()}
        state={openState}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(onLogin).toHaveBeenCalledOnce()
  })

  it('calls onRegister when Create an account is pressed', () => {
    const onRegister = vi.fn()
    render(
      <AuthPromptModal
        onLogin={vi.fn()}
        onRegister={onRegister}
        state={openState}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /create an account/i }))
    expect(onRegister).toHaveBeenCalledOnce()
  })
})
