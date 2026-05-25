import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { apiFetch, logout } from './apiFetch'
import { TOKEN_KEY } from './constants'

describe('apiFetch', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn())
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '' },
      writable: true,
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns response without refresh when request succeeds', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }))
    const res = await apiFetch('/api/foo')
    expect(res.status).toBe(200)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('attaches Authorization header when token is present', async () => {
    localStorage.setItem(TOKEN_KEY, 'test-token')
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }))
    await apiFetch('/api/foo')
    const [, init] = vi.mocked(fetch).mock.calls[0]
    expect((init?.headers as Headers).get('Authorization')).toBe('Bearer test-token')
  })

  it('retries original request with new token when refresh succeeds', async () => {
    localStorage.setItem(TOKEN_KEY, 'old-token')
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ accessToken: 'new-token' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
    const res = await apiFetch('/api/foo')
    expect(res.status).toBe(200)
    expect(fetch).toHaveBeenCalledTimes(3)
    expect(localStorage.getItem(TOKEN_KEY)).toBe('new-token')
  })

  it('clears token and redirects to /login when refresh fails', async () => {
    localStorage.setItem(TOKEN_KEY, 'old-token')
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
    await apiFetch('/api/foo')
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    expect(window.location.href).toBe('/login')
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('clears token and redirects when retry is still 401', async () => {
    localStorage.setItem(TOKEN_KEY, 'old-token')
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ accessToken: 'new-token' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
    await apiFetch('/api/foo')
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    expect(window.location.href).toBe('/login')
  })

  it('issues only one refresh call for concurrent 401s', async () => {
    localStorage.setItem(TOKEN_KEY, 'old-token')
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ accessToken: 'new-token' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
    const [a, b] = await Promise.all([apiFetch('/api/foo'), apiFetch('/api/bar')])
    expect(a.status).toBe(200)
    expect(b.status).toBe(200)
    expect(fetch).toHaveBeenCalledTimes(5)
  })

  it('skips refresh and returns 401 directly when skipRefresh is true', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 401 }))
    const res = await apiFetch('/auth/login', { method: 'POST', skipRefresh: true })
    expect(res.status).toBe(401)
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})

describe('logout', () => {
  beforeEach(() => {
    localStorage.setItem(TOKEN_KEY, 'test-token')
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('calls /auth/logout and clears token on success', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }))
    await logout()
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe('/auth/logout')
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })

  it('still clears token when server returns non-200', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }))
    await logout()
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })
})
