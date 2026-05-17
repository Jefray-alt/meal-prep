import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import type { RegisterFormData } from '../../components/RegisterForm/RegisterForm.types'

import RegisterForm from '../../components/RegisterForm/RegisterForm'

const ALL_FIELDS: (keyof RegisterFormData)[] = [
  'confirmPassword',
  'email',
  'firstName',
  'lastName',
  'password',
]

const INITIAL_DATA: RegisterFormData = {
  confirmPassword: '',
  email: '',
  firstName: '',
  lastName: '',
  password: '',
}

export default function Register() {
  const navigate = useNavigate()
  const [banner, setBanner] = useState<null | { type: 'conflict' | 'error' | 'rate-limit' }>(null)
  const [data, setData] = useState<RegisterFormData>(INITIAL_DATA)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<Set<keyof RegisterFormData>>(new Set())

  const errors = useMemo(() => validate(data, touched), [data, touched])

  const handleBlur = (field: keyof RegisterFormData) => {
    setTouched((prev) => new Set([...prev, field]))
  }

  const handleChange = (patch: Partial<RegisterFormData>) => {
    setData((prev) => ({ ...prev, ...patch }))
  }

  const handleSubmit = async () => {
    const allTouched = new Set(ALL_FIELDS)
    setTouched(allTouched)
    if (Object.keys(validate(data, allTouched)).length > 0) return

    setIsSubmitting(true)
    setBanner(null)

    try {
      const res = await fetch('/auth/register', {
        body: JSON.stringify({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          password: data.password,
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      if (res.status === 201) {
        const body = (await res.json()) as { accessToken: string }
        localStorage.setItem('mise_access_token', body.accessToken)
        void navigate('/')
      } else if (res.status === 409) {
        setBanner({ type: 'conflict' })
      } else if (res.status === 429) {
        setBanner({ type: 'rate-limit' })
      } else {
        setBanner({ type: 'error' })
      }
    } catch {
      setBanner({ type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-char text-bark antialiased"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div aria-hidden="true" className="grain-overlay" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-0 h-175 w-175 -translate-x-1/2 translate-y-1/2 rounded-full bg-ember opacity-[0.04] blur-[160px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-0 top-0 h-125 w-125 translate-x-1/2 -translate-y-1/2 rounded-full bg-moss opacity-[0.04] blur-[140px]"
      />

      <main className="relative z-10 w-full max-w-md px-6 py-14">
        <p className="mb-3 text-[10px] tracking-[0.35em] text-ember/50 uppercase">
          Welcome to mise
        </p>
        <h1
          className="text-5xl font-light italic leading-[1.1] text-bark sm:text-6xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Create account
        </h1>

        <RegisterForm
          banner={banner}
          data={data}
          errors={errors}
          isSubmitting={isSubmitting}
          onBannerDismiss={() => { setBanner(null) }}
          onBlur={handleBlur}
          onChange={handleChange}
          onSubmit={() => { void handleSubmit() }}
        />
      </main>
    </div>
  )
}

function validate(
  data: RegisterFormData,
  touched: Set<keyof RegisterFormData>,
): Partial<Record<keyof RegisterFormData, string>> {
  const errors: Partial<Record<keyof RegisterFormData, string>> = {}

  if (touched.has('confirmPassword') && data.confirmPassword !== data.password) {
    errors.confirmPassword = 'Passwords do not match'
  }
  if (touched.has('email')) {
    if (!data.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Enter a valid email address'
    }
  }
  if (touched.has('firstName') && !data.firstName.trim()) {
    errors.firstName = 'First name is required'
  }
  if (touched.has('lastName') && !data.lastName.trim()) {
    errors.lastName = 'Last name is required'
  }
  if (touched.has('password')) {
    if (!data.password) {
      errors.password = 'Password is required'
    } else if (data.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }
  }

  return errors
}
