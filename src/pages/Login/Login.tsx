import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import type { LoginFormData } from '../../components/LoginForm/LoginForm.types'

import LoginForm from '../../components/LoginForm/LoginForm'

const ALL_FIELDS: (keyof LoginFormData)[] = ['email', 'password']

const INITIAL_DATA: LoginFormData = {
  email: '',
  password: '',
}

export default function Login() {
  const navigate = useNavigate()
  const [banner, setBanner] = useState<null | { type: 'error' | 'invalid-credentials' | 'rate-limit' }>(null)
  const [data, setData] = useState<LoginFormData>(INITIAL_DATA)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState<Set<keyof LoginFormData>>(new Set())

  const errors = useMemo(() => validate(data, touched), [data, touched])

  const handleBlur = (field: keyof LoginFormData) => {
    setTouched((prev) => new Set([...prev, field]))
  }

  const handleChange = (patch: Partial<LoginFormData>) => {
    setData((prev) => ({ ...prev, ...patch }))
  }

  const handleSubmit = async () => {
    const allTouched = new Set(ALL_FIELDS)
    setTouched(allTouched)
    if (Object.keys(validate(data, allTouched)).length > 0) return

    setIsSubmitting(true)
    setBanner(null)

    try {
      const res = await fetch('/auth/login', {
        body: JSON.stringify({ email: data.email, password: data.password }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      if (res.status === 200) {
        const body = (await res.json()) as { accessToken: string }
        localStorage.setItem('mise_access_token', body.accessToken)
        void navigate('/')
      } else if (res.status === 401) {
        setBanner({ type: 'invalid-credentials' })
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
          Welcome back
        </p>
        <h1
          className="text-5xl font-light italic leading-[1.1] text-bark sm:text-6xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Sign in
        </h1>

        <LoginForm
          banner={banner}
          data={data}
          errors={errors}
          isSubmitting={isSubmitting}
          onBannerDismiss={() => { setBanner(null) }}
          onBlur={handleBlur}
          onChange={handleChange}
          onShowPasswordToggle={() => { setShowPassword((prev) => !prev) }}
          onSubmit={() => { void handleSubmit() }}
          showPassword={showPassword}
        />
      </main>
    </div>
  )
}

function validate(
  data: LoginFormData,
  touched: Set<keyof LoginFormData>,
): Partial<Record<keyof LoginFormData, string>> {
  const errors: Partial<Record<keyof LoginFormData, string>> = {}

  if (touched.has('email')) {
    if (!data.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Enter a valid email address'
    }
  }
  if (touched.has('password') && !data.password) {
    errors.password = 'Password is required'
  }

  return errors
}
