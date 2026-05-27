import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../lib/clients/api/api.client', () => ({
  apiClient: vi.fn(),
}))

import { waitFor } from '@testing-library/react'

import { apiClient } from '../../lib/clients/api/api.client'
import { render, screen } from '../../test-utils'
import MealPreps from './MealPreps'

const mockApiClient = vi.mocked(apiClient)

function makeMealPrep(id: string) {
  return {
    carbs: null,
    fat: 30,
    id,
    protein: 100,
    tags: [{ id: 'tag-1', name: 'High-protein' }],
    title: `Meal Prep ${id}`,
  }
}

function okResponse(data: unknown[], nextCursor: null | string = null) {
  return new Response(JSON.stringify({ data, nextCursor }), { status: 200 })
}

describe('MealPreps', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders cards and "Load more" button when API returns items with nextCursor', async () => {
    mockApiClient.mockResolvedValue(okResponse([makeMealPrep('1'), makeMealPrep('2')], 'cursor-abc'))
    render(<MealPreps />)

    await waitFor(() => {
      expect(screen.getByText('Meal Prep 1')).toBeInTheDocument()
    })
    expect(screen.getByText('Meal Prep 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument()
  })

  it('renders cards and no "Load more" button when nextCursor is null', async () => {
    mockApiClient.mockResolvedValue(okResponse([makeMealPrep('1')], null))
    render(<MealPreps />)

    await waitFor(() => {
      expect(screen.getByText('Meal Prep 1')).toBeInTheDocument()
    })
    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument()
  })

  it('renders empty state when API returns no items', async () => {
    mockApiClient.mockResolvedValue(okResponse([]))
    render(<MealPreps />)

    await waitFor(() => {
      expect(screen.getByText('Nothing prepared yet')).toBeInTheDocument()
    })
    expect(screen.queryByRole('link', { name: /view/i })).not.toBeInTheDocument()
  })

  it('renders error message when API fails', async () => {
    mockApiClient.mockResolvedValue(new Response(null, { status: 500 }))
    render(<MealPreps />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Couldn\'t load your meal preps. Try refreshing.',
      )
    })
    expect(screen.queryByRole('link', { name: /view/i })).not.toBeInTheDocument()
  })

  it('appends next page and hides "Load more" when nextCursor becomes null', async () => {
    const user = userEvent.setup()
    mockApiClient
      .mockResolvedValueOnce(okResponse([makeMealPrep('1'), makeMealPrep('2')], 'cursor-abc'))
      .mockResolvedValueOnce(okResponse([makeMealPrep('3')], null))

    render(<MealPreps />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /load more/i }))

    await waitFor(() => {
      expect(screen.getByText('Meal Prep 3')).toBeInTheDocument()
    })
    expect(screen.getByText('Meal Prep 1')).toBeInTheDocument()
    expect(screen.getByText('Meal Prep 2')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument()
  })
})
