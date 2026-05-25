import { afterEach, describe, expect, it } from 'vitest'

import { TOKEN_KEY } from '../../lib/constants'
import { render, screen } from '../../test-utils'
import GuestRoute from './GuestRoute'

describe('GuestRoute', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('renders children when token is absent', () => {
    render(
      <GuestRoute>
        <div>child content</div>
      </GuestRoute>,
    )
    expect(screen.getByText('child content')).toBeInTheDocument()
  })

  it('renders Navigate to / and hides children when token is present', () => {
    localStorage.setItem(TOKEN_KEY, 'token')
    render(
      <GuestRoute>
        <div>child content</div>
      </GuestRoute>,
    )
    expect(screen.queryByText('child content')).not.toBeInTheDocument()
  })
})
