import { TOKEN_KEY } from '../constants'
import { apiClient } from './api/api.client'

export interface ChatMessage {
  content: string
  createdAt: string
  id: string
  role: 'assistant' | 'user'
}

export async function fetchHistory(): Promise<ChatMessage[]> {
  const res = await apiClient('/chat/history')
  if (!res.ok) return []
  return res.json() as Promise<ChatMessage[]>
}

export async function streamMessage(
  message: string,
  onDelta: (delta: string) => void,
  onDone: () => void,
  onError: () => void,
): Promise<void> {
  const token = localStorage.getItem(TOKEN_KEY)
  const res = await fetch('/api/chat/message', {
    body: JSON.stringify({ message }),
    headers: {
      Authorization: `Bearer ${token ?? ''}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  if (!res.ok || !res.body) {
    onError()
    return
  }

  try {
    for await (const line of streamLines(res.body)) {
      if (!line.startsWith('data: ')) continue
      const payload = line.slice(6)
      if (payload === '[DONE]') {
        onDone()
        return
      }
      if (payload === '[ERROR]') {
        onError()
        return
      }
      try {
        const parsed = JSON.parse(payload) as { delta: string }
        onDelta(parsed.delta)
      } catch {
        // malformed chunk — skip
      }
    }
  } catch {
    onError()
  }
}

async function* streamLines(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    for (;;) {
      const result = await reader.read()
      if (result.done) break

      const combined = buffer + decoder.decode(result.value, { stream: true })
      const parts = combined.split('\n')
      buffer = parts.slice(-1).join('')
      const lines = parts.slice(0, -1)

      for (const line of lines) {
        yield line
      }
    }
  } finally {
    reader.releaseLock()
  }
}
