import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { mockNavigate, mockToastSuccess } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockToastSuccess: vi.fn(),
}))

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: 'mp-uuid-1' }),
  }
})

vi.mock('../../lib/clients/api/api.client', () => ({
  apiClient: vi.fn(),
}))

vi.mock('@heroui/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@heroui/react')>()
  return {
    ...actual,
    toast: { ...(actual.toast as object), success: mockToastSuccess },
  }
})

vi.mock('../../components/MealPrepForm/MealPrepForm', () => ({
  default: ({ onCancel, onSave, serverError }: { onCancel: () => void; onSave: () => void; serverError?: null | string }) => (
    <div>
      <div data-testid="meal-prep-form" />
      {serverError && <p role="alert">{serverError}</p>}
      <button onClick={onCancel} type="button">Cancel</button>
      <button onClick={onSave} type="button">Save Meal Prep</button>
    </div>
  ),
}))

import { waitFor } from '@testing-library/react'

import { apiClient } from '../../lib/clients/api/api.client'
import { TOKEN_KEY } from '../../lib/constants'
import { render, screen } from '../../test-utils'
import Edit from './Edit'

const mockApiClient = vi.mocked(apiClient)

const fakeMealPrep = {
  carbs: 10,
  createdAt: '2024-01-01T00:00:00Z',
  fat: 5,
  id: 'mp-uuid-1',
  ingredients: [{ name: 'Chicken', quantity: '200g' }],
  instructions: 'Cook well.',
  protein: 42,
  tags: [{ id: 'tag-1', name: 'high-protein' }],
  title: 'Sunday Batch',
  updatedAt: '2024-01-01T00:00:00Z',
}

describe('Edit', () => {
  beforeEach(() => {
    localStorage.setItem(TOKEN_KEY, 'test-token')
  })

  afterEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    mockNavigate.mockReset()
    mockToastSuccess.mockReset()
  })

  it('renders a loading skeleton while fetching', () => {
    mockApiClient.mockReturnValue(new Promise(() => {}))
    render(<Edit />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('shows the form after a successful fetch', async () => {
    mockApiClient.mockResolvedValue(new Response(JSON.stringify(fakeMealPrep), { status: 200 }))
    render(<Edit />)
    await waitFor(() => {
      expect(screen.getByTestId('meal-prep-form')).toBeInTheDocument()
    })
  })

  it('shows not-found message when GET returns 404', async () => {
    mockApiClient.mockResolvedValue(new Response(null, { status: 404 }))
    render(<Edit />)
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Meal prep not found.')
    })
  })

  it('shows error message when GET returns a server error', async () => {
    mockApiClient.mockResolvedValue(new Response(null, { status: 500 }))
    render(<Edit />)
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong. Try refreshing.')
    })
  })

  it('shows error message when GET throws', async () => {
    mockApiClient.mockRejectedValue(new Error('Network error'))
    render(<Edit />)
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong. Try refreshing.')
    })
  })

  it('calls PATCH, fires toast, and navigates to detail page on save', async () => {
    const user = userEvent.setup()
    mockApiClient
      .mockResolvedValueOnce(new Response(JSON.stringify(fakeMealPrep), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(fakeMealPrep), { status: 200 }))

    render(<Edit />)
    await waitFor(() => { expect(screen.getByTestId('meal-prep-form')).toBeInTheDocument() })

    await user.click(screen.getByRole('button', { name: 'Save Meal Prep' }))

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith('/meal-preps/mp-uuid-1', expect.objectContaining({ method: 'PATCH' }))
      expect(mockToastSuccess).toHaveBeenCalledWith('Meal prep saved')
      expect(mockNavigate).toHaveBeenCalledWith('/meal-preps/mp-uuid-1')
    })
  })

  it('shows server error and does not navigate when PATCH returns non-2xx', async () => {
    const user = userEvent.setup()
    mockApiClient
      .mockResolvedValueOnce(new Response(JSON.stringify(fakeMealPrep), { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))

    render(<Edit />)
    await waitFor(() => { expect(screen.getByTestId('meal-prep-form')).toBeInTheDocument() })

    await user.click(screen.getByRole('button', { name: 'Save Meal Prep' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong. Please try again.')
    })
    expect(mockNavigate).not.toHaveBeenCalled()
    expect(mockToastSuccess).not.toHaveBeenCalled()
  })

  it('navigates to detail page when Cancel is pressed', async () => {
    const user = userEvent.setup()
    mockApiClient.mockResolvedValue(new Response(JSON.stringify(fakeMealPrep), { status: 200 }))

    render(<Edit />)
    await waitFor(() => { expect(screen.getByTestId('meal-prep-form')).toBeInTheDocument() })

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(mockNavigate).toHaveBeenCalledWith('/meal-preps/mp-uuid-1')
    expect(mockApiClient).toHaveBeenCalledTimes(1)
  })
})
