import { type KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import type { Message } from '../../components/MessageList/MessageList.types'

import EmptyState from '../../components/EmptyState/EmptyState'
import Header from '../../components/Header/Header'
import InputDock from '../../components/InputDock/InputDock'
import MessageList from '../../components/MessageList/MessageList'
import { TOKEN_KEY } from '../../lib/constants'

export default function Home() {
  const navigate = useNavigate()
  const isAuthenticated = !!localStorage.getItem(TOKEN_KEY)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    setMessages(prev => [...prev, { content: trimmed, id: crypto.randomUUID(), role: 'user' }])
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    setIsLoading(true)

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          content:
            'I\'m crafting your personalized meal plan — AI responses are on their way. For now, try "Create by yourself" to build your plan manually and get a feel for what mise can do.',
          id: crypto.randomUUID(),
          role: 'assistant',
        },
      ])
      setIsLoading(false)
    }, 1800)
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
        {messages.length === 0 ? (
          <EmptyState onSelectPrompt={setInput} textareaRef={textareaRef} />
        ) : (
          <MessageList bottomRef={bottomRef} isLoading={isLoading} messages={messages} />
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
    </div>
  )
}
