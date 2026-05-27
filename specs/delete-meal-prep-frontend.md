# Frontend Spec — delete-meal-prep: Delete Meal Prep

## Goal
Let users permanently delete a meal prep plan from its detail page, with a confirmation modal that lists which tags may also be removed.

## API Contract

**Backend spec:** `meal-prep-api/specs/delete-meal-prep-backend.md`

| Method | Path | Used for |
|--------|------|----------|
| DELETE | `/meal-preps/:id` | Permanently delete the meal prep on user confirmation |

## User Flows

### Happy path
1. User is on `/meal-preps/:id` (detail page) and clicks the **Delete** button.
2. A confirmation modal opens showing: the meal prep title and a list of all tags on it, with a note that tags not used on any other meal prep will be permanently deleted.
3. User clicks **Delete** in the modal. The button enters a loading state; the modal stays open.
4. On 204 response, the modal closes and the router navigates to `/meal-preps`.

### Cancel / dismiss
1. User opens the confirmation modal.
2. User clicks **Cancel** or presses `Escape` — modal closes, no request is made, page stays as-is.

### Error states
| Trigger | UI response |
|---------|-------------|
| API returns 404 | Modal closes; navigate to `/meal-preps` (the meal prep is gone or was never theirs) |
| Network / 5xx error | Error message shown inside the modal ("Something went wrong. Try again."); confirm button re-enabled |
| Request in-flight | Confirm button shows spinner and is disabled; cancel button is also disabled |

## Components

| Component | New / Modified | Notes |
|-----------|---------------|-------|
| `MealPrepDetail` (page) | Modified | `src/pages/MealPrepDetail/MealPrepDetail.tsx` — wire up the existing placeholder Delete button to open the modal |
| `DeleteMealPrepModal` | New | `src/components/DeleteMealPrepModal/DeleteMealPrepModal.tsx` — confirmation modal |

### `DeleteMealPrepModal` props
```ts
interface DeleteMealPrepModalProps {
  isOpen: boolean;
  mealPrepTitle: string;
  tags: { id: string; name: string }[];
  onConfirm: () => void;       // called when user clicks Delete
  onClose: () => void;
  isLoading: boolean;
  error: string | null;
}
```

### Modal content
- Heading: "Delete [title]?"
- Body: "This action cannot be undone."
- If `tags.length > 0`: tag list with a note — "The following tags will be permanently removed if they are not used on any other meal prep:" followed by the tag names rendered as pills (matching the existing ember-tinted tag style).
- If `tags.length === 0`: no tag section shown.
- Actions: **Cancel** (HeroUI `Button` variant `ghost`) and **Delete** (HeroUI `Button` `color="danger"`), both `rounded-lg h-auto`.

## State Management

Add to `MealPrepDetail` local state:
- `isDeleteModalOpen: boolean` — controls modal visibility
- `deleteStatus: 'idle' | 'pending' | 'error'` — tracks the in-flight delete request

On Delete button click: set `isDeleteModalOpen = true`.
On modal confirm: set `deleteStatus = 'pending'`, call `DELETE /meal-preps/:id`.
- Success → navigate to `/meal-preps`
- Error → set `deleteStatus = 'error'`

On modal close: set `isDeleteModalOpen = false`, reset `deleteStatus = 'idle'`.

## Routes

No new routes. Navigates to `/meal-preps` after successful deletion.

| Route | Guard | Notes |
|-------|-------|-------|
| `/meal-preps/:id` | `AuthRoute` | Existing route — no change |

## Accessibility

- Modal uses `role="dialog"` and `aria-modal="true"`.
- Modal heading (`h2`) is referenced by `aria-labelledby` on the dialog.
- On open, focus moves to the modal's first focusable element (Cancel button).
- `Escape` key closes the modal (handled by HeroUI Modal).
- Delete confirm button has `aria-label="Confirm delete [title]"` once title is loaded.

## Tests

### Component tests

| Component | Scenario | Expected behaviour |
|-----------|----------|--------------------|
| `DeleteMealPrepModal` | `isOpen=false` | Modal not in the DOM |
| `DeleteMealPrepModal` | `isOpen=true`, tags present | Renders title, tag list with note, Cancel + Delete buttons |
| `DeleteMealPrepModal` | `isOpen=true`, no tags | Renders title, no tag section |
| `DeleteMealPrepModal` | `isLoading=true` | Delete button shows spinner and is disabled; Cancel disabled |
| `DeleteMealPrepModal` | `error` set | Error message visible; Delete button re-enabled |
| `DeleteMealPrepModal` | Cancel clicked | Calls `onClose` |
| `DeleteMealPrepModal` | Delete clicked | Calls `onConfirm` |
| `MealPrepDetail` | Delete button clicked | Opens `DeleteMealPrepModal` |
| `MealPrepDetail` | Modal confirmed, API succeeds | Navigates to `/meal-preps` |
| `MealPrepDetail` | Modal confirmed, API fails | Error shown inside modal; stays open |
| `MealPrepDetail` | Modal dismissed | Modal closes; no navigation |

### E2E / integration tests

| Flow | Steps summary | Pass condition |
|------|--------------|----------------|
| Delete meal prep | Log in → open detail page → click Delete → confirm in modal | Redirected to `/meal-preps`; deleted item no longer in list |
| Cancel deletion | Log in → open detail page → click Delete → click Cancel | Modal closes; still on detail page |
| Delete with orphaned tag | Meal prep is the only user of a tag → delete it | Tag no longer appears on any other meal prep |

## Open Questions
<!-- None -->
