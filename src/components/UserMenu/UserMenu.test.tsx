import { fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '../../test-utils'
import UserMenu from './UserMenu'

describe('UserMenu', () => {
  it('renders avatar trigger with accessible label', () => {
    render(<UserMenu onLogoutClick={vi.fn()} />)
    expect(screen.getByRole('button', { name: /account menu/i })).toBeInTheDocument()
  })

  it('shows Profile and Logout items after opening', () => {
    render(<UserMenu onLogoutClick={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /account menu/i }))
    expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /logout/i })).toBeInTheDocument()
  })

  it('calls onLogoutClick when Logout item is selected', () => {
    const onLogoutClick = vi.fn()
    render(<UserMenu onLogoutClick={onLogoutClick} />)
    fireEvent.click(screen.getByRole('button', { name: /account menu/i }))
    fireEvent.click(screen.getByRole('menuitem', { name: /logout/i }))
    expect(onLogoutClick).toHaveBeenCalledOnce()
  })
})
