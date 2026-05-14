import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '../../test-utils'
import TagPills from './TagPills'

describe('TagPills', () => {
  it('renders the Tags label', () => {
    render(<TagPills onChange={vi.fn()} value={[]} />)
    expect(screen.getByText('Tags')).toBeInTheDocument()
  })

  it('renders existing tags', () => {
    render(<TagPills onChange={vi.fn()} value={['vegan', 'quick']} />)
    expect(screen.getByText('vegan')).toBeInTheDocument()
    expect(screen.getByText('quick')).toBeInTheDocument()
  })

  it('calls onChange with the new tag when + is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagPills onChange={onChange} value={[]} />)
    await user.type(screen.getByPlaceholderText('Add a tag'), 'vegan')
    await user.click(screen.getByRole('button', { name: '+' }))
    expect(onChange).toHaveBeenCalledWith(['vegan'])
  })

  it('calls onChange without the removed tag when × is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagPills onChange={onChange} value={['vegan']} />)
    await user.click(screen.getByRole('button', { name: '×' }))
    expect(onChange).toHaveBeenCalledWith([])
  })
})
