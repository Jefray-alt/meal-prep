import { afterEach, describe, expect, it } from 'vitest'

import { TOKEN_KEY } from '../../lib/constants'
import { render, screen } from '../../test-utils'
import AuthRoute from './AuthRoute'

describe('AuthRoute', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('renders Navigate to /login when token is absent', () => {
    render(
      <AuthRoute>
        <div>protected content</div>
      </AuthRoute>,
    )
    expect(screen.queryByText('protected content')).not.toBeInTheDocument()
  })

  it('renders children when token is present', () => {
    localStorage.setItem(TOKEN_KEY, 'test-token')
    render(
      <AuthRoute>
        <div>protected content</div>
      </AuthRoute>,
    )
    expect(screen.getByText('protected content')).toBeInTheDocument()
  })
})
