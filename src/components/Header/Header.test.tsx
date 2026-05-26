import { fireEvent, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { logout } from '../../lib/auth/auth'
import { TOKEN_KEY } from '../../lib/constants'
import { render, screen } from '../../test-utils'
import Header from './Header'

const mockNavigate = vi.hoisted(() => vi.fn())

vi.mock('../../lib/auth/auth', () => ({
  logout: vi.fn(),
}))

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('Header', () => {
  it('renders the mise brand name', () => {
    render(<Header />)
    expect(screen.getByText('mise')).toBeInTheDocument()
  })

  it('renders the beta chip', () => {
    render(<Header />)
    expect(screen.getByText('beta', { selector: '[data-slot="chip-label"]' })).toBeInTheDocument()
  })

  it('does not render KITCHEN INTELLIGENCE text', () => {
    render(<Header />)
    expect(screen.queryByText(/kitchen intelligence/i)).not.toBeInTheDocument()
  })

  describe('guest state (no token)', () => {
    it('renders the Login button', () => {
      render(<Header />)
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
    })

    it('does not render the My Preps link', () => {
      render(<Header />)
      expect(screen.queryByRole('link', { name: /my preps/i })).not.toBeInTheDocument()
    })

    it('does not render the account menu', () => {
      render(<Header />)
      expect(screen.queryByRole('button', { name: /account menu/i })).not.toBeInTheDocument()
    })
  })

  describe('authenticated state (token present)', () => {
    beforeEach(() => {
      localStorage.setItem(TOKEN_KEY, 'mock-token')
    })

    afterEach(() => {
      localStorage.removeItem(TOKEN_KEY)
    })

    it('renders the My Preps link', () => {
      render(<Header />)
      expect(screen.getByRole('link', { name: /my preps/i })).toBeInTheDocument()
    })

    it('renders the account menu button', () => {
      render(<Header />)
      expect(screen.getByRole('button', { name: /account menu/i })).toBeInTheDocument()
    })

    it('does not render the Login button', () => {
      render(<Header />)
      expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument()
    })

    it('calls logout and navigates to /login after confirming logout', async () => {
      vi.mocked(logout).mockResolvedValueOnce(undefined)
      render(<Header />)

      fireEvent.click(screen.getByRole('button', { name: /account menu/i }))
      fireEvent.click(screen.getByRole('menuitem', { name: /logout/i }))
      fireEvent.click(await screen.findByRole('button', { name: /confirm/i }))

      await waitFor(() => {
        expect(logout).toHaveBeenCalledOnce()
        expect(mockNavigate).toHaveBeenCalledWith('/login')
      })
    })
  })
})
