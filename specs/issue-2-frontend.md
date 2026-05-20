# Frontend Spec — Issue #2: Add login page with guest-only route guard

## Goal

Let returning mise users authenticate and restore their session, with a guest-only guard that redirects already-logged-in users away from the login page.

## API Contract

**Backend spec:** `meal-prep-api/specs/issue-2-backend.md`

| Method | Path | Used for |
|--------|------|----------|
| POST | /auth/login | Submit email + password; receive `accessToken` + `user`; `refresh_token` cookie set by server |

## User Flows

### Happy path
1. User navigates to `/login`. `GuestRoute` checks `localStorage` for `mise_access_token` — not found, page renders.
2. User fills in email and password, optionally toggles password visibility.
3. User submits. Client validates on submit (all fields touched); if errors exist, blocks submission and shows inline errors.
4. `POST /auth/login` returns 200. Client stores `accessToken` in `localStorage` as `mise_access_token` and navigates to `/`.

### Already logged in
1. User navigates to `/login`. `GuestRoute` finds `mise_access_token` in `localStorage` and immediately redirects to `/`.

### Error states
| Trigger | UI response |
|---------|-------------|
| 401 Invalid credentials | Dismissible banner: "Invalid email or password." Password field retains its value. |
| 429 Rate limit | Dismissible banner: "Too many attempts. Please wait a moment and try again." |
| Any other failure / network error | Dismissible banner: "Something went wrong. Please try again." |
| Email empty or invalid format (client) | Inline field error below email input |
| Password empty (client) | Inline field error below password input |

## Components

| Component | New / Modified | Notes |
|-----------|---------------|-------|
| `src/components/LoginForm/LoginForm.tsx` | New | Purely presentational; mirrors `RegisterForm` structure |
| `src/components/LoginForm/LoginForm.types.ts` | New | Prop types for `LoginForm` |
| `src/pages/Login/Login.tsx` | New | Owns all state and validation; same pattern as `Register.tsx` |
| `src/components/GuestRoute/GuestRoute.tsx` | New | Checks `mise_access_token` in `localStorage`; renders children or redirects to `/` |
| `src/components/GuestRoute/GuestRoute.types.ts` | New | Prop types for `GuestRoute` |
| `src/App.tsx` | Modified | Add `/login` route wrapped in `<GuestRoute>` |

## State Management

All state lives in `Login.tsx` — no global store involved.

| State | Type | Purpose |
|-------|------|---------|
| `data` | `LoginFormData` | Controlled field values (`email`, `password`) |
| `touched` | `Set<keyof LoginFormData>` | Tracks which fields have been blurred or had submit attempted |
| `isSubmitting` | `boolean` | Disables form during in-flight request |
| `banner` | `null \| { type: 'invalid-credentials' \| 'rate-limit' \| 'error' }` | Controls dismissible error banner |
| `showPassword` | `boolean` | Toggles password field between `type="password"` and `type="text"` |

## Routes

| Route | Guard | Notes |
|-------|-------|-------|
| `/login` | `GuestRoute` | Redirects to `/` if `mise_access_token` present in `localStorage` |

`GuestRoute` is a reusable wrapper component — not tied to login alone — so future guest-only routes (e.g. `/forgot-password`) can use it without changes.

## Accessibility

- Password show/hide toggle: `aria-label` toggles between `"Show password"` and `"Hide password"`.
- Error banner: `role="alert"` so screen readers announce it on appearance.
- Inline field errors use `FieldError` from HeroUI (wired via `isInvalid` + `TextField`) — already handles `aria-describedby` linking.
- Form submit button is disabled (not hidden) while submitting, preserving focus position.
- "Don't have an account yet?" link is a standard anchor — keyboard-navigable by default.

## Tests

### Component tests

| Component | Scenario | Expected behaviour |
|-----------|----------|--------------------|
| `LoginForm` | Renders with empty data, no errors | Both fields visible, button enabled |
| `LoginForm` | `errors.email` provided | Email `FieldError` visible with correct message |
| `LoginForm` | `errors.password` provided | Password `FieldError` visible |
| `LoginForm` | `banner.type === 'invalid-credentials'` | Banner renders correct message |
| `LoginForm` | `banner.type === 'rate-limit'` | Banner renders rate-limit message |
| `LoginForm` | `isSubmitting === true` | Submit button is disabled |
| `LoginForm` | Show/hide toggle clicked | Password input `type` toggles |
| `LoginForm` | "Don't have an account yet?" link | Links to `/register` |
| `GuestRoute` | `mise_access_token` absent | Renders children |
| `GuestRoute` | `mise_access_token` present | Renders `<Navigate to="/" />` |

### E2E / integration tests

| Flow | Steps summary | Pass condition |
|------|--------------|----------------|
| Successful login | Fill valid credentials, submit | Token stored in `localStorage`, redirected to `/` |
| Invalid credentials | Fill wrong password, submit | 401 banner shown, password field not cleared |
| Client validation | Submit empty form | Inline errors on both fields, no network request |
| Guest guard — logged in | Set `mise_access_token` in storage, navigate to `/login` | Immediately redirected to `/` |

## Open Questions

- [ ] None — all decisions resolved.
