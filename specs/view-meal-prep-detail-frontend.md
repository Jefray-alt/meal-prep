# Frontend Spec — view-meal-prep-detail: View Meal Prep Detail

## Goal
Give users a dedicated page to read the full content of a single meal prep and access placeholder Edit and Delete actions.

## API Contract

**Backend spec:** `meal-prep-api/specs/view-meal-prep-detail-backend.md`

| Method | Path | Used for |
|--------|------|----------|
| GET | `/meal-preps/:id` | Fetch full meal prep detail on page mount |

## User Flows

### Happy path
1. User clicks a `MealPrepCard` on `/meal-preps` — React Router navigates to `/meal-preps/:id`.
2. Page mounts and fires `GET /meal-preps/:id`; a skeleton loader is shown during the request.
3. On success, the page renders: title, tags, macros (protein / carbs / fat), ingredients list, and instructions.
4. Two buttons — **Edit** and **Delete** — are visible but non-functional (placeholders).
5. A back link returns the user to `/meal-preps`.

### Error states
| Trigger | UI response |
|---------|-------------|
| API returns 404 | "Meal prep not found" message with a back link to `/meal-preps` |
| Network/server error | "Something went wrong. Try refreshing." message |
| Loading | Full-page skeleton matching the page layout |

## Components

| Component | New / Modified | Notes |
|-----------|---------------|-------|
| `MealPrepDetail` (page) | New | `src/pages/MealPrepDetail/MealPrepDetail.tsx` — owns all state |
| `MealPrepDetailSkeleton` | New | `src/components/MealPrepDetailSkeleton/MealPrepDetailSkeleton.tsx` — mirrors page layout |

## State Management
All state is local to `MealPrepDetail`:
- `status: 'loading' | 'success' | 'error' | 'not-found'`
- `mealPrep: MealPrepDetail | null` — full detail shape from API

## Routes

| Route | Guard | Notes |
|-------|-------|-------|
| `/meal-preps/:id` | `AuthRoute` | New route added to `App.tsx`; `MealPrepCard` already links here |

## Design

Follows the existing page design language:
- Dark `bg-char` background with grain overlay and ember/moss radial glows.
- `var(--font-display)` italic for the title.
- Tags: ember-tinted pills (`bg-ember/10 border-ember/25 text-ember/65`) with a `#` prefix — warm, category feel.
- Macros: rectangular chips (`rounded-lg bg-smoke/8`) with a large number and small label side-by-side — data-stat feel, visually distinct from tags.
- Ingredients rendered as a simple list; instructions in a `<pre>`-style block or plain text paragraph.
- **Edit** button: HeroUI `<Button variant="flat">` with `rounded-full border border-smoke/30 bg-smoke/10` — fires `console.log('edit')` as placeholder.
- **Delete** button: HeroUI `<Button variant="flat">` with `rounded-full border border-red-500/35 bg-red-500/10 text-red-400` — fires `console.log('delete')` as placeholder.
- Both buttons sit in a sticky or fixed action bar at the bottom of the page, or grouped in the header area beside the title.

## Accessibility
- Page title region uses `<h1>` with display font.
- Skeleton uses `aria-busy="true"` and `aria-label="Loading meal prep"`.
- Error messages use `role="alert"`.
- Edit and Delete buttons have descriptive `aria-label` values referencing the meal prep title once loaded.

## Tests

### Component tests

| Component | Scenario | Expected behaviour |
|-----------|----------|--------------------|
| `MealPrepDetail` | Loading state | Renders `MealPrepDetailSkeleton` |
| `MealPrepDetail` | Success state | Renders title, macros, ingredients, instructions, Edit + Delete buttons |
| `MealPrepDetail` | 404 from API | Renders not-found message with back link |
| `MealPrepDetail` | Network error | Renders error message |
| `MealPrepDetail` | Edit button pressed | Calls placeholder handler (no navigation) |
| `MealPrepDetail` | Delete button pressed | Calls placeholder handler (no navigation) |

### E2E / integration tests

| Flow | Steps summary | Pass condition |
|------|--------------|----------------|
| View own meal prep | Log in → `/meal-preps` → click card → detail page loads | Title and macros visible |
| Unauthenticated access | Navigate to `/meal-preps/:id` without token | Redirected to `/login` |

## Open Questions
<!-- None -->
