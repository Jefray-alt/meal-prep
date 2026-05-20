import { afterEach, describe, expect, it } from 'vitest'

import { render, screen } from '../../test-utils'
import GuestRoute from './GuestRoute'

describe('GuestRoute', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('renders children when mise_access_token is absent', () => {
    render(
      <GuestRoute>
        <div>child content</div>
      </GuestRoute>,
    )
    expect(screen.getByText('child content')).toBeInTheDocument()
  })

  it('renders Navigate to / and hides children when mise_access_token is present', () => {
    localStorage.setItem('mise_access_token', 'token')
    render(
      <GuestRoute>
        <div>child content</div>
      </GuestRoute>,
    )
    expect(screen.queryByText('child content')).not.toBeInTheDocument()
  })
})
