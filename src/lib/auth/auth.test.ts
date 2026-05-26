import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TOKEN_KEY } from '../constants'
import { logout } from './auth'

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
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe('/api/auth/logout')
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })

  it('still clears token when server returns non-200', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }))
    await logout()
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })
})
