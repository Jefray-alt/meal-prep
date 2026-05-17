import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { RegisterFormData } from './RegisterForm.types'

import { render, screen } from '../../test-utils'
import RegisterForm from './RegisterForm'

const defaultData: RegisterFormData = {
  confirmPassword: '',
  email: '',
  firstName: '',
  lastName: '',
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
  onSubmit: vi.fn(),
}

describe('RegisterForm', () => {
  it('renders all five fields', () => {
    render(<RegisterForm {...defaultProps} />)
    expect(screen.getByText('First Name')).toBeInTheDocument()
    expect(screen.getByText('Last Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Password')).toBeInTheDocument()
    expect(screen.getByText('Confirm Password')).toBeInTheDocument()
  })

  it('displays inline errors when passed', () => {
    render(
      <RegisterForm
        {...defaultProps}
        errors={{
          confirmPassword: 'Passwords do not match',
          email: 'Enter a valid email address',
          firstName: 'First name is required',
          lastName: 'Last name is required',
          password: 'Password must be at least 8 characters',
        }}
      />,
    )
    expect(screen.getByText('First name is required')).toBeInTheDocument()
    expect(screen.getByText('Last name is required')).toBeInTheDocument()
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument()
    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
  })

  it('renders the conflict banner with a Log in link', () => {
    render(<RegisterForm {...defaultProps} banner={{ type: 'conflict' }} />)
    expect(screen.getByText('This email is already in use.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Log in' })).toBeInTheDocument()
  })

  it('renders the rate-limit banner', () => {
    render(<RegisterForm {...defaultProps} banner={{ type: 'rate-limit' }} />)
    expect(screen.getByText('Too many attempts. Please wait a moment and try again.')).toBeInTheDocument()
  })

  it('renders the generic error banner', () => {
    render(<RegisterForm {...defaultProps} banner={{ type: 'error' }} />)
    expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument()
  })

  it('calls onBannerDismiss when the dismiss button is clicked', async () => {
    const user = userEvent.setup()
    const onBannerDismiss = vi.fn()
    render(<RegisterForm {...defaultProps} banner={{ type: 'error' }} onBannerDismiss={onBannerDismiss} />)
    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onBannerDismiss).toHaveBeenCalledOnce()
  })

  it('calls onSubmit when the form is submitted', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<RegisterForm {...defaultProps} onSubmit={onSubmit} />)
    await user.click(screen.getByRole('button', { name: 'Create account' }))
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('disables the submit button while submitting', () => {
    render(<RegisterForm {...defaultProps} isSubmitting />)
    expect(screen.getByRole('button', { name: 'Creating account…' })).toBeDisabled()
  })
})
