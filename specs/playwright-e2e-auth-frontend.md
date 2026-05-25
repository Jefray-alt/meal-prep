# Frontend Spec — playwright-e2e-auth: Playwright E2E suite — auth critical happy paths

## Goal

A Playwright test suite that automatically verifies the four critical auth happy paths (register, login, logout, guest-route redirect) against a live backend, giving regression safety without manual testing.

## API Contract

No new endpoints. Tests exercise existing endpoints:

| Method | Path | Used for | Spec |
|--------|------|----------|------|
| `POST` | `/auth/register` | Create test user in registration flow and login pre-condition | `meal-prep-api/specs/issue-1-backend.md` |
| `POST` | `/auth/login` | Authenticate in login flow and pre-login setup | `meal-prep-api/specs/issue-2-backend.md` |
| `POST` | `/auth/logout` | Terminate session in logout flow | `meal-prep-api/specs/issue-3-backend.md` |

## User Flows

### Happy path 1 — Registration

1. Navigate to `/register`.
2. Fill all five fields with Faker-generated data; email uses the `@mise-e2e.test` domain.
3. Submit the form.
4. Assert: redirected to `/`.
5. Assert: `mise_access_token` present in `localStorage`.

### Happy path 2 — Login

1. Pre-condition (`beforeAll`): create a test user via `POST /auth/register` using Faker credentials.
2. Navigate to `/login`.
3. Fill email and password with the pre-created user's credentials.
4. Submit the form.
5. Assert: redirected to `/`.
6. Assert: `mise_access_token` present in `localStorage`.

### Happy path 3 — Logout

1. Pre-condition: call `POST /auth/login` via `request` fixture to get a valid token; set `mise_access_token` in `localStorage` via `page.evaluate()`.
2. Navigate to any page with the header visible (e.g. `/`).
3. Click the avatar button.
4. Click **Logout** in the dropdown.
5. Click **Confirm** in the logout modal.
6. Assert: redirected to `/login`.
7. Assert: `mise_access_token` absent from `localStorage`.

### Happy path 4 — Guest-route redirect

1. Pre-condition: set `mise_access_token` in `localStorage` via `page.evaluate()` (no real token needed — the guard only checks presence).
2. Navigate to `/login`.
3. Assert: URL resolves to `/`.

## Components

No new React components — this spec covers test infrastructure only.

| File | New / Modified | Notes |
|------|---------------|-------|
| `playwright.config.ts` | New | `baseURL` → Vite dev server; `testDir` → `./e2e`; `globalTeardown` wired |
| `e2e/auth.spec.ts` | New | All four happy-path tests; `beforeAll` block creates shared test user via API |
| `e2e/global-teardown.ts` | New | Opens TypeORM `DataSource`; deletes all `User` rows where `email LIKE '%@mise-e2e.test'`; closes connection |
| `e2e/helpers/api.ts` | New | Thin `fetch` helpers for test setup (register, login) — used in `beforeAll`, not Playwright page actions |

## State Management

**Test data strategy**

- All Faker-generated emails use the `@mise-e2e.test` domain so they are bulk-identifiable regardless of which test created them.
- `global-teardown.ts` runs once after the full suite and deletes every `User` with an email ending in `@mise-e2e.test` via a direct TypeORM `DataSource` connection.
- DB connection config is read from `process.env` using the same variables as the backend (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`). Source these from a `.env.test` file or inherit from the shell before running Playwright.

**Scaling to new domains**

As meals, preps, and other domains are added, append new entity cleanup blocks to `global-teardown.ts`. The teardown pattern (`DataSource` open → delete by test marker → close) stays the same — only the entity class changes.

## Routes

| Route | Tested by |
|-------|-----------|
| `/register` | Registration happy path |
| `/login` | Login happy path; guest-route redirect |
| `/` | Post-register and post-login redirect assertion |

## Accessibility

N/A — this spec covers test infrastructure, not UI.

## Tests

### Component tests

N/A

### E2E test cases (`e2e/auth.spec.ts`)

| Test | Pre-conditions | Steps | Pass condition |
|------|---------------|-------|----------------|
| Register — happy path | None | Navigate to `/register`, fill Faker form, submit | Redirected to `/`; `mise_access_token` in localStorage |
| Login — happy path | `beforeAll`: create user via `POST /auth/register` | Navigate to `/login`, fill credentials, submit | Redirected to `/`; `mise_access_token` in localStorage |
| Logout — confirm | `beforeAll` user; set token in localStorage via `page.evaluate()` | Navigate to `/`; avatar → Logout → Confirm | Redirected to `/login`; `mise_access_token` absent from localStorage |
| Guest route — redirect | Set `mise_access_token` via `page.evaluate()` | Navigate to `/login` | URL resolves to `/` |

### `playwright.config.ts` key settings

```ts
export default defineConfig({
  testDir: './e2e',
  globalTeardown: './e2e/global-teardown.ts',
  use: {
    baseURL: 'http://localhost:5173',
  },
});
```

### `global-teardown.ts` shape

```ts
// Connect, delete test rows, disconnect — add new entity blocks here as domains grow
export default async function globalTeardown() {
  const dataSource = new DataSource({ ...dbConfig, entities: [User] });
  await dataSource.initialize();
  await dataSource.getRepository(User).delete({ email: Like('%@mise-e2e.test') });
  await dataSource.destroy();
}
```

## Open Questions

- None.
