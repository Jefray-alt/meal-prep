# Frontend Spec — Issue #3: Persist and revoke refresh tokens

## Goal

Users stay seamlessly logged in across the 15-minute access token window without re-entering credentials, and are immediately returned to the login screen when their session is revoked or compromised.

## API Contract

**Backend spec:** `meal-prep-api/specs/issue-3-backend.md`

| Method | Path | Used for |
|--------|------|----------|
| `POST` | `/auth/refresh` | Silently obtain a new access token when a request returns 401 |
| `POST` | `/auth/logout` | Terminate the session server-side and clear the cookie |

## User Flows

### Happy path — silent token refresh
1. User performs any authenticated action (e.g. loads a page, submits a form).
2. The access token has expired; the server returns 401.
3. `apiFetch` automatically calls `POST /auth/refresh` in the background.
4. Refresh succeeds — a new access token is returned and stored.
5. `apiFetch` retries the original request with the new token.
6. The user sees no interruption; the action completes normally.

### Happy path — logout
1. User clicks the logout button.
2. `apiFetch` calls `POST /auth/logout`.
3. Server clears the refresh token cookie and nullifies the stored hash.
4. Client removes the access token from `localStorage`.
5. User is redirected to `/login`.

### Error state — refresh fails (expired or revoked session)
1. User performs any authenticated action; server returns 401.
2. `apiFetch` calls `POST /auth/refresh`; server returns 401 (token expired, replayed, or revoked).
3. Client removes the access token from `localStorage`.
4. User is redirected to `/login` with no error toast (session expiry is expected behaviour).

### Error state — replay detected mid-session
1. A compromised refresh token is used by an attacker; the server detects replay and nullifies the session.
2. The legitimate user's next request returns 401.
3. `apiFetch` attempts refresh; server returns 401 (hash cleared).
4. User is redirected to `/login` — same flow as normal session expiry from the user's perspective.

## Components

| Component | New / Modified | Notes |
|-----------|---------------|-------|
| `src/lib/apiFetch.ts` | **New** | Thin wrapper around native `fetch`; handles 401 → refresh → retry logic and logout redirect |
| All existing pages / components using `fetch` | **Modified** | Replace every bare `fetch(...)` call with `apiFetch(...)` — no bare `fetch` must remain in the codebase |
| Logout button / nav element | **Modified or New** | Calls `apiFetch('/auth/logout', { method: 'POST' })` then redirects to `/login`; location TBD based on existing nav structure |

## `apiFetch` Behaviour

`apiFetch` is a drop-in replacement for `fetch` with the same signature (`url`, `init`):

1. Attach the current access token as `Authorization: Bearer <token>` if one exists in `localStorage`.
2. Call native `fetch` with the provided arguments.
3. If the response status is **not 401**, return the response as-is.
4. If the response status **is 401** and a refresh has not already been attempted for this call:
   a. Call `POST /auth/refresh` (no body; cookie is sent automatically).
   b. If refresh returns 200: write the new `accessToken` from the response body to `localStorage`, then retry the original request once with the new token.
   c. If refresh returns any non-200 status: remove the access token from `localStorage` and redirect to `/login`.
5. If the response is still 401 after the retry, remove the access token from `localStorage` and redirect to `/login`.

**No retry loop** — one refresh attempt per original request maximum.

## State Management

| State | Location | Notes |
|-------|----------|-------|
| `accessToken` | `localStorage` key `access_token` | Persisted across page reloads — written on login and refresh, removed on logout or session expiry |
| Refresh-in-progress flag | Module-level boolean in `apiFetch.ts` | Prevents concurrent refresh races — queue concurrent 401s and replay all after the single refresh resolves |

## Routes

| Route | Guard | Notes |
|-------|-------|-------|
| `/login` | None (public) | Redirect target after session expiry or logout |
| All authenticated routes | Implicit via `apiFetch` 401 handling | No route-level guard changes required |

## Accessibility

- The logout button must be keyboard-focusable and activated with Enter/Space (use HeroUI `Button` — not a bare `<button>`).
- Redirect to `/login` on session expiry must not trap focus; React Router's navigation handles this naturally.
- No loading spinner is needed for the silent refresh — the user should not perceive the retry.

## Tests

### Component tests

| Component | Scenario | Expected behaviour |
|-----------|----------|--------------------|
| `apiFetch` | Request succeeds (200) | Returns response, no refresh attempt |
| `apiFetch` | Request returns 401, refresh succeeds | Retries original request with new token; returns final response |
| `apiFetch` | Request returns 401, refresh fails (401) | Clears token, redirects to `/login` |
| `apiFetch` | Two concurrent 401s | Issues only one refresh call; both original requests are retried after |
| `apiFetch` | Request returns 401, no retry loop | Refresh is attempted exactly once |
| Logout action | Called successfully | Clears token, redirects to `/login` |
| Logout action | Server returns non-200 | Still clears token and redirects to `/login` |

### E2E / integration tests

| Flow | Steps summary | Pass condition |
|------|--------------|----------------|
| Silent refresh | Log in, wait for access token expiry, trigger an authenticated request | Request succeeds transparently; user stays on current page |
| Session expiry redirect | Revoke refresh token server-side, trigger any authenticated request | User lands on `/login` |
| Logout | Click logout button | Server session cleared; user on `/login`; subsequent authenticated requests return 401 |

## Open Questions

<!-- None at spec time -->
