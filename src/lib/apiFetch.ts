import { TOKEN_KEY } from './constants'

let refreshPromise: null | Promise<boolean> = null

export async function apiFetch(
  url: string,
  init?: RequestInit & { skipRefresh?: boolean },
): Promise<Response> {
  const { skipRefresh, ...fetchInit } = init ?? {}

  const token = localStorage.getItem(TOKEN_KEY)
  const headers = new Headers(fetchInit.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`/api${url}`, { ...fetchInit, headers })

  if (res.status !== 401 || skipRefresh) return res

  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null
    })
  }

  const refreshed = await refreshPromise

  if (!refreshed) {
    window.location.href = '/login'
    return res
  }

  const newToken = localStorage.getItem(TOKEN_KEY)
  const retryHeaders = new Headers(fetchInit.headers)
  if (newToken) retryHeaders.set('Authorization', `Bearer ${newToken}`)
  const retryRes = await fetch(`/api${url}`, { ...fetchInit, headers: retryHeaders })

  if (retryRes.status === 401) {
    localStorage.removeItem(TOKEN_KEY)
    window.location.href = '/login'
  }

  return retryRes
}

export async function logout(): Promise<void> {
  await apiFetch('/api/auth/logout', { method: 'POST', skipRefresh: true }).catch(() => {})
  localStorage.removeItem(TOKEN_KEY)
}

async function doRefresh(): Promise<boolean> {
  const res = await fetch('/api/auth/refresh', { method: 'POST' })
  if (res.ok) {
    const body = (await res.json()) as { accessToken: string }
    localStorage.setItem(TOKEN_KEY, body.accessToken)
    return true
  }
  localStorage.removeItem(TOKEN_KEY)
  return false
}
