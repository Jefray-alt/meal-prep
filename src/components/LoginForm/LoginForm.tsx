import { Button, FieldError, Input, Label, TextField } from '@heroui/react'
import { Link } from 'react-router'

import type { LoginFormProps } from './LoginForm.types'

const labelCls = 'mb-1 text-[10px] tracking-[0.2em] text-smoke/60 uppercase'

export default function LoginForm({
  banner,
  data,
  errors,
  isSubmitting,
  onBannerDismiss,
  onBlur,
  onChange,
  onShowPasswordToggle,
  onSubmit,
  showPassword,
}: LoginFormProps) {
  return (
    <form
      className="mt-10 flex flex-col gap-6 rounded-2xl border border-bark/10 bg-char/92 p-8 shadow-sm backdrop-blur-sm"
      noValidate
      onSubmit={(e) => { e.preventDefault(); onSubmit() }}
    >
      {banner && (
        <div
          className="flex items-start justify-between gap-3 rounded-lg border border-ember/20 bg-ember/8 px-4 py-3 text-sm text-bark/80"
          role="alert"
        >
          <span>
            {banner.type === 'invalid-credentials'
              ? 'Invalid email or password.'
              : banner.type === 'rate-limit'
                ? 'Too many attempts. Please wait a moment and try again.'
                : 'Something went wrong. Please try again.'}
          </span>
          <Button
            aria-label="Dismiss"
            className="h-auto min-w-0 shrink-0 p-0 text-smoke/60 data-hover:text-bark"
            onPress={onBannerDismiss}
            size="sm"
            variant="ghost"
          >
            ×
          </Button>
        </div>
      )}

      <TextField
        fullWidth
        isInvalid={!!errors.email}
        onBlur={() => { onBlur('email') }}
        onChange={(v) => { onChange({ email: v }) }}
        value={data.email}
      >
        <Label className={labelCls}>Email</Label>
        <Input fullWidth placeholder="jane@example.com" type="email" />
        <FieldError className="mt-1 text-xs">{errors.email}</FieldError>
      </TextField>

      <TextField
        fullWidth
        isInvalid={!!errors.password}
        onBlur={() => { onBlur('password') }}
        onChange={(v) => { onChange({ password: v }) }}
        value={data.password}
      >
        <Label className={labelCls}>Password</Label>
        <div className="relative">
          <Input fullWidth placeholder="••••••••" type={showPassword ? 'text' : 'password'} />
          <Button
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 h-auto min-w-0 -translate-y-1/2 p-0 text-xs text-smoke/60 data-hover:text-bark"
            onPress={onShowPasswordToggle}
            size="sm"
            variant="ghost"
          >
            {showPassword ? 'Hide' : 'Show'}
          </Button>
        </div>
        <FieldError className="mt-1 text-xs">{errors.password}</FieldError>
      </TextField>

      <div className="border-t border-bark/8 pt-6">
        <Button
          className="h-auto w-full rounded-lg px-5 py-2.5 text-sm font-medium"
          isDisabled={isSubmitting}
          type="submit"
          variant="primary"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </div>

      <p className="text-center text-sm text-smoke/60">
        Don&apos;t have an account yet?{' '}
        <Link className="text-ember underline" to="/register">
          Sign up
        </Link>
      </p>
    </form>
  )
}
