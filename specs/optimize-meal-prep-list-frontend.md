# Frontend Spec — optimize-meal-prep-list: Consume Slim GET /meal-preps Response

## Goal

Update the list page and card component to use the new slim API response shape, replacing the full `tags` array with `firstTag` and `tagCount`.

## API Contract

**Backend spec:** `meal-prep-api/specs/optimize-meal-prep-list-backend.md`

| Method | Path | Used for |
|--------|------|----------|
| GET | `/meal-preps` | Load paginated meal prep list |

## User Flows

### Happy path
1. User navigates to `/meal-preps` — page fetches the slim list response.
2. Each card renders the title, first tag name (if present), overflow count badge (if `tagCount > 1`), and macros — visually identical to today.
3. User clicks "Load more" — subsequent pages append correctly using the unchanged cursor logic.

### Error states
| Trigger | UI response |
|---------|-------------|
| API returns non-2xx | Existing error message displayed (no change) |

## Components

| Component | New / Modified | Notes |
|-----------|---------------|-------|
| `MealPrepCard.types.ts` | Modified | Replace `tags: { id: string; name: string }[]` with `firstTag: { id: string; name: string } \| null` and `tagCount: number` |
| `MealPrepCard.tsx` | Modified | Use `firstTag` and `tagCount` instead of `tags[0]` / `tags.length` |
| `MealPreps.tsx` | No change | `ListResponse` shape uses `MealPrepSummary[]`; no structural change needed |

## State Management

No change — the same `mealPreps: MealPrepSummary[]` state slice, updated `MealPrepSummary` type.

## Routes

No change.

| Route | Guard | Notes |
|-------|-------|-------|
| `/meal-preps` | Auth | Unchanged |

## Accessibility

No change — the card markup and ARIA attributes are unaffected.

## Tests

### Component tests

| Component | Scenario | Expected behaviour |
|-----------|----------|--------------------|
| `MealPrepCard` | `firstTag` is provided, `tagCount` is 1 | Renders tag name pill, no overflow badge |
| `MealPrepCard` | `firstTag` is provided, `tagCount` is 3 | Renders tag name pill and `+2` overflow badge |
| `MealPrepCard` | `firstTag` is `null`, `tagCount` is 0 | No tag pills rendered |
| `MealPrepCard` | All macros null | Macro section not rendered |

### E2E / integration tests

| Flow | Steps summary | Pass condition |
|------|--------------|----------------|
| List page renders tags | Load list page with seeded meal preps | First tag name visible on card; overflow count correct |

## Open Questions

None.
