import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

import { render, screen } from '../../test-utils'
import MessageList from './MessageList'
import type { Message } from './MessageList.types'

describe('MessageList', () => {
  it('renders user messages', () => {
    const messages: Message[] = [{ content: 'Hello there', id: '1', role: 'user' }]
    render(<MessageList bottomRef={createRef()} isLoading={false} messages={messages} />)
    expect(screen.getByText('Hello there')).toBeInTheDocument()
  })

  it('renders assistant messages', () => {
    const messages: Message[] = [{ content: 'I am the assistant', id: '1', role: 'assistant' }]
    render(<MessageList bottomRef={createRef()} isLoading={false} messages={messages} />)
    expect(screen.getByText('I am the assistant')).toBeInTheDocument()
  })

  it('renders loading dots when isLoading is true', () => {
    const { container } = render(<MessageList bottomRef={createRef()} isLoading={true} messages={[]} />)
    expect(container.querySelectorAll('.loading-dot')).toHaveLength(3)
  })

  it('does not render loading dots when isLoading is false', () => {
    const { container } = render(<MessageList bottomRef={createRef()} isLoading={false} messages={[]} />)
    expect(container.querySelectorAll('.loading-dot')).toHaveLength(0)
  })

  it('renders multiple messages in order', () => {
    const messages: Message[] = [
      { content: 'First message', id: '1', role: 'user' },
      { content: 'Second message', id: '2', role: 'assistant' },
    ]
    render(<MessageList bottomRef={createRef()} isLoading={false} messages={messages} />)
    expect(screen.getByText('First message')).toBeInTheDocument()
    expect(screen.getByText('Second message')).toBeInTheDocument()
  })
})
