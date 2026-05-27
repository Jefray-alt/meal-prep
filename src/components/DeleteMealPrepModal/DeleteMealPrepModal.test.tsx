import { fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '../../test-utils'
import DeleteMealPrepModal from './DeleteMealPrepModal'

const defaultProps = {
  error: null,
  isLoading: false,
  isOpen: true,
  mealPrepTitle: 'Sunday Batch',
  onClose: vi.fn(),
  onConfirm: vi.fn(),
  tags: [
    { id: 'tag-1', name: 'bulk' },
    { id: 'tag-2', name: 'high-protein' },
  ],
}

describe('DeleteMealPrepModal', () => {
  it('is not rendered when isOpen is false', () => {
    render(<DeleteMealPrepModal {...defaultProps} isOpen={false} />)
    expect(screen.queryByText(/delete sunday batch/i)).not.toBeInTheDocument()
  })

  it('renders title, tag list with note, Cancel and Delete buttons when open with tags', () => {
    render(<DeleteMealPrepModal {...defaultProps} />)
    expect(screen.getByText(/delete sunday batch\?/i)).toBeInTheDocument()
    expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument()
    expect(screen.getByText(/the following tags will be permanently removed/i)).toBeInTheDocument()
    expect(screen.getByText(/#bulk/i)).toBeInTheDocument()
    expect(screen.getByText(/#high-protein/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /confirm delete sunday batch/i })).toBeInTheDocument()
  })

  it('renders title without tag section when tags array is empty', () => {
    render(<DeleteMealPrepModal {...defaultProps} tags={[]} />)
    expect(screen.getByText(/delete sunday batch\?/i)).toBeInTheDocument()
    expect(screen.queryByText(/the following tags will be permanently removed/i)).not.toBeInTheDocument()
  })

  it('disables both buttons and shows loading state on the Delete button when isLoading is true', () => {
    render(<DeleteMealPrepModal {...defaultProps} isLoading />)
    expect(screen.getByRole('button', { name: /confirm delete sunday batch/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled()
  })

  it('shows error message and Delete button is re-enabled when error is set', () => {
    render(
      <DeleteMealPrepModal
        {...defaultProps}
        error="Something went wrong. Try again."
        isLoading={false}
      />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong. Try again.')
    expect(screen.getByRole('button', { name: /confirm delete sunday batch/i })).not.toBeDisabled()
  })

  it('calls onClose when Cancel is clicked', () => {
    const onClose = vi.fn()
    render(<DeleteMealPrepModal {...defaultProps} onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onConfirm when Delete is clicked', () => {
    const onConfirm = vi.fn()
    render(<DeleteMealPrepModal {...defaultProps} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByRole('button', { name: /confirm delete sunday batch/i }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })
})
