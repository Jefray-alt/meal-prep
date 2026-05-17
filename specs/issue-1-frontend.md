# Frontend Spec — Issue #1: Add user registration flow

## Goal

New visitors can create a mise account on a `/register` page, so their meal-prep plans and AI chat history are tied to a persistent identity.

## API Contract

**Backend spec:** `meal-prep-api/specs/issue-1-backend.md`

| Method | Path | Used for |
|--------|------|----------|
| POST | `/auth/register` | Submit registration form; receive access token + refresh cookie |

## User Flows

### Happy path
1. User navigates to `/register` — `Register` page renders with all five fields empty.
2. User fills in first name, last name, email, password, and confirm password, then submits.
3. Page calls `POST /auth/register` with `{ firstName, lastName, email, password }`.
4. On 201, store `accessToken` from the response body in `localStorage` (key: `mise_access_token`). The refresh token is set automatically by the browser via `Set-Cookie`.
5. Navigate to `/`.

### Error states

| Trigger | UI response |
|---------|-------------|
| Field left blank on blur or submit | Inline error beneath the field: `"<Field> is required"` |
| Invalid email format (on blur / submit) | Inline error: `"Enter a valid email address"` |
| Password fewer than 8 characters (on blur / submit) | Inline error: `"Password must be at least 8 characters"` |
| Confirm password doesn't match (on blur / submit) | Inline error: `"Passwords do not match"` |
| Any validation error remains on submit | All remaining errors surface; request is not sent |
| API returns 409 | Dismissible banner above the form: `"This email is already in use."` with a `"Log in"` link pointing to `/login` |
| API returns 429 | Dismissible banner: `"Too many attempts. Please wait a moment and try again."` |
| API returns any other non-2xx | Dismissible banner: `"Something went wrong. Please try again."` |

## Components

| Component | New / Modified | Notes |
|-----------|---------------|-------|
| `src/pages/Register/Register.tsx` | New | Owns all state; calls the API; handles navigation |
| `src/components/RegisterForm/RegisterForm.tsx` | New | Purely presentational; receives data/errors/handlers via props |
| `src/components/RegisterForm/RegisterForm.types.ts` | New | `RegisterFormData` and `RegisterFormProps` type definitions |

### `RegisterFormData` shape

```ts
interface RegisterFormData {
  confirmPassword: string
  email: string
  firstName: string
  lastName: string
  password: string
}
```

### `Register` page state

| State | Type | Purpose |
|-------|------|---------|
| `data` | `RegisterFormData` | Controlled field values |
| `touched` | `Set<keyof RegisterFormData>` | Tracks which fields have been blurred or submitted |
| `banner` | `{ type: 'conflict' \| 'rate-limit' \| 'error' } \| null` | Controls the dismissible banner |
| `isSubmitting` | `boolean` | Disables the submit button while the request is in flight |

`errors` is derived via `useMemo(() => validate(data, touched), [data, touched])`, following the same pattern as `Create.tsx`.

### `validate()` rules (co-located in `Register.tsx`)

| Field | Rule | Message |
|-------|------|---------|
| `firstName` | Required (non-empty after trim) | `"First name is required"` |
| `lastName` | Required (non-empty after trim) | `"Last name is required"` |
| `email` | Required + valid email format | `"Email is required"` / `"Enter a valid email address"` |
| `password` | Required + min 8 characters | `"Password is required"` / `"Password must be at least 8 characters"` |
| `confirmPassword` | Must match `password` | `"Passwords do not match"` |

### Submit handler (`handleSubmit`)

1. Mark all five fields as touched.
2. Re-run `validate()`; if any errors exist, abort.
3. Set `isSubmitting = true`, clear any existing banner.
4. Call `POST /auth/register` with `{ firstName, lastName, email, password }`.
5. On 201: write `accessToken` to `localStorage`, then `navigate('/')`.
6. On 409: set `banner = { type: 'conflict' }`.
7. On 429: set `banner = { type: 'rate-limit' }`.
8. On any other error: set `banner = { type: 'error' }`.
9. Always set `isSubmitting = false` in `finally`.

## State Management

All state is local to the `Register` page component — no global store involvement. The access token is persisted to `localStorage` under the key `mise_access_token`.

## Routes

| Route | Guard | Notes |
|-------|-------|-------|
| `/register` | None | Add to `App.tsx` alongside existing routes |

## Accessibility

- Wrap the form in a `<form>` element; submit via the form's `onSubmit` (not a bare button `onClick`) so Enter-key submission works.
- Each input has an associated `<label>` (via `htmlFor` / `id` pairing).
- Inline error messages are linked to their input via `aria-describedby`; the input also has `aria-invalid="true"` when an error is present.
- The dismissible banner has `role="alert"` so screen readers announce it on appearance.
- The submit button renders `disabled` while `isSubmitting` is true; no separate loading indicator needed for v1.
- Password and confirm-password fields use `type="password"`.

## Open Questions

- None.
