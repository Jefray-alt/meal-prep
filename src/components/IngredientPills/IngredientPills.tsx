import { Button, Chip, Input, TextField } from '@heroui/react'
import { useState } from 'react'

import type { IngredientPillsProps } from './IngredientPills.types'

export default function IngredientPills({ error, onChange, value }: IngredientPillsProps) {
  const [draftName, setDraftName] = useState('')
  const [draftQty, setDraftQty] = useState('')

  const add = () => {
    const name = draftName.trim()
    if (!name) return
    onChange([...value, { name, quantity: draftQty.trim() }])
    setDraftName('')
    setDraftQty('')
  }

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] tracking-[0.25em] text-smoke/60 uppercase">Ingredients</span>
      {error && <p className="text-xs text-red-400">{error}</p>}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item, i) => (
            <div className="flex items-center gap-1.5" key={`${item.name}-${String(i)}`}>
              <Chip
                className="gap-1 bg-ash/80 pl-2.5 pr-1 text-xs text-bark"
                size="sm"
                variant="secondary"
              >
                {item.name}
                <button
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-smoke/50 hover:bg-bark/10 hover:text-bark"
                  onClick={() => { remove(i) }}
                  type="button"
                >
                  ×
                </button>
              </Chip>
              {item.quantity && (
                <span className="text-xs text-smoke/60">{item.quantity}</span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <TextField className="flex-1" onChange={setDraftName} value={draftName}>
          <Input
            fullWidth
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                add()
              }
            }}
            placeholder="Ingredient name"
          />
        </TextField>
        <div className="flex gap-2">
          <TextField className="flex-1 sm:w-32 sm:flex-none" onChange={setDraftQty} value={draftQty}>
            <Input fullWidth placeholder="Qty (e.g. 200g)" />
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
    </div>
  )
}
