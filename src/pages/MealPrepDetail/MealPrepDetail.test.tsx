import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return { ...actual, useParams: vi.fn(() => ({ id: 'test-id' })) }
})

vi.mock('../../lib/clients/api/api.client', () => ({
  apiClient: vi.fn(),
}))

import { apiClient } from '../../lib/clients/api/api.client'
import { render, screen } from '../../test-utils'
import MealPrepDetail from './MealPrepDetail'

const mockApiClient = vi.mocked(apiClient)

function makeMealPrep() {
  return {
    carbs: 55,
    createdAt: '2026-05-20T10:00:00.000Z',
    fat: 8.2,
    id: 'test-id',
    ingredients: [
      { name: 'Chicken breast', quantity: '500g' },
      { name: 'Brown rice', quantity: '200g' },
    ],
    instructions: 'Cook chicken. Add rice.',
    protein: 42.5,
    tags: [{ id: 'tag-1', name: 'high-protein' }],
    title: 'High-protein chicken bowls',
    updatedAt: '2026-05-27T14:30:00.000Z',
  }
}

function okResponse(data: unknown) {
  return new Response(JSON.stringify(data), { status: 200 })
}

describe('MealPrepDetail', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders skeleton while loading', () => {
    mockApiClient.mockReturnValue(new Promise(() => {}))
    render(<MealPrepDetail />)
    expect(screen.getByRole('status', { name: /loading meal prep/i })).toBeInTheDocument()
  })

  it('renders title, macros, ingredients, instructions, and action buttons on success', async () => {
    mockApiClient.mockResolvedValue(okResponse(makeMealPrep()))
    render(<MealPrepDetail />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'High-protein chicken bowls' })).toBeInTheDocument()
    })
    expect(screen.getByText('42.5g protein')).toBeInTheDocument()
    expect(screen.getByText('55g carbs')).toBeInTheDocument()
    expect(screen.getByText('8.2g fat')).toBeInTheDocument()
    expect(screen.getByText('Chicken breast')).toBeInTheDocument()
    expect(screen.getByText('Cook chicken. Add rice.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit high-protein chicken bowls/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete high-protein chicken bowls/i })).toBeInTheDocument()
  })

  it('renders not-found message with back link when API returns 404', async () => {
    mockApiClient.mockResolvedValue(new Response(null, { status: 404 }))
    render(<MealPrepDetail />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Meal prep not found.')
    })
    expect(screen.getByRole('link', { name: /back to meal preps/i })).toBeInTheDocument()
  })

  it('renders error message when API returns a server error', async () => {
    mockApiClient.mockResolvedValue(new Response(null, { status: 500 }))
    render(<MealPrepDetail />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong. Try refreshing.')
    })
  })

  it('renders error message when network request throws', async () => {
    mockApiClient.mockRejectedValue(new Error('Network error'))
    render(<MealPrepDetail />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong. Try refreshing.')
    })
  })

  it('calls console.log("edit") when Edit button is pressed', async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    mockApiClient.mockResolvedValue(okResponse(makeMealPrep()))
    render(<MealPrepDetail />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /edit high-protein chicken bowls/i })).toBeInTheDocument()
    })
    await user.click(screen.getByRole('button', { name: /edit high-protein chicken bowls/i }))
    expect(consoleSpy).toHaveBeenCalledWith('edit')
    consoleSpy.mockRestore()
  })

  it('calls console.log("delete") when Delete button is pressed', async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    mockApiClient.mockResolvedValue(okResponse(makeMealPrep()))
    render(<MealPrepDetail />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /delete high-protein chicken bowls/i })).toBeInTheDocument()
    })
    await user.click(screen.getByRole('button', { name: /delete high-protein chicken bowls/i }))
    expect(consoleSpy).toHaveBeenCalledWith('delete')
    consoleSpy.mockRestore()
  })
})
