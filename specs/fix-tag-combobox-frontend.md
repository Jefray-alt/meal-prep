# Frontend Spec — fix-tag-combobox: Fix Tag Combobox Interaction

## Goal

Users can select existing tags (input clears, tag appears as a badge) or type a new tag name and press Enter to add it inline, with a visible hint guiding them to do so.

## API Contract

No new endpoints. The form submits `POST /meal-preps` with `tags: string[]` — unchanged. The backend already upserts tags by name via `TagsService.upsertForUser`.

Reference: `meal-prep-api/src/meal-preps/meal-preps.controller.ts`

## User Flows

### Happy path — select existing tag
1. User focuses the tag input; dropdown appears with existing tags.
2. User clicks (or keyboard-selects) a tag from the list.
3. Tag appears as a badge in the list above the input; **input field clears**.

### Happy path — create new tag
1. User types a tag name not present in the dropdown.
2. Hint text "Press Enter to add" is visible beneath the input.
3. User presses **Enter**.
4. New tag appears as a badge; **input field clears**.
5. On form submit the tag name is included in `tags: string[]` — backend creates it.

### Remove a tag
1. User clicks ✕ on a badge.
2. Badge disappears; tag name is removed from `data.tags`.

### Error states

| Trigger | UI response |
|---------|-------------|
| Submit with no tags | Existing "Add at least one tag" validation message (no change) |
| Enter pressed with empty input | No-op |
| Duplicate name typed + Enter | No-op — do not add the same tag name twice |

## Components

| Component | New / Modified | Notes |
|-----------|---------------|-------|
| `TagCombobox/TagCombobox.tsx` | Modified | Fix input-clear on selection; add `onKeyDown` Enter handler; add hint text |
| `Create.tsx` | Modified | `handleTagSelect` must handle new tags — new tags receive a `crypto.randomUUID()` id client-side (for badge key / removal only; never sent to API) |

### Key implementation notes

**Input-clear on selection** — HeroUI's `ComboBox` may repopulate `inputValue` with the selected item's `textValue` even when `inputValue` is controlled. After calling `onTagSelect`, set both `inputValue` to `''` and call `list.setFilterText('')`. If HeroUI still overrides the value, set `selectedKey={null}` on the `ComboBox` to prevent it from reflecting a selected item in the input.

**New-tag Enter handler** — attach `onKeyDown` to the `<Input>` (or wrap `ComboBox.InputGroup`). On `key === 'Enter'`:
1. Trim `inputValue`; bail if empty.
2. Bail if `value` already contains a tag with the same name (case-insensitive).
3. Call `onTagSelect({ id: crypto.randomUUID(), name: trimmedValue })`.
4. Clear `inputValue` and `list.setFilterText('')`.

**Hint text** — render a `<p>` beneath the `ComboBox` when `inputValue.trim()` is non-empty:
```
Press Enter to add "{inputValue}"
```
Associate it with the input via `aria-describedby`.

## State Management

- `inputValue: string` in `TagCombobox` — controlled; cleared after every selection or Enter confirmation.
- `selectedTags: Tag[]` in `Create` — badges rendered from this array; new tags stored with `crypto.randomUUID()` id.
- `data.tags: string[]` in `Create` — tag names sent to the API; shape unchanged.

## Routes

No changes.

## Accessibility

- Hint text uses a `<p id="tag-hint">` associated with the input via `aria-describedby="tag-hint"`.
- Newly added badges appear in the existing badge list which is in natural DOM order — no additional `aria-live` needed.
- Disabled keys in the dropdown prevent re-selecting an already-added tag.

## Tests

### Component tests

| Component | Scenario | Expected behaviour |
|-----------|----------|--------------------|
| `TagCombobox` | Select existing tag from dropdown | `onTagSelect` called; input value is `''` after selection |
| `TagCombobox` | Type new name + Enter | `onTagSelect` called with `{ id: <uuid>, name }`;  input value is `''` |
| `TagCombobox` | Enter pressed with empty input | `onTagSelect` not called |
| `TagCombobox` | Duplicate name + Enter | `onTagSelect` not called |
| `TagCombobox` | Hint text visible when typing | `"Press Enter to add"` text present in DOM when `inputValue` is non-empty |
| `TagCombobox` | Hint text hidden when input empty | Hint not present when `inputValue` is `''` |

### E2E / integration tests

| Flow | Steps summary | Pass condition |
|------|--------------|----------------|
| Add existing + new tag then submit | Select 1 existing tag from dropdown, type a new name + Enter, complete form, submit | Both names appear as badges; `POST /meal-preps` body contains `tags: [existingName, newName]` |
