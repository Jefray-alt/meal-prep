import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '../../test-utils'
import InputDock from './InputDock'

const defaultProps = {
  input: '',
  isLoading: false,
  onChange: vi.fn(),
  onCreateYourself: vi.fn(),
  onKeyDown: vi.fn(),
  onSend: vi.fn(),
  textareaRef: createRef<HTMLTextAreaElement>(),
}

describe('InputDock', () => {
  it('renders the textarea with its placeholder', () => {
    render(<InputDock {...defaultProps} />)
    expect(screen.getByPlaceholderText('Describe your ideal meal prep week…')).toBeInTheDocument()
  })

  it('renders the Ask button disabled when input is empty', () => {
    render(<InputDock {...defaultProps} input="" />)
    expect(screen.getByRole('button', { name: 'Ask' })).toBeDisabled()
  })

  it('renders the Ask button enabled when input has text', () => {
    render(<InputDock {...defaultProps} input="hello" />)
    expect(screen.getByRole('button', { name: 'Ask' })).not.toBeDisabled()
  })

  it('calls onCreateYourself when Create yourself is clicked', async () => {
    const user = userEvent.setup()
    const onCreateYourself = vi.fn()
    render(<InputDock {...defaultProps} onCreateYourself={onCreateYourself} />)
    await user.click(screen.getByRole('button', { name: 'Create yourself' }))
    expect(onCreateYourself).toHaveBeenCalledOnce()
  })

  it('calls onSend when Ask is clicked with input', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()
    render(<InputDock {...defaultProps} input="test message" onSend={onSend} />)
    await user.click(screen.getByRole('button', { name: 'Ask' }))
    expect(onSend).toHaveBeenCalledOnce()
  })
})
