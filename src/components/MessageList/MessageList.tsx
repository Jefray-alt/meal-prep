import { Card } from '@heroui/react'

import type { MessageListProps } from './MessageList.types'

export default function MessageList({ bottomRef, isLoading, messages }: MessageListProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      {messages.map((msg) => (
        <div
          className={`msg-enter flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          key={msg.id}
        >
          {msg.role === 'assistant' && (
            <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded border border-ember/35 text-xs text-ember select-none">
              ◈
            </div>
          )}
          <Card
            className={`max-w-[80%] gap-0 rounded-2xl px-4 py-3 shadow-none ${
              msg.role === 'user'
                ? 'rounded-tr-sm bg-ember/[0.13] ring-1 ring-ember/20'
                : 'rounded-tl-sm bg-ash ring-1 ring-bark/80'
            }`}
            variant="transparent"
          >
            <Card.Content className="p-0">
              <p className={`text-sm leading-relaxed ${msg.role === 'user' ? 'text-cream' : 'text-cream/85'}`}>
                {msg.content}
              </p>
            </Card.Content>
          </Card>
        </div>
      ))}

      {isLoading && (
        <div className="msg-enter flex items-start gap-3">
          <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded border border-ember/35 text-xs text-ember select-none">
            ◈
          </div>
          <Card
            className="gap-0 rounded-2xl rounded-tl-sm bg-ash px-5 py-4 shadow-none ring-1 ring-bark/80"
            variant="transparent"
          >
            <Card.Content className="p-0">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    className="loading-dot h-1.5 w-1.5 rounded-full"
                    key={i}
                    style={{ animationDelay: `${(i * 180).toString()}ms` }}
                  />
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
