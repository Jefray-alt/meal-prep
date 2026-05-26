import { act, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../lib/clients/api/api.client', () => ({ apiClient: vi.fn() }))

import { apiClient } from '../../lib/clients/api/api.client'
import { render, screen } from '../../test-utils'
import TagCombobox from './TagCombobox'

const mockApiClient = vi.mocked(apiClient)

const makeTag = (name: string, id = `id-${name}`) => ({ id, name })
const makeTags = (count: number, offset = 0) => Array.from({ length: count }, (_, i) => makeTag(`tag-${String(i + offset)}`))

const makeResponse = (data: { id: string; name: string }[], hasMore = false) =>
  new Response(JSON.stringify({ data, hasMore }), { status: 200 })

const defaultProps = {
  onTagRemove: vi.fn(),
  onTagSelect: vi.fn(),
  value: [],
}

let intersectionCallback: IntersectionObserverCallback | null = null
let mockObserve: ReturnType<typeof vi.fn>
let mockDisconnect: ReturnType<typeof vi.fn>

beforeEach(() => {
  intersectionCallback = null
  mockObserve = vi.fn()
  mockDisconnect = vi.fn()
  mockApiClient.mockClear()

  vi.stubGlobal(
    'IntersectionObserver',
    class {
      disconnect = mockDisconnect
      observe = mockObserve
      unobserve = vi.fn()
      constructor(cb: IntersectionObserverCallback) {
        intersectionCallback = cb
      }
    },
  )
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('TagCombobox', () => {
  it('calls GET /tags with no search param on mount and renders items when focused', async () => {
    const user = userEvent.setup()
    mockApiClient.mockResolvedValue(makeResponse(makeTags(10)))

    render(<TagCombobox {...defaultProps} />)

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalled()
    })

    const url = mockApiClient.mock.calls[0][0]
    expect(url).not.toContain('search=')
    expect(url).toContain('limit=10')

    await user.click(screen.getByPlaceholderText('Search tags…'))
    await waitFor(() => {
      expect(screen.getAllByRole('option')).toHaveLength(10)
    })
  })

  it('debounces search and calls GET /tags?search=protein after typing', async () => {
    const user = userEvent.setup()
    mockApiClient.mockResolvedValue(makeResponse(makeTags(3)))

    render(<TagCombobox {...defaultProps} />)
    await waitFor(() => { expect(mockApiClient).toHaveBeenCalledTimes(1); })

    await user.click(screen.getByPlaceholderText('Search tags…'))
    mockApiClient.mockClear()
    mockApiClient.mockResolvedValue(makeResponse([makeTag('high-protein'), makeTag('protein-bar')]))

    fireEvent.change(screen.getByPlaceholderText('Search tags…'), {
      target: { value: 'protein' },
    })

    await waitFor(
      () => {
        const calls = mockApiClient.mock.calls.map((c) => c[0])
        expect(calls.some((u) => u.includes('search=protein'))).toBe(true)
      },
      { timeout: 800 },
    )
  })

  it('calls loadMore with offset=10 when sentinel intersects and hasMore is true', async () => {
    const user = userEvent.setup()
    mockApiClient
      .mockResolvedValueOnce(makeResponse(makeTags(10), true))
      .mockResolvedValueOnce(makeResponse(makeTags(5, 10)))

    render(<TagCombobox {...defaultProps} />)
    await waitFor(() => { expect(mockApiClient).toHaveBeenCalledTimes(1); })

    await user.click(screen.getByPlaceholderText('Search tags…'))
    await waitFor(() => { expect(intersectionCallback).not.toBeNull(); })

    intersectionCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )

    await waitFor(() => {
      const urls = mockApiClient.mock.calls.map((c) => c[0])
      expect(urls.some((u) => u.includes('offset=10'))).toBe(true)
    })
  })

  it('does not call loadMore when hasMore is false', async () => {
    const user = userEvent.setup()
    mockApiClient.mockResolvedValue(makeResponse(makeTags(5), false))

    render(<TagCombobox {...defaultProps} />)
    await waitFor(() => { expect(mockApiClient).toHaveBeenCalledTimes(1); })

    await user.click(screen.getByPlaceholderText('Search tags…'))
    await waitFor(() => { expect(intersectionCallback).not.toBeNull(); })
    mockApiClient.mockClear()

    act(() => {
      intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )
    })

    await new Promise((r) => setTimeout(r, 100))
    expect(mockApiClient).not.toHaveBeenCalled()
  })

  it('shows error message inside dropdown when API returns non-2xx', async () => {
    const user = userEvent.setup()
    mockApiClient.mockResolvedValue(new Response(null, { status: 500 }))

    render(<TagCombobox {...defaultProps} />)
    await waitFor(() => { expect(mockApiClient).toHaveBeenCalledTimes(1); })

    await user.click(screen.getByPlaceholderText('Search tags…'))
    await waitFor(() => {
      expect(screen.getByText('Failed to load tags. Try again.')).toBeInTheDocument()
    })
  })

  it('shows "No tags found" when search returns empty results', async () => {
    const user = userEvent.setup()
    mockApiClient.mockResolvedValue(makeResponse([]))

    render(<TagCombobox {...defaultProps} />)
    await waitFor(() => { expect(mockApiClient).toHaveBeenCalledTimes(1); })

    await user.click(screen.getByPlaceholderText('Search tags…'))
    await waitFor(() => {
      expect(screen.getByText('No tags found')).toBeInTheDocument()
    })
  })

  it('calls onTagSelect when an item is selected', async () => {
    const user = userEvent.setup()
    const onTagSelect = vi.fn()
    const tag = makeTag('keto')
    mockApiClient.mockResolvedValue(makeResponse([tag]))

    render(<TagCombobox {...defaultProps} onTagSelect={onTagSelect} />)
    await user.click(screen.getByPlaceholderText('Search tags…'))

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'keto' })).toBeInTheDocument()
    })
    await user.click(screen.getByRole('option', { name: 'keto' }))

    expect(onTagSelect).toHaveBeenCalledWith(tag)
  })

  it('renders selected tags as pills with remove buttons', () => {
    const selected = [makeTag('keto'), makeTag('bulk')]
    mockApiClient.mockResolvedValue(makeResponse([]))

    render(<TagCombobox {...defaultProps} value={selected} />)

    expect(screen.getByRole('button', { name: 'Remove keto' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove bulk' })).toBeInTheDocument()
  })

  it('calls onTagRemove when a pill × is clicked', async () => {
    const user = userEvent.setup()
    const onTagRemove = vi.fn()
    const tag = makeTag('keto')
    mockApiClient.mockResolvedValue(makeResponse([]))

    render(<TagCombobox {...defaultProps} onTagRemove={onTagRemove} value={[tag]} />)
    await user.click(screen.getByRole('button', { name: 'Remove keto' }))

    expect(onTagRemove).toHaveBeenCalledWith(tag)
  })

  it('clears the input after selecting an existing tag from the dropdown', async () => {
    const user = userEvent.setup()
    const tag = makeTag('keto')
    mockApiClient.mockResolvedValue(makeResponse([tag]))

    render(<TagCombobox {...defaultProps} />)
    const input = screen.getByPlaceholderText('Search tags…')
    await user.click(input)

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'keto' })).toBeInTheDocument()
    })
    await user.click(screen.getByRole('option', { name: 'keto' }))

    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })

  it('calls onTagSelect with a new tag when Enter is pressed with typed text', async () => {
    const user = userEvent.setup()
    const onTagSelect = vi.fn()
    mockApiClient.mockResolvedValue(makeResponse([]))

    render(<TagCombobox {...defaultProps} onTagSelect={onTagSelect} />)
    const input = screen.getByPlaceholderText('Search tags…')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'new-tag' } })
    await user.keyboard('{Enter}')

    expect(onTagSelect).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'new-tag' }),
    )
    expect(onTagSelect.mock.calls[0][0]).toHaveProperty('id')
  })

  it('clears the input after creating a new tag via Enter', async () => {
    const user = userEvent.setup()
    mockApiClient.mockResolvedValue(makeResponse([]))

    render(<TagCombobox {...defaultProps} />)
    const input = screen.getByPlaceholderText('Search tags…')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'lunch' } })
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })

  it('does not call onTagSelect when Enter is pressed with an empty input', async () => {
    const user = userEvent.setup()
    const onTagSelect = vi.fn()
    mockApiClient.mockResolvedValue(makeResponse([]))

    render(<TagCombobox {...defaultProps} onTagSelect={onTagSelect} />)
    const input = screen.getByPlaceholderText('Search tags…')
    await user.click(input)
    await user.keyboard('{Enter}')

    expect(onTagSelect).not.toHaveBeenCalled()
  })

  it('does not call onTagSelect when Enter is pressed with a duplicate tag name', async () => {
    const user = userEvent.setup()
    const onTagSelect = vi.fn()
    const existing = makeTag('keto')
    mockApiClient.mockResolvedValue(makeResponse([]))

    render(<TagCombobox {...defaultProps} onTagSelect={onTagSelect} value={[existing]} />)
    const input = screen.getByPlaceholderText('Search tags…')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'keto' } })
    await user.keyboard('{Enter}')

    expect(onTagSelect).not.toHaveBeenCalled()
  })

  it('shows a "Press Enter to add" hint when the input has text', async () => {
    const user = userEvent.setup()
    mockApiClient.mockResolvedValue(makeResponse([]))

    render(<TagCombobox {...defaultProps} />)
    const input = screen.getByPlaceholderText('Search tags…')
    await user.click(input)
    fireEvent.change(input, { target: { value: 'lunch' } })

    await waitFor(() => {
      expect(screen.getByText(/Press Enter to add/)).toBeInTheDocument()
    })
  })

  it('does not show the hint when the input is empty', () => {
    mockApiClient.mockResolvedValue(makeResponse([]))

    render(<TagCombobox {...defaultProps} />)

    expect(screen.queryByText(/Press Enter to add/)).not.toBeInTheDocument()
  })
})
