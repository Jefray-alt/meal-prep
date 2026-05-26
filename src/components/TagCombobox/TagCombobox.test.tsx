import { act, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../lib/apiFetch', () => ({ apiFetch: vi.fn() }))

import { apiFetch } from '../../lib/apiFetch'
import { render, screen } from '../../test-utils'
import TagCombobox from './TagCombobox'

const mockApiFetch = vi.mocked(apiFetch)

const makeTag = (name: string, id = `id-${name}`) => ({ id, name })
const makeTags = (count: number) => Array.from({ length: count }, (_, i) => makeTag(`tag-${String(i)}`))

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
  mockApiFetch.mockClear()

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
    mockApiFetch.mockResolvedValue(makeResponse(makeTags(10)))

    render(<TagCombobox {...defaultProps} />)

    await waitFor(() => {
      expect(mockApiFetch).toHaveBeenCalled()
    })

    const url = mockApiFetch.mock.calls[0][0]
    expect(url).not.toContain('search=')
    expect(url).toContain('limit=10')

    await user.click(screen.getByPlaceholderText('Search tags…'))
    await waitFor(() => {
      expect(screen.getAllByRole('option')).toHaveLength(10)
    })
  })

  it('debounces search and calls GET /tags?search=protein after typing', async () => {
    const user = userEvent.setup()
    mockApiFetch.mockResolvedValue(makeResponse(makeTags(3)))

    render(<TagCombobox {...defaultProps} />)
    await waitFor(() => { expect(mockApiFetch).toHaveBeenCalledTimes(1); })

    await user.click(screen.getByPlaceholderText('Search tags…'))
    mockApiFetch.mockClear()
    mockApiFetch.mockResolvedValue(makeResponse([makeTag('high-protein'), makeTag('protein-bar')]))

    fireEvent.change(screen.getByPlaceholderText('Search tags…'), {
      target: { value: 'protein' },
    })

    await waitFor(
      () => {
        const calls = mockApiFetch.mock.calls.map((c) => c[0])
        expect(calls.some((u) => u.includes('search=protein'))).toBe(true)
      },
      { timeout: 800 },
    )
  })

  it('calls loadMore with offset=10 when sentinel intersects and hasMore is true', async () => {
    const user = userEvent.setup()
    mockApiFetch
      .mockResolvedValueOnce(makeResponse(makeTags(10), true))
      .mockResolvedValueOnce(makeResponse(makeTags(5)))

    render(<TagCombobox {...defaultProps} />)
    await waitFor(() => { expect(mockApiFetch).toHaveBeenCalledTimes(1); })

    await user.click(screen.getByPlaceholderText('Search tags…'))
    await waitFor(() => { expect(intersectionCallback).not.toBeNull(); })

    intersectionCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )

    await waitFor(() => {
      const urls = mockApiFetch.mock.calls.map((c) => c[0])
      expect(urls.some((u) => u.includes('offset=10'))).toBe(true)
    })
  })

  it('does not call loadMore when hasMore is false', async () => {
    const user = userEvent.setup()
    mockApiFetch.mockResolvedValue(makeResponse(makeTags(5), false))

    render(<TagCombobox {...defaultProps} />)
    await waitFor(() => { expect(mockApiFetch).toHaveBeenCalledTimes(1); })

    await user.click(screen.getByPlaceholderText('Search tags…'))
    await waitFor(() => { expect(intersectionCallback).not.toBeNull(); })
    mockApiFetch.mockClear()

    act(() => {
      intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )
    })

    await new Promise((r) => setTimeout(r, 100))
    expect(mockApiFetch).not.toHaveBeenCalled()
  })

  it('shows error message inside dropdown when API returns non-2xx', async () => {
    const user = userEvent.setup()
    mockApiFetch.mockResolvedValue(new Response(null, { status: 500 }))

    render(<TagCombobox {...defaultProps} />)
    await waitFor(() => { expect(mockApiFetch).toHaveBeenCalledTimes(1); })

    await user.click(screen.getByPlaceholderText('Search tags…'))
    await waitFor(() => {
      expect(screen.getByText('Failed to load tags. Try again.')).toBeInTheDocument()
    })
  })

  it('shows "No tags found" when search returns empty results', async () => {
    const user = userEvent.setup()
    mockApiFetch.mockResolvedValue(makeResponse([]))

    render(<TagCombobox {...defaultProps} />)
    await waitFor(() => { expect(mockApiFetch).toHaveBeenCalledTimes(1); })

    await user.click(screen.getByPlaceholderText('Search tags…'))
    await waitFor(() => {
      expect(screen.getByText('No tags found')).toBeInTheDocument()
    })
  })

  it('calls onTagSelect when an item is selected', async () => {
    const user = userEvent.setup()
    const onTagSelect = vi.fn()
    const tag = makeTag('keto')
    mockApiFetch.mockResolvedValue(makeResponse([tag]))

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
    mockApiFetch.mockResolvedValue(makeResponse([]))

    render(<TagCombobox {...defaultProps} value={selected} />)

    expect(screen.getByRole('button', { name: 'Remove keto' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove bulk' })).toBeInTheDocument()
  })

  it('calls onTagRemove when a pill × is clicked', async () => {
    const user = userEvent.setup()
    const onTagRemove = vi.fn()
    const tag = makeTag('keto')
    mockApiFetch.mockResolvedValue(makeResponse([]))

    render(<TagCombobox {...defaultProps} onTagRemove={onTagRemove} value={[tag]} />)
    await user.click(screen.getByRole('button', { name: 'Remove keto' }))

    expect(onTagRemove).toHaveBeenCalledWith(tag)
  })
})
