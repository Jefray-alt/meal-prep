# Frontend Spec — edit-meal-prep: Edit Meal Prep

## Goal
Users can edit any field of an existing meal prep from the detail page, with the form pre-filled with current values.

## API Contract

**Backend spec:** `meal-prep-api/specs/edit-meal-prep-backend.md`

| Method | Path | Used for |
|--------|------|----------|
| `GET` | `/meal-preps/:id` | Load existing data to pre-fill the form |
| `PATCH` | `/meal-preps/:id` | Persist the edited values |

## User Flows

### Happy path
1. User is on the detail page (`/meal-preps/:id`) and presses the Pencil (edit) button.
2. Browser navigates to `/meal-preps/:id/edit`; the page loads and fetches the meal prep, then pre-fills the form with existing values.
3. User edits one or more fields and presses **Save Meal Prep**.
4. On `200`, fire `addToast({ title: 'Meal prep saved', color: 'success' })`, then navigate back to `/meal-preps/:id`.

### Cancel
1. User presses **Cancel** (or the back arrow) → navigate back to `/meal-preps/:id` without saving.

### Error states
| Trigger | UI response |
|---------|-------------|
| `GET /meal-preps/:id` returns 404 | Show "Meal prep not found." message (same pattern as detail page) |
| `GET /meal-preps/:id` returns other error | Show "Something went wrong. Try refreshing." |
| `PATCH` returns error | Show inline server error message in the form footer (same `serverError` prop) |
| Validation failure on save attempt | Touch all validatable fields; show inline field errors; do not call API |

## Components

| Component | New / Modified | Notes |
|-----------|---------------|-------|
| `CreateForm` → `MealPrepForm` | **Renamed** | Same file, same props — only the component and file name change |
| `Create` page | Modified | Import `MealPrepForm` under new name; no logic changes |
| `Edit` page (`src/pages/Edit/Edit.tsx`) | **New** | Owns all state; fetches existing record; calls `PATCH`; navigates on success/cancel |
| `MealPrepDetail` | Modified | Pencil button `onPress` navigates to `/meal-preps/:id/edit` instead of `console.log` |
| `App.tsx` | Modified | Register new `/meal-preps/:id/edit` route inside `AuthRoute`; add `<ToastProvider>` wrapper |
| `main.tsx` | Modified | Wrap app with HeroUI `<ToastProvider>` (required for `addToast` to work) |

## State Management

All state is local to the `Edit` page, mirroring the `Create` page pattern:

- `status: 'loading' | 'not-found' | 'error' | 'success'` — tracks the initial `GET` fetch
- `data: MealPrepFormData` — controlled form values (same shape as `CreateFormData`)
- `selectedTags: Tag[]` — tag objects for the `TagCombobox` display
- `touched: Set<keyof MealPrepFormData>` — tracks blurred/submitted fields for validation
- `isSaving: boolean` — disables Save button during `PATCH` call
- `serverError: string | null` — surfaces API errors in the form footer

## Routes

| Route | Guard | Notes |
|-------|-------|-------|
| `/meal-preps/:id/edit` | `AuthRoute` | New route; `:id` passed to `useParams` in `Edit` page |

## Accessibility
- Page `<h1>` reads **"Edit Meal Prep"** (or the meal prep title once loaded).
- On load, focus moves to the Title field so keyboard users can begin editing immediately.
- The Pencil button in `MealPrepDetail` already has `aria-label={`Edit ${mealPrep.title}`}` — no change needed.
- Cancel and Save buttons retain their existing focus styles from `MealPrepForm`.

## Tests

### Component tests

| Component | Scenario | Expected behaviour |
|-----------|----------|--------------------|
| `Edit` page | Renders loading skeleton while fetching | `MealPrepDetailSkeleton` (or equivalent) is visible |
| `Edit` page | Successful fetch | Form fields are pre-filled with fetched values |
| `Edit` page | `GET` returns 404 | "Meal prep not found." message shown |
| `Edit` page | `GET` returns error | "Something went wrong." message shown |
| `Edit` page | Save with valid data | `PATCH` called with form values; `addToast` fired; navigates to `/meal-preps/:id` on 200 |
| `Edit` page | Save with invalid data | `PATCH` not called; field errors shown |
| `Edit` page | Cancel pressed | Navigates to `/meal-preps/:id` without calling `PATCH` |
| `Edit` page | `PATCH` returns error | `serverError` message shown; stays on page |
| `MealPrepForm` | (renamed from `CreateForm`) | Existing `CreateForm` tests pass after rename |

### E2E / integration tests

| Flow | Steps summary | Pass condition |
|------|--------------|----------------|
| Full edit flow | Log in → open detail → click edit → change title → save | Toast "Meal prep saved" appears; detail page shows new title |
| Cancel flow | Log in → open detail → click edit → change title → cancel | Detail page shows original title |
| Validation on save | Open edit → clear title → click save | Title error shown; no navigation |

## Open Questions
<!--
- None
-->
