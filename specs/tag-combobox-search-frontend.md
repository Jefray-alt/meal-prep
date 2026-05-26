# Frontend Spec — tag-combobox-search: Tag Combobox with Async Loading

## Goal
Replace the current confusing tag suggestions UI with a HeroUI async ComboBox that loads tags incrementally and keeps selected tags visually distinct from suggestions.

## API Contract

**Backend spec:** `meal-prep-api/specs/tag-combobox-search-backend.md`

| Method | Path | Used for |
|--------|------|----------|
| GET | `/tags` | Load initial 10 tags on focus, paginate on scroll, search server-side on input |

## User Flows

### Happy path — selecting a tag from suggestions
1. User focuses the tag combobox input.
2. Dropdown opens showing 10 random tags fetched from `GET /tags`.
3. User scrolls to the bottom of the dropdown — next 10 tags load automatically (`GET /tags?offset=10`).
4. User clicks a tag — it is added as a pill above the input; the dropdown closes.
5. The tag remains visible in the dropdown but appears greyed out and is non-interactive (disabled).

### Happy path — searching for a tag
1. User types into the combobox input.
2. After debounce (~300 ms), `GET /tags?search=<query>` is called.
3. Dropdown updates to show matching results (up to 10).
4. User scrolls for more — `GET /tags?search=<query>&offset=10` loads the next page.
5. User selects a tag — added as a pill; the tag is greyed out in the dropdown.

### Removing a selected tag
1. User clicks the × on a selected tag pill.
2. The pill is removed immediately; the tag becomes selectable again in the dropdown (no longer greyed out).

### Error states
| Trigger | UI response |
|---------|-------------|
| `GET /tags` returns non-2xx | Show inline error message inside dropdown: "Failed to load tags. Try again." with a retry affordance |
| Network timeout on search | Same inline error; previous results cleared |
| No tags match the search query | Show empty state inside dropdown: "No tags found" |

## Components

| Component | New / Modified | Notes |
|-----------|---------------|-------|
| `TagCombobox` | New | HeroUI `ComboBox` with `useAsyncList` for pagination and search; manages dropdown state |
| `TagPill` | New or Modified | Pill displaying a selected tag with a × remove button; visually distinct from dropdown items |
| Tag input area (parent form) | Modified | Replace current tag suggestion pills with `TagCombobox` + selected `TagPill` list |

## State Management

- `useAsyncList` (from `@react-stately/data`, re-exported by HeroUI) manages the fetched items, loading state, and cursor (`offset`) internally.
- Selected tags are local state in the parent page/component (`selectedTags: Tag[]`).
- On tag select: append to `selectedTags`; pass `selectedTags` ids as `disabledKeys` to `ComboBox` — HeroUI greys them out automatically.
- On tag remove: splice from `selectedTags`; the corresponding key is removed from `disabledKeys`, re-enabling it in the dropdown.

## Routes

No new routes. This change is scoped to the existing page that contains the tag input.

| Route | Guard | Notes |
|-------|-------|-------|
| — | — | No route changes |

## Accessibility

- `ComboBox` is a HeroUI / React Aria component — keyboard navigation (↑ ↓ Enter Escape) and ARIA roles (`combobox`, `listbox`, `option`) are provided out of the box.
- Each selected `TagPill` × button must have `aria-label="Remove <tag name>"`.
- Loading state inside the dropdown should have `aria-busy="true"` on the listbox.
- Ensure sufficient colour contrast between suggestion items and selected pills.

## Tests

### Component tests

| Component | Scenario | Expected behaviour |
|-----------|----------|--------------------|
| `TagCombobox` | Focused with no input | Calls `GET /tags` (no search param) and renders 10 items |
| `TagCombobox` | User types "protein" | Debounces then calls `GET /tags?search=protein` |
| `TagCombobox` | Scroll to end of list when `hasMore: true` | Calls next page with `offset=10` |
| `TagCombobox` | Scroll to end when `hasMore: false` | No additional fetch |
| `TagCombobox` | API error on load | Shows "Failed to load tags" error state |
| `TagCombobox` | No results for search | Shows "No tags found" empty state |
| `TagCombobox` | Select a tag | Calls `onTagSelect` callback; tag appears greyed out/disabled in dropdown |
| `TagPill` | Render | Displays tag name and × button |
| `TagPill` | Click × | Calls `onRemove` callback |

### E2E / integration tests

| Flow | Steps summary | Pass condition |
|------|--------------|----------------|
| Select tag via dropdown | Focus input → wait for dropdown → click first item | Tag appears as pill above input; item greyed out in dropdown |
| Search and select | Type "protein" → wait for results → click result | Matching tag added as pill; greyed out in dropdown |
| Paginate suggestions | Focus → scroll to bottom of dropdown | Second page of tags loads and appends |
| Remove selected tag | Select a tag → click × on pill | Pill removed; tag is selectable again in dropdown |

## Open Questions
