export interface LoginFormData {
  email: string
  password: string
}

export interface LoginFormProps {
  banner: null | { type: 'error' | 'invalid-credentials' | 'rate-limit' }
  data: LoginFormData
  errors: Partial<Record<keyof LoginFormData, string>>
  isSubmitting: boolean
  onBannerDismiss: () => void
  onBlur: (field: keyof LoginFormData) => void
  onChange: (patch: Partial<LoginFormData>) => void
  onShowPasswordToggle: () => void
  onSubmit: () => void
  showPassword: boolean
}
