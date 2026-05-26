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

vi.mock('../../components/TagCombobox/TagCombobox', () => ({
  default: ({ onTagSelect }: { onTagSelect: (tag: { id: string; name: string }) => void }) => (
    <button onClick={() => { onTagSelect({ id: 'tag-1', name: 'bulk' }) }} type="button">
      Add bulk tag
    </button>
  ),
}))

import { waitFor } from '@testing-library/react'

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
  await user.click(screen.getByRole('button', { name: '+' }))
  await user.click(screen.getByRole('button', { name: 'Add bulk tag' }))
}

describe('Create', () => {
  beforeEach(() => {
    localStorage.setItem(TOKEN_KEY, 'test-token')
  })

  afterEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    mockNavigate.mockReset()
  })

  it('renders the form', () => {
    render(<Create />)
    expect(screen.getByPlaceholderText('e.g. High-protein Sunday batch')).toBeInTheDocument()
  })

  it('calls POST /meal-preps and navigates to /meal-preps on 201', async () => {
    const user = userEvent.setup()
    mockApiFetch.mockResolvedValue(new Response(JSON.stringify({ id: '1' }), { status: 201 }))

    render(<Create />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Save Meal Prep' }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/meal-preps')
    })
    expect(mockApiFetch).toHaveBeenCalledWith('/meal-preps', expect.objectContaining({ method: 'POST' }))
  })

  it('shows server error and does not navigate when POST /meal-preps returns non-2xx', async () => {
    const user = userEvent.setup()
    mockApiFetch.mockResolvedValue(
      new Response(JSON.stringify({ message: 'Bad Request' }), { status: 400 }),
    )

    render(<Create />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Save Meal Prep' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong. Please try again.')
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
