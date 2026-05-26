import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '../../test-utils'
import TagPill from './TagPill'

const tag = { id: 'tag-1', name: 'keto' }

describe('TagPill', () => {
  it('displays the tag name and a remove button', () => {
    render(<TagPill onRemove={vi.fn()} tag={tag} />)
    expect(screen.getByText('keto')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove keto' })).toBeInTheDocument()
  })

  it('calls onRemove with the tag when × is clicked', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<TagPill onRemove={onRemove} tag={tag} />)
    await user.click(screen.getByRole('button', { name: 'Remove keto' }))
    expect(onRemove).toHaveBeenCalledWith(tag)
  })
})
