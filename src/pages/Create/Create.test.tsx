import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockNavigate = vi.fn()

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../../lib/apiFetch', () => ({
  apiFetch: vi.fn(),
}))

import { apiFetch } from '../../lib/apiFetch'
import { TOKEN_KEY } from '../../lib/constants'
import { render, screen } from '../../test-utils'
import Create from './Create'

const mockApiFetch = vi.mocked(apiFetch)

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText('e.g. High-protein Sunday batch'), 'My Meal Prep')
  await user.type(
    screen.getByPlaceholderText('Describe preparation steps, cooking times, storage tips…'),
    'Cook everything well',
  )
  await user.type(screen.getByPlaceholderText('Ingredient name'), 'Chicken')
  await user.click(screen.getAllByRole('button', { name: '+' })[0])
  await user.type(screen.getByPlaceholderText('Add a tag'), 'bulk')
  await user.click(screen.getAllByRole('button', { name: '+' })[1])
}

describe('Create', () => {
  beforeEach(() => {
    localStorage.setItem(TOKEN_KEY, 'test-token')
    mockApiFetch.mockResolvedValue(
      new Response(JSON.stringify([{ id: '1', name: 'keto' }]), { status: 200 }),
    )
  })

  afterEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    mockNavigate.mockReset()
  })

  it('shows "Loading tags…" while tags are being fetched', () => {
    mockApiFetch.mockReturnValue(new Promise(() => {}))
    render(<Create />)
    expect(screen.getByRole('status')).toHaveTextContent('Loading tags…')
  })

  it('renders suggestion chip after tags load successfully', async () => {
    render(<Create />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'keto' })).toBeInTheDocument()
    })
  })

  it('shows "Couldn\'t load tags" when GET /tags returns non-2xx', async () => {
    mockApiFetch.mockResolvedValue(new Response(null, { status: 500 }))
    render(<Create />)
    await waitFor(() => {
      expect(screen.getByText('Couldn\'t load tags')).toBeInTheDocument()
    })
  })

  it('calls POST /meal-preps and navigates to /meal-preps on 201', async () => {
    const user = userEvent.setup()
    mockApiFetch.mockImplementation((url: string) => {
      if (url === '/tags') return Promise.resolve(new Response(JSON.stringify([]), { status: 200 }))
      return Promise.resolve(new Response(JSON.stringify({ id: '1' }), { status: 201 }))
    })

    render(<Create />)
    await waitFor(() => { expect(screen.queryByRole('status')).not.toBeInTheDocument() })

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Save Meal Prep' }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/meal-preps')
    })
    expect(mockApiFetch).toHaveBeenCalledWith('/meal-preps', expect.objectContaining({ method: 'POST' }))
  })

  it('shows server error and does not navigate when POST /meal-preps returns non-2xx', async () => {
    const user = userEvent.setup()
    mockApiFetch.mockImplementation((url: string) => {
      if (url === '/tags') return Promise.resolve(new Response(JSON.stringify([]), { status: 200 }))
      return Promise.resolve(new Response(JSON.stringify({ message: 'Bad Request' }), { status: 400 }))
    })

    render(<Create />)
    await waitFor(() => { expect(screen.queryByRole('status')).not.toBeInTheDocument() })

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Save Meal Prep' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong. Please try again.')
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
