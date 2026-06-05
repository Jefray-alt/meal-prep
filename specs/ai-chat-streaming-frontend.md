# Frontend Spec — ai-chat-streaming: AI Chat with SSE Streaming

## Goal

Wire the existing Home page chat UI to the real backend SSE stream, load conversation history on mount, and gate sending behind authentication via a login/register modal.

## API Contract

**Backend spec:** `meal-prep-api/specs/ai-chat-streaming-backend.md`

| Method | Path | Used for |
|--------|------|----------|
| `POST` | `/chat/message` | Send a user message; consume SSE stream for the assistant reply |
| `GET` | `/chat/history` | Load the user's conversation on mount |

## User Flows

### Happy path — authenticated user sends a message

1. User opens `/` — `Home` mounts, sets `isHistoryLoading: true`, and calls `GET /chat/history`; the chat window shows a skeleton while the request is in-flight. On success, messages populate the `MessageList` and `isHistoryLoading` is set to `false`.
2. User types a message and presses Enter (or "Ask").
3. The user message is appended to `messages` immediately (optimistic).
4. `POST /chat/message` opens an SSE connection; a loading indicator appears.
5. As `data: {"delta": "..."}` events arrive, a new assistant message bubble grows in real time.
6. On `data: [DONE]`, loading stops and the input is re-enabled.

### Happy path — unauthenticated user (empty state)

1. User opens `/` — history fetch is skipped; `EmptyState` is shown.
2. User types a message and presses Enter (or "Ask").
3. `AuthPromptModal` opens with "Sign in" and "Create an account" CTAs.
4. User dismisses the modal or navigates to `/login` / `/register`.

### Error states

| Trigger | UI response |
|---------|-------------|
| `GET /chat/history` fails (network/server error) | Silently fail — show empty state, do not block the page |
| SSE connection drops mid-stream | Mark the in-progress assistant bubble as truncated; re-enable input |
| `POST /chat/message` returns 502 (Ollama down) | Show an inline error message in the chat: "Something went wrong. Please try again." |
| `POST /chat/message` returns 401 | Open `AuthPromptModal` (token may have expired) |

## Components

| Component | New / Modified | Notes |
|-----------|---------------|-------|
| `Home` (page) | Modified | Replace `setTimeout` stub with real SSE fetch; add `GET /chat/history` on mount for authenticated users; show `ChatHistorySkeleton` while loading |
| `ChatHistorySkeleton` | New | Renders 2–3 alternating user/assistant skeleton bubbles in the chat window while history is in-flight; reuses `MealPrepCardSkeleton` animation style |
| `AuthPromptModal` | New | Modal with "Sign in" → `/login` and "Create an account" → `/register` buttons; triggered when unauthenticated user attempts to send |
| `MessageList` | No change expected | Streams deltas into the last assistant message |
| `InputDock` | No change expected | Already accepts `isLoading` and `isAuthenticated` props |

## State Management

All state lives in `Home.tsx` (existing pattern):

| State | Type | Notes |
|-------|------|-------|
| `messages` | `Message[]` | Populated from history on mount; updated optimistically on send and as stream deltas arrive |
| `input` | `string` | Cleared after send |
| `isLoading` | `boolean` | `true` while SSE stream is open |
| `isHistoryLoading` | `boolean` | `true` while `GET /chat/history` is in-flight on mount; drives the skeleton |
| `isAuthModalOpen` | `boolean` | Controls `AuthPromptModal` visibility |

## SSE Streaming Implementation Notes

- Use the native `fetch` API with `response.body.getReader()` to consume the SSE stream — no external library needed.
- Append each `delta` to the last assistant message in `messages` as chunks arrive.
- Seed the assistant message with `{ role: 'assistant', content: '', id: crypto.randomUUID() }` before the first chunk so the bubble appears immediately.
- Send the JWT (`Authorization: Bearer <token>`) in the request headers.

## Routes

| Route | Guard | Notes |
|-------|-------|-------|
| `/` | None | Chat visible to all; sending requires auth (enforced via modal) |

## Accessibility

- `AuthPromptModal` traps focus while open; closes on Escape.
- Assistant message bubble has `aria-live="polite"` so screen readers announce streamed content.
- Loading indicator has `aria-label="Assistant is typing"`.

## Tests

### Component tests

| Component | Scenario | Expected behaviour |
|-----------|----------|--------------------|
| `Home` | Authenticated, history loads | `MessageList` renders history messages |
| `Home` | Authenticated, sends message | User bubble appears optimistically; assistant bubble grows with stream deltas |
| `Home` | Unauthenticated, attempts send | `AuthPromptModal` opens |
| `AuthPromptModal` | "Sign in" pressed | Navigates to `/login` |
| `AuthPromptModal` | "Create an account" pressed | Navigates to `/register` |
| `Home` | 502 from SSE stream | Inline error message shown in chat |

### E2E / integration tests

| Flow | Steps summary | Pass condition |
|------|--------------|----------------|
| Authenticated chat | Log in → `/` → send message → wait for stream | Assistant reply renders, input re-enabled |
| Unauthenticated send | `/` → type message → press Ask | `AuthPromptModal` visible |

## Open Questions

- [x] Preserve typed message after login — **yes**. Store the pending message in `sessionStorage` before navigating to `/login` or `/register`; on mount, `Home` reads it back, populates `input`, and clears the key.
