export interface RegisterFormData {
  confirmPassword: string
  email: string
  firstName: string
  lastName: string
  password: string
}

export interface RegisterFormProps {
  banner: null | { type: 'conflict' | 'error' | 'rate-limit' }
  data: RegisterFormData
  errors: Partial<Record<keyof RegisterFormData, string>>
  isSubmitting: boolean
  onBannerDismiss: () => void
  onBlur: (field: keyof RegisterFormData) => void
  onChange: (patch: Partial<RegisterFormData>) => void
  onSubmit: () => void
}
