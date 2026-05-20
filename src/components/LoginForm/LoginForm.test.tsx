import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { LoginFormData } from './LoginForm.types'

import { render, screen } from '../../test-utils'
import LoginForm from './LoginForm'

const defaultData: LoginFormData = {
  email: '',
  password: '',
}

const defaultProps = {
  banner: null,
  data: defaultData,
  errors: {},
  isSubmitting: false,
  onBannerDismiss: vi.fn(),
  onBlur: vi.fn(),
  onChange: vi.fn(),
  onShowPasswordToggle: vi.fn(),
  onSubmit: vi.fn(),
  showPassword: false,
}

describe('LoginForm', () => {
  it('renders both fields with button enabled', () => {
    render(<LoginForm {...defaultProps} />)
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign in' })).not.toBeDisabled()
  })

  it('displays email inline error when provided', () => {
    render(<LoginForm {...defaultProps} errors={{ email: 'Email is required' }} />)
    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })

  it('displays password inline error when provided', () => {
    render(<LoginForm {...defaultProps} errors={{ password: 'Password is required' }} />)
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  it('renders the invalid-credentials banner', () => {
    render(<LoginForm {...defaultProps} banner={{ type: 'invalid-credentials' }} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password.')
  })

  it('renders the rate-limit banner', () => {
    render(<LoginForm {...defaultProps} banner={{ type: 'rate-limit' }} />)
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Too many attempts. Please wait a moment and try again.',
    )
  })

  it('renders the generic error banner', () => {
    render(<LoginForm {...defaultProps} banner={{ type: 'error' }} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong. Please try again.')
  })

  it('disables the submit button while submitting', () => {
    render(<LoginForm {...defaultProps} isSubmitting />)
    expect(screen.getByRole('button', { name: 'Signing in…' })).toBeDisabled()
  })

  it('shows "Show password" label when showPassword is false', () => {
    render(<LoginForm {...defaultProps} showPassword={false} />)
    expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument()
  })

  it('shows "Hide password" label when showPassword is true', () => {
    render(<LoginForm {...defaultProps} showPassword />)
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument()
  })

  it('calls onShowPasswordToggle when the toggle button is clicked', async () => {
    const user = userEvent.setup()
    const onShowPasswordToggle = vi.fn()
    render(<LoginForm {...defaultProps} onShowPasswordToggle={onShowPasswordToggle} />)
    await user.click(screen.getByRole('button', { name: 'Show password' }))
    expect(onShowPasswordToggle).toHaveBeenCalledOnce()
  })

  it('links to /register', () => {
    render(<LoginForm {...defaultProps} />)
    expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute('href', '/register')
  })
})
