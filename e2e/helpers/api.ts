const API_BASE = process.env['API_URL'] ?? 'http://localhost:3000'

interface AuthResponse {
  accessToken: string
}

interface TestUser {
  email: string
  firstName: string
  lastName: string
  password: string
}

export async function createTestUser(user: TestUser): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    body: JSON.stringify(user),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  if (!res.ok) throw new Error(`Register failed: ${String(res.status)}`)
  return res.json() as Promise<AuthResponse>
}

export async function loginTestUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  if (!res.ok) throw new Error(`Login failed: ${String(res.status)}`)
  return res.json() as Promise<AuthResponse>
}
