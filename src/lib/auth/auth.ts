import type { LoginResult, RegisterData, RegisterResult } from './auth.types'

import { apiClient } from '../clients/api/api.client'
import { TOKEN_KEY } from '../constants'

export async function login(
  email: string,
  password: string,
): Promise<LoginResult> {
  try {
    const res = await apiClient('/auth/login', {
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      skipRefresh: true,
    })
    if (res.status === 200) {
      const body = (await res.json()) as { accessToken: string }
      localStorage.setItem(TOKEN_KEY, body.accessToken)
      return 'ok'
    }
    if (res.status === 401) return 'invalid-credentials'
    if (res.status === 429) return 'rate-limit'
    return 'error'
  } catch {
    return 'error'
  }
}

export async function logout(): Promise<void> {
  await apiClient('/auth/logout', { method: 'POST', skipRefresh: true }).catch(() => {})
  localStorage.removeItem(TOKEN_KEY)
}

export async function register(
  data: RegisterData,
): Promise<RegisterResult> {
  try {
    const res = await apiClient('/auth/register', {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      skipRefresh: true,
    })
    if (res.status === 201) {
      const body = (await res.json()) as { accessToken: string }
      localStorage.setItem(TOKEN_KEY, body.accessToken)
      return 'ok'
    }
    if (res.status === 409) return 'conflict'
    if (res.status === 429) return 'rate-limit'
    return 'error'
  } catch {
    return 'error'
  }
}
