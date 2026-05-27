# Frontend Spec — meal-prep-list: List User Meal Preps

## Goal

Replace the ghost-card placeholder on `/meal-preps` with real, clickable cards showing each saved meal prep's title, tags, and any available macros.

## API Contract

**Backend spec:** `meal-prep-api/specs/meal-prep-list-backend.md`

| Method | Path | Used for |
|--------|------|----------|
| GET | `/meal-preps?limit=20` | Fetch first page on mount |
| GET | `/meal-preps?limit=20&cursor=<id>` | Fetch subsequent pages when user loads more |

## User Flows

### Happy path
1. Authenticated user navigates to `/meal-preps`.
2. Page fetches `GET /meal-preps?limit=20`; 3 skeleton cards fill the grid while waiting.
3. Response returns `{ data, nextCursor }` — skeletons are replaced by real `MealPrepCard` components.
4. Each card shows: title, tag pills, and a macro row for whichever of protein/carbs/fat are non-null.
5. If `nextCursor` is non-null, a "Load more" button appears below the grid.
6. User clicks "Load more" — fetches `GET /meal-preps?limit=20&cursor=<nextCursor>`; new cards are appended to the grid; button updates or disappears when `nextCursor` is `null`.
7. User clicks a card — navigates to `/meal-preps/:id` (detail page, future work).

### Empty state
1. `GET /meal-preps` returns `{ data: [], nextCursor: null }`.
2. Ghost card grid is hidden; existing "Nothing prepared yet" overlay is shown with the "Back to kitchen" link.

### Error states
| Trigger | UI response |
|---------|-------------|
| Network / API error (non-401) | Show an inline error message ("Couldn't load your meal preps. Try refreshing.") in place of the card grid |
| 401 Unauthorized | `AuthRoute` guard redirects to `/login` before the fetch can fail |

## Components

| Component | New / Modified | Notes |
|-----------|---------------|-------|
| `MealPreps` (page) | Modified | Owns fetch state (loading, loadingMore, error, items, nextCursor); conditionally renders grid, empty state, or error; appends pages on "Load more" |
| `MealPrepCard` | New | Presentational; receives a single meal prep object as props |
| `MealPrepCardSkeleton` | New | Matches `MealPrepCard` dimensions; uses animated shimmer placeholders for title, tag pill, and macro row |

### `MealPrepCard` design

Extend the existing ghost card structure (`rounded-xl border border-smoke/15 bg-ash/50 p-6`):

- **Header row:** title (text-bark, font-display italic) on the left; tag pills on the right (existing ghost pill style: `rounded-full border border-smoke/20 px-2 py-0.5 text-[9px] tracking-[0.15em] text-smoke/50 uppercase`)
- **Tag display:** show the first tag pill; if there are additional tags, show a single `+N` pill next to it (e.g. `+2`) — never render more than two pills
- **Macro row (footer):** only rendered when at least one macro is non-null — shows `${value}g protein`, `${value}g carbs`, `${value}g fat` as small pill-style spans, skipping any null values
- **Hover state:** subtle lift / border brightening (`hover:border-smoke/30 transition-all duration-200`) to signal clickability
- The entire card is wrapped in a `<Link to={/meal-preps/${id}}>` — no separate button needed

## State Management

All state is local to the `MealPreps` page component:

```ts
const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')
const [loadingMore, setLoadingMore] = useState(false)
const [mealPreps, setMealPreps] = useState<MealPrepSummary[]>([])
const [nextCursor, setNextCursor] = useState<string | null>(null)
```

- `status: 'loading'` — initial fetch in flight; show skeleton cards
- `loadingMore: true` — subsequent page fetch in flight; show a small spinner on the "Load more" button, keep existing cards visible
- On each successful fetch, append `data` to `mealPreps` and update `nextCursor`
- "Load more" button is visible only when `nextCursor` is non-null and `status === 'success'`

`MealPrepSummary` type (inferred from API response):
```ts
interface MealPrepSummary {
  id: string
  title: string
  tags: { id: string; name: string }[]
  protein: number | null
  carbs: number | null
  fat: number | null
}
```

## Routes

| Route | Guard | Notes |
|-------|-------|-------|
| `/meal-preps` | `AuthRoute` | Already exists; no change to routing config |
| `/meal-preps/:id` | `AuthRoute` | Link target only — detail page is out of scope for this issue |

## Accessibility

- Each `MealPrepCard` is a `<Link>` element — natively keyboard-focusable and screen-reader announced as a link.
- Card `aria-label` should include the meal prep title: `aria-label={`View ${title}`}`.
- During loading, render 3 `MealPrepCardSkeleton` components in the grid (same layout as real cards) with `aria-busy="true"` on the grid container and `aria-label="Loading meal preps"`. The skeleton cards use a pulse animation (`animate-pulse`) on their placeholder blocks.

## Tests

### Component tests

| Component | Scenario | Expected behaviour |
|-----------|----------|--------------------|
| `MealPrepCard` | All macros present | Renders title, tag pill, and all three macro values |
| `MealPrepCard` | Some macros null | Renders only non-null macro values; null macros absent from DOM |
| `MealPrepCard` | No macros | Macro row not rendered |
| `MealPrepCard` | Multiple tags | First tag pill shown; `+N` overflow pill shown for the rest |
| `MealPrepCard` | Single tag | First tag pill shown; no overflow pill |
| `MealPreps` | API returns items with `nextCursor` | Renders cards and "Load more" button |
| `MealPreps` | API returns items, `nextCursor` null | Renders cards, no "Load more" button |
| `MealPreps` | API returns `{ data: [], nextCursor: null }` | Renders empty state, no cards |
| `MealPreps` | API errors | Renders error message, no cards |
| `MealPreps` | "Load more" clicked | Appends next page of cards; hides button when `nextCursor` becomes null |

### E2E / integration tests

| Flow | Steps summary | Pass condition |
|------|--------------|----------------|
| View meal prep list | Log in, navigate to `/meal-preps`, wait for load | Cards matching seeded data appear |
| Load more | Navigate to `/meal-preps` with >20 seeded items, click "Load more" | Next batch appended; button hidden when list exhausted |
| Empty list | Log in as user with no meal preps, navigate to `/meal-preps` | "Nothing prepared yet" overlay visible |

## Open Questions

None.
