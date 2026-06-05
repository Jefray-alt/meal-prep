import { useOverlayState } from '@heroui/react'
import { type KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import type { Message } from '../../components/MessageList/MessageList.types'

import AuthPromptModal from '../../components/AuthPromptModal/AuthPromptModal'
import ChatHistorySkeleton from '../../components/ChatHistorySkeleton/ChatHistorySkeleton'
import EmptyState from '../../components/EmptyState/EmptyState'
import Header from '../../components/Header/Header'
import InputDock from '../../components/InputDock/InputDock'
import MessageList from '../../components/MessageList/MessageList'
import { fetchHistory, streamMessage } from '../../lib/clients/chat.client'
import { TOKEN_KEY } from '../../lib/constants'

const PENDING_MESSAGE_KEY = 'mise_pending_message'

export default function Home() {
  const navigate = useNavigate()
  const isAuthenticated = !!localStorage.getItem(TOKEN_KEY)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState(() => {
    const pending = sessionStorage.getItem(PENDING_MESSAGE_KEY)
    if (pending) {
      sessionStorage.removeItem(PENDING_MESSAGE_KEY)
      return pending
    }
    return ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = useState(isAuthenticated)
  const authModalState = useOverlayState()
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isAuthenticated) return

    fetchHistory()
      .then((history) => {
        setMessages(
          history.map((m) => ({ content: m.content, id: m.id, role: m.role })),
        )
      })
      .catch(() => {
        // silently degrade — show empty state
      })
      .finally(() => {
        setIsHistoryLoading(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    if (!isAuthenticated) {
      authModalState.open()
      return
    }

    setMessages((prev) => [...prev, { content: trimmed, id: crypto.randomUUID(), role: 'user' }])
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    setIsLoading(true)

    const assistantId = crypto.randomUUID()
    setMessages((prev) => [...prev, { content: '', id: assistantId, role: 'assistant' }])

    void streamMessage(
      trimmed,
      (delta) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + delta } : m)),
        )
      },
      () => {
        setIsLoading(false)
      },
      () => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: m.content || 'Something went wrong. Please try again.' }
              : m,
          ),
        )
        setIsLoading(false)
      },
    )
  }

  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 160).toString()}px`
    }
  }, [input])

  const handleChange = (value: string) => {
    setInput(value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleLogin = () => {
    if (input.trim()) sessionStorage.setItem(PENDING_MESSAGE_KEY, input.trim())
    authModalState.close()
    void navigate('/login')
  }

  const handleRegister = () => {
    if (input.trim()) sessionStorage.setItem(PENDING_MESSAGE_KEY, input.trim())
    authModalState.close()
    void navigate('/register')
  }

  return (
    <div
      className="relative flex h-dvh flex-col overflow-hidden bg-char text-bark antialiased"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* Film grain */}
      <div aria-hidden="true" className="grain-overlay" />

      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-0 h-175 w-175 -translate-x-1/2 translate-y-1/2 rounded-full bg-ember opacity-[0.04] blur-[160px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-0 top-0 h-125 w-125 translate-x-1/2 -translate-y-1/2 rounded-full bg-moss opacity-[0.03] blur-[140px]"
      />

      <Header />

      <main className="relative z-10 flex-1 overflow-y-auto">
        {isHistoryLoading ? (
          <ChatHistorySkeleton />
        ) : messages.length === 0 ? (
          <EmptyState onSelectPrompt={setInput} textareaRef={textareaRef} />
        ) : (
          <MessageList aria-live="polite" bottomRef={bottomRef} isLoading={isLoading} messages={messages} />
        )}
      </main>

      <InputDock
        input={input}
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        onChange={handleChange}
        onCreateYourself={() => { void navigate('/create') }}
        onKeyDown={handleKeyDown}
        onSend={() => {
          sendMessage(input)
        }}
        textareaRef={textareaRef}
      />

      <AuthPromptModal
        onLogin={handleLogin}
        onRegister={handleRegister}
        state={authModalState}
      />
    </div>
  )
}
