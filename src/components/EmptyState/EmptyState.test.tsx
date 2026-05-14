import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '../../test-utils'
import EmptyState from './EmptyState'

describe('EmptyState', () => {
  it('renders the heading', () => {
    render(<EmptyState onSelectPrompt={vi.fn()} textareaRef={createRef()} />)
    expect(screen.getByText(/What shall we/i)).toBeInTheDocument()
  })

  it('renders all four suggestion buttons', () => {
    render(<EmptyState onSelectPrompt={vi.fn()} textareaRef={createRef()} />)
    expect(screen.getByText('High-protein week')).toBeInTheDocument()
    expect(screen.getByText('Budget batch cook')).toBeInTheDocument()
    expect(screen.getByText('20-minute meals')).toBeInTheDocument()
    expect(screen.getByText('Plant-based plan')).toBeInTheDocument()
  })

  it('calls onSelectPrompt with the correct text when a suggestion is clicked', async () => {
    const user = userEvent.setup()
    const onSelectPrompt = vi.fn()
    render(<EmptyState onSelectPrompt={onSelectPrompt} textareaRef={createRef()} />)
    await user.click(screen.getByText('High-protein week'))
    expect(onSelectPrompt).toHaveBeenCalledWith(
      'Build me a high-protein meal prep plan for the week — I work out 5 days a week and need at least 150g protein daily.',
    )
  })
})
