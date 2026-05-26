export type LoginResult = 'error' | 'invalid-credentials' | 'ok' | 'rate-limit'

export interface RegisterData {
  email: string
  firstName: string
  lastName: string
  password: string
}

export type RegisterResult = 'conflict' | 'error' | 'ok' | 'rate-limit'
