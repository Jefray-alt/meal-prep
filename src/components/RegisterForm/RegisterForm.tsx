import { Button, FieldError, Input, Label, TextField } from '@heroui/react'
import { Link } from 'react-router'

import type { RegisterFormProps } from './RegisterForm.types'

const labelCls = 'mb-1 text-[10px] tracking-[0.2em] text-smoke/60 uppercase'

export default function RegisterForm({
  banner,
  data,
  errors,
  isSubmitting,
  onBannerDismiss,
  onBlur,
  onChange,
  onSubmit,
}: RegisterFormProps) {
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
            {banner.type === 'conflict' ? (
              <>
                This email is already in use.{' '}
                <Link className="text-ember underline" to="/login">
                  Log in
                </Link>
              </>
            ) : banner.type === 'rate-limit' ? (
              'Too many attempts. Please wait a moment and try again.'
            ) : (
              'Something went wrong. Please try again.'
            )}
          </span>
          <button
            aria-label="Dismiss"
            className="shrink-0 text-smoke/60 hover:text-bark"
            onClick={onBannerDismiss}
            type="button"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <TextField
          isInvalid={!!errors.firstName}
          onBlur={() => { onBlur('firstName') }}
          onChange={(v) => { onChange({ firstName: v }) }}
          value={data.firstName}
        >
          <Label className={labelCls}>First Name</Label>
          <Input placeholder="Jane" />
          <FieldError className="mt-1 text-xs">{errors.firstName}</FieldError>
        </TextField>

        <TextField
          isInvalid={!!errors.lastName}
          onBlur={() => { onBlur('lastName') }}
          onChange={(v) => { onChange({ lastName: v }) }}
          value={data.lastName}
        >
          <Label className={labelCls}>Last Name</Label>
          <Input placeholder="Doe" />
          <FieldError className="mt-1 text-xs">{errors.lastName}</FieldError>
        </TextField>
      </div>

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
        <Input fullWidth placeholder="••••••••" type="password" />
        <FieldError className="mt-1 text-xs">{errors.password}</FieldError>
      </TextField>

      <TextField
        fullWidth
        isInvalid={!!errors.confirmPassword}
        onBlur={() => { onBlur('confirmPassword') }}
        onChange={(v) => { onChange({ confirmPassword: v }) }}
        value={data.confirmPassword}
      >
        <Label className={labelCls}>Confirm Password</Label>
        <Input fullWidth placeholder="••••••••" type="password" />
        <FieldError className="mt-1 text-xs">{errors.confirmPassword}</FieldError>
      </TextField>

      <div className="border-t border-bark/8 pt-6">
        <Button
          className="h-auto w-full rounded-lg px-5 py-2.5 text-sm font-medium"
          isDisabled={isSubmitting}
          type="submit"
          variant="primary"
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </div>
    </form>
  )
}
