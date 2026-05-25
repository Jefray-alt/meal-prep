import { fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { logout } from '../../lib/apiFetch'
import { render, screen } from '../../test-utils'
import Header from './Header'

const mockNavigate = vi.hoisted(() => vi.fn())

vi.mock('../../lib/apiFetch', () => ({
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

  it('renders the My Preps navigation link', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: /My Preps/ })).toBeInTheDocument()
  })

  it('renders the sign out button', () => {
    render(<Header />)
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  it('calls logout and navigates to /login when sign out is pressed', async () => {
    vi.mocked(logout).mockResolvedValueOnce(undefined)
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }))
    await waitFor(() => {
      expect(logout).toHaveBeenCalledOnce()
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })
})
