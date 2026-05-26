# Frontend Spec — create-meal-prep: Save Meal Prep & Reusable User Tags

## Goal

Users can submit the Create form to save a meal prep to their account, see and reuse their existing tags as suggestions, and the "Create yourself" entry point is hidden from logged-out visitors.

## API Contract

**Backend spec:** `meal-prep-api/specs/create-meal-prep-backend.md`

| Method | Path | Used for |
|--------|------|----------|
| `GET` | `/tags` | Fetch user's existing tags on Create page mount |
| `POST` | `/meal-preps` | Submit the Create form |

## User Flows

### Happy path
1. Authenticated user navigates to `/create` — the page renders and immediately begins fetching their existing tags.
2. While tags load, `TagPills` displays a brief loading message ("Loading tags…") in place of the suggestions row.
3. Once loaded, existing tags appear as clickable suggestion chips above the tag input; clicking one adds it to the form's selected tags.
4. User fills in title, macros, instructions, and ingredients, selects or types tags, then presses **Save Meal Prep**.
5. The button enters a saving state (disabled, label changes to "Saving…").
6. On `201`, the user is navigated to `/meal-preps`.

### Unauthenticated user
1. User visits `/` — the "Create yourself" button in `InputDock` is not rendered.
2. User navigates directly to `/create` — the auth guard redirects them to `/login`.

### Error states
| Trigger | UI response |
|---------|-------------|
| `GET /tags` returns non-2xx or network error | Loading message replaced with "Couldn't load tags" in the suggestions area; form remains usable, user can still type new tags |
| `POST /meal-preps` returns non-2xx | Saving state cleared; inline error message shown below the form actions row |
| `POST /meal-preps` returns 401 | `apiFetch` token-refresh logic handles retry; if refresh fails, user is redirected to `/login` by `apiFetch` |
| Client-side validation fails on Save | Touched fields mark all validatable fields; existing validation error messages appear; no API call made |

## Components

| Component | New / Modified | Notes |
|-----------|---------------|-------|
| `InputDock` | Modified | Accept optional `isAuthenticated: boolean` prop; render "Create yourself" button only when `true` |
| `InputDock.types.ts` | Modified | Add `isAuthenticated?: boolean` to `InputDockProps` |
| `TagPills` | Modified | Accept `isLoadingTags?: boolean` and `existingTags?: string[]` props; render loading message and suggestion chips |
| `TagPills.types.ts` | Modified | Add `isLoadingTags?: boolean` and `existingTags?: string[]` to `TagPillsProps` |
| `Create.tsx` | Modified | Own `isLoadingTags`, `existingTags`, `isSaving`, `serverError` state; fetch `GET /tags` on mount; call `POST /meal-preps` in `handleSave` |
| `Home.tsx` | Modified | Read token from `localStorage` to derive `isAuthenticated`; pass to `InputDock` |
| `App.tsx` | Modified | Wrap `/create` route in an auth guard (redirect to `/login` if no token) |
| `AuthRoute` | New | Mirror of `GuestRoute` — redirects to `/login` when no token; wraps protected pages |

## State Management

All state lives in `Create.tsx` (page owns state, components are presentational — per project architecture):

| State field | Type | Initial value | Notes |
|-------------|------|---------------|-------|
| `isLoadingTags` | `boolean` | `true` | Set to `false` after `GET /tags` resolves or errors |
| `existingTags` | `string[]` | `[]` | Populated from `GET /tags` response |
| `isSaving` | `boolean` | `false` | Set `true` while `POST /meal-preps` is in-flight |
| `serverError` | `string \| null` | `null` | Set on `POST /meal-preps` non-2xx response |

`Home.tsx` reads `localStorage.getItem(TOKEN_KEY)` at render time to derive `isAuthenticated` — no new global state needed.

## Routes

| Route | Guard | Notes |
|-------|-------|-------|
| `/create` | `AuthRoute` (redirect to `/login`) | Currently unguarded; wrap in `App.tsx` |
| `/login` | `GuestRoute` (existing) | No change |
| `/` | None | `isAuthenticated` derived locally in `Home.tsx` to conditionally render the button |

## Accessibility

- "Create yourself" button removal must not leave keyboard focus orphaned — no special handling needed since the button disappears before the user tab-focuses it (it is simply not rendered).
- Suggestion chips in `TagPills` must be keyboard-activatable (`onKeyDown` Enter/Space → add tag).
- Loading message in `TagPills` should use `role="status"` so screen readers announce it without requiring focus.
- Save button disabled state must have `aria-disabled="true"` (HeroUI `isDisabled` handles this).
- Server error message should use `role="alert"` so it is announced immediately on appearance.

## Tests

### Component tests

| Component | Scenario | Expected behaviour |
|-----------|----------|--------------------|
| `InputDock` | `isAuthenticated={false}` | "Create yourself" button not in DOM |
| `InputDock` | `isAuthenticated={true}` | "Create yourself" button rendered and pressable |
| `TagPills` | `isLoadingTags={true}` | Renders "Loading tags…" message; no suggestion chips |
| `TagPills` | `isLoadingTags={false}`, `existingTags={['keto','bulk']}` | Two suggestion chips rendered; clicking one calls `onChange` with tag added |
| `TagPills` | `existingTags` chip already in `value` | Chip is not rendered in suggestions (already selected) |
| `AuthRoute` | No token in localStorage | Renders `<Navigate to="/login" />` |
| `AuthRoute` | Token present | Renders children |
| `Create` | Mount — tags load successfully | `isLoadingTags` transitions false; `existingTags` passed to `TagPills` |
| `Create` | Mount — tags fetch fails | `isLoadingTags` false; `TagPills` receives empty `existingTags` |
| `Create` | `handleSave` — valid form | Calls `POST /meal-preps`; navigates to `/meal-preps` on success |
| `Create` | `handleSave` — API error | `serverError` set; no navigation |

### E2E / integration tests

| Flow | Steps summary | Pass condition |
|------|--------------|----------------|
| Logged-out home | Visit `/`, inspect dock | "Create yourself" button absent |
| Logged-out redirect | Visit `/create` directly | Redirected to `/login` |
| Create meal prep | Login → navigate to `/create` → wait for suggestions → fill form → save | Redirected to `/meal-preps`; no console errors |
| Tag reuse | Create two meal preps with tag "bulk" | `GET /tags` returns "bulk" once; suggestion chip shown on second visit |

## Open Questions

<!-- None -->
