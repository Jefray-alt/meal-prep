import { Button } from '@heroui/react'

import type { EmptyStateProps } from './EmptyState.types'

const SUGGESTED_PROMPTS = [
  {
    icon: '🥩',
    label: 'High-protein week',
    text: 'Build me a high-protein meal prep plan for the week — I work out 5 days a week and need at least 150g protein daily.',
  },
  {
    icon: '🫙',
    label: 'Budget batch cook',
    text: 'Create a full week of batch cooking under $60 total for 2 people. Focus on variety and wholesome nutrition.',
  },
  {
    icon: '⏱',
    label: '20-minute meals',
    text: 'What are the best meal prep ideas I can make in under 20 minutes? Looking for quick but nutritious options.',
  },
  {
    icon: '🌿',
    label: 'Plant-based plan',
    text: 'Design a satisfying plant-based meal prep plan for the week — high in iron and complete proteins.',
  },
]

export default function EmptyState({ onSelectPrompt, textareaRef }: EmptyStateProps) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-16">
      <p className="mb-3 text-[10px] tracking-[0.35em] text-ember uppercase">
        mise en place
      </p>
      <h1
        className="text-center text-5xl font-light italic leading-[1.15] text-bark sm:text-6xl"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        What shall we<br />prep this week?
      </h1>
      <p className="mt-5 max-w-sm text-center text-sm leading-relaxed text-smoke">
        Tell me your goals, restrictions, or what's in your fridge —
        I'll craft a complete meal prep strategy around it.
      </p>

      <div className="mt-10 grid w-full max-w-xl grid-cols-1 gap-2.5 sm:grid-cols-2">
        {SUGGESTED_PROMPTS.map(({ icon, label, text }) => (
          <Button
            className="group h-auto w-full items-start justify-start gap-3 whitespace-normal rounded-xl border border-bark/12 bg-ash/50 px-4 py-4 text-left hover:border-ember/25 hover:bg-ash/80"
            key={label}
            onPress={() => {
              onSelectPrompt(text)
              textareaRef.current?.focus()
            }}
            variant="ghost"
          >
            <span className="mt-0.5 shrink-0 text-base leading-none">{icon}</span>
            <div className="min-w-0 text-left">
              <p className="text-sm font-medium text-bark/90 transition-colors group-hover:text-bark">
                {label}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-smoke">
                {text}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
