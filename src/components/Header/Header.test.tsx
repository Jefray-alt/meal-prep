import { describe, expect, it } from 'vitest'

import { render, screen } from '../../test-utils'
import Header from './Header'

describe('Header', () => {
  it('renders the mise brand name', () => {
    render(<Header />)
    expect(screen.getByText('mise')).toBeInTheDocument()
  })

  it('renders the beta chip', () => {
    render(<Header />)
    expect(screen.getByText('beta', { selector: '[data-slot="chip-label"]' })).toBeInTheDocument()
  })

  it('renders the My Preps navigation link', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: /My Preps/ })).toBeInTheDocument()
  })
})
