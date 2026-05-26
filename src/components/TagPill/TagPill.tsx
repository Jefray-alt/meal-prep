import { Chip } from '@heroui/react'

import type { TagPillProps } from './TagPill.types'

export default function TagPill({ onRemove, tag }: TagPillProps) {
  return (
    <Chip
      className="gap-1 border border-moss/20 bg-moss/10 pl-2.5 pr-1 text-xs text-moss"
      size="sm"
      variant="secondary"
    >
      {tag.name}
      <button
        aria-label={`Remove ${tag.name}`}
        className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-moss/50 hover:bg-moss/10 hover:text-moss"
        onClick={() => { onRemove(tag) }}
        type="button"
      >
        ×
      </button>
    </Chip>
  )
}
