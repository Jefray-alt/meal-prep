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

  it('renders "Loading tags…" with role status when isLoadingTags is true', () => {
    render(<TagPills isLoadingTags onChange={vi.fn()} value={[]} />)
    expect(screen.getByRole('status')).toHaveTextContent('Loading tags…')
  })

  it('renders "Couldn\'t load tags" when tagsLoadError is true', () => {
    render(<TagPills onChange={vi.fn()} tagsLoadError value={[]} />)
    expect(screen.getByText('Couldn\'t load tags')).toBeInTheDocument()
  })

  it('renders suggestion chips for existingTags not already in value', () => {
    render(<TagPills existingTags={['keto', 'bulk']} onChange={vi.fn()} value={[]} />)
    expect(screen.getByRole('button', { name: 'keto' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'bulk' })).toBeInTheDocument()
  })

  it('clicking a suggestion chip calls onChange with tag added', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagPills existingTags={['keto', 'bulk']} onChange={onChange} value={[]} />)
    await user.click(screen.getByRole('button', { name: 'keto' }))
    expect(onChange).toHaveBeenCalledWith(['keto'])
  })

  it('does not render suggestion chip for a tag already in value', () => {
    render(<TagPills existingTags={['keto', 'bulk']} onChange={vi.fn()} value={['keto']} />)
    expect(screen.queryByRole('button', { name: 'keto' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'bulk' })).toBeInTheDocument()
  })
})
