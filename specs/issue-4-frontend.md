# Frontend Spec — Issue #4: Add auth-aware header with login button, avatar dropdown, and logout confirmation

## Goal

The header reflects the user's actual session state — guests see a Login button and no authenticated controls; logged-in users see an avatar that opens account actions, with a confirmation step before logout.

## API Contract

**Backend spec:** No backend spec for this issue — `POST /auth/logout` is an existing, already-implemented endpoint.
See: `meal-prep-api/src/auth/auth.controller.ts`

| Method | Path | Used for |
|--------|------|----------|
| `POST` | `/auth/logout` | Invalidate the server-side session and clear the refresh cookie on logout confirm |

## User Flows

### Guest visits the app

1. User arrives on any page with a header.
2. Header reads `localStorage` for `mise_access_token` — token absent.
3. Header renders: logo + Login button only. "My Preps" and "Sign out" are not shown.
4. User clicks Login → navigated to `/login`.

### Logged-in user opens avatar dropdown

1. User is authenticated (token present in `localStorage`).
2. Header renders: logo + "My Preps" link + generic avatar button. Login button is not shown.
3. User clicks avatar → dropdown opens anchored to the avatar.
4. Dropdown shows two items: **Profile** and **Logout**.
5. User clicks **Profile** → no action (placeholder).
6. User clicks elsewhere → dropdown closes.

### Logged-in user logs out

1. User clicks avatar → dropdown opens.
2. User clicks **Logout** → dropdown closes, logout confirmation modal opens.
3. Modal asks: "Are you sure you want to log out?" with **Confirm** and **Cancel** buttons.
4. User clicks **Confirm** → `POST /auth/logout` is called, `mise_access_token` is removed from `localStorage`, user is redirected to `/login`.
5. User clicks **Cancel** → modal closes, user remains on the current page, session intact.

### Error states

| Trigger | UI response |
|---------|-------------|
| `POST /auth/logout` network error | Silently remove the local token and redirect to `/login` anyway — the session is considered ended from the user's perspective |

## Components

| Component | New / Modified | Notes |
|-----------|---------------|-------|
| `Header` | Modified | Remove "KITCHEN INTELLIGENCE" text; read `localStorage` to determine auth state; conditionally render Login button or `UserMenu` + "My Preps" |
| `UserMenu` | New | Avatar button that opens a HeroUI `Dropdown` with Profile and Logout items; receives an `onLogout` callback |
| `LogoutConfirmModal` | New | HeroUI `Modal` with a confirm/cancel action; receives `isOpen`, `onConfirm`, and `onCancel` props |

## State Management

All state is local to `Header` (the page-level owner of the header in this app's pattern):

| State | Type | Purpose |
|-------|------|---------|
| `isAuthenticated` | `boolean` | Derived once on render via `localStorage.getItem(TOKEN_KEY)` — no context needed; auth changes are always accompanied by a navigation event that re-renders the header |
| `isDropdownOpen` | `boolean` | Controls `UserMenu` dropdown visibility |
| `isLogoutModalOpen` | `boolean` | Controls `LogoutConfirmModal` visibility |
| `isLoggingOut` | `boolean` | Disables Confirm button while the logout request is in flight |

## Routes

| Route | Guard | Notes |
|-------|-------|-------|
| `/login` | `GuestRoute` (existing) | Login button navigates here |
| `/profile` | None (for now) | Profile item may link here as a stub; no page implementation required in this issue |

## Accessibility

- Avatar button must have an `aria-label` (e.g., "Account menu").
- Dropdown must trap focus while open and close on `Escape`.
- Modal must trap focus, label itself with the confirmation question, and return focus to the avatar button on close.
- Login button must be a focusable, keyboard-activatable control (HeroUI `Button` satisfies this).

## Tests

### Component tests

| Component | Scenario | Expected behaviour |
|-----------|----------|--------------------|
| `Header` | No token in localStorage | Renders Login button; does not render avatar, "My Preps", or "Sign out" |
| `Header` | Token present in localStorage | Renders avatar and "My Preps"; does not render Login button |
| `Header` | "KITCHEN INTELLIGENCE" text | Not present in the DOM regardless of auth state |
| `UserMenu` | Avatar clicked | Dropdown opens |
| `UserMenu` | Logout clicked | `onLogout` callback is called |
| `LogoutConfirmModal` | Confirm clicked | `onConfirm` callback is called |
| `LogoutConfirmModal` | Cancel clicked | `onCancel` callback is called |

### E2E / integration tests

| Flow | Steps summary | Pass condition |
|------|--------------|----------------|
| Guest header | Load app without token | Login button visible; avatar and "My Preps" absent |
| Authenticated header | Load app with valid token | Avatar and "My Preps" visible; Login button absent |
| Logout — confirm | Click avatar → Logout → Confirm | Redirected to `/login`; token removed from localStorage |
| Logout — cancel | Click avatar → Logout → Cancel | Remain on current page; token still in localStorage |

## Open Questions

_(None.)_
