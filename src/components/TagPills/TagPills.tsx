import { Button, Chip, Input, TextField } from '@heroui/react'
import { useState } from 'react'

import type { TagPillsProps } from './TagPills.types'

export default function TagPills({ error, onChange, value }: TagPillsProps) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const tag = draft.trim()
    if (!tag || value.includes(tag)) return
    onChange([...value, tag])
    setDraft('')
  }

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] tracking-[0.25em] text-smoke/60 uppercase">Tags</span>
      {error && <p className="text-xs text-red-400">{error}</p>}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag, i) => (
            <Chip
              className="gap-1 border border-moss/20 bg-moss/10 pl-2.5 pr-1 text-xs text-moss"
              key={`${tag}-${String(i)}`}
              size="sm"
              variant="secondary"
            >
              {tag}
              <button
                className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-moss/50 hover:bg-moss/10 hover:text-moss"
                onClick={() => { remove(i) }}
                type="button"
              >
                ×
              </button>
            </Chip>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <TextField className="flex-1" onChange={setDraft} value={draft}>
          <Input
            fullWidth
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                add()
              }
            }}
            placeholder="Add a tag"
          />
        </TextField>
        <Button
          className="h-auto shrink-0 px-3 py-1.5 text-sm"
          onPress={add}
          variant="secondary"
        >
          +
        </Button>
      </div>
    </div>
  )
}
