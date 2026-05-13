import { Button, Input, Label, TextArea, TextField } from '@heroui/react'

import type { CreateFormProps } from './CreateForm.types'

import IngredientPills from '../IngredientPills/IngredientPills'
import TagPills from '../TagPills/TagPills'

const labelCls = 'mb-1 text-[10px] tracking-[0.2em] text-smoke/60 uppercase'

export default function CreateForm({ data, onCancel, onChange, onSave }: CreateFormProps) {
  return (
    <div className="mt-10 flex flex-col gap-6 rounded-2xl border border-bark/10 bg-char/92 p-8 shadow-sm backdrop-blur-sm">
      {/* Title */}
      <TextField fullWidth onChange={(v) => { onChange({ title: v }) }} value={data.title}>
        <Label className={labelCls}>Title</Label>
        <Input fullWidth placeholder="e.g. High-protein Sunday batch" />
      </TextField>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-4">
        <TextField onChange={(v) => { onChange({ carbs: v }) }} value={data.carbs}>
          <Label className={labelCls}>Carbs (g)</Label>
          <Input fullWidth placeholder="0" type="number" />
        </TextField>
        <TextField onChange={(v) => { onChange({ protein: v }) }} value={data.protein}>
          <Label className={labelCls}>Protein (g)</Label>
          <Input fullWidth placeholder="0" type="number" />
        </TextField>
        <TextField onChange={(v) => { onChange({ fat: v }) }} value={data.fat}>
          <Label className={labelCls}>Fat (g)</Label>
          <Input fullWidth placeholder="0" type="number" />
        </TextField>
      </div>

      {/* Instructions */}
      <TextField fullWidth onChange={(v) => { onChange({ instructions: v }) }} value={data.instructions}>
        <Label className={labelCls}>Instructions</Label>
        <TextArea
          className="max-h-48 min-h-28 resize-none border-0 bg-transparent p-0 text-sm leading-relaxed text-bark shadow-none outline-none placeholder:text-smoke/50 focus:ring-0 focus:shadow-none data-[focused=true]:ring-0 data-[focused=true]:shadow-none"
          placeholder="Describe preparation steps, cooking times, storage tips…"
        />
      </TextField>

      {/* Ingredients */}
      <IngredientPills
        onChange={(ingredients) => { onChange({ ingredients }) }}
        value={data.ingredients}
      />

      {/* Tags */}
      <TagPills
        onChange={(tags) => { onChange({ tags }) }}
        value={data.tags}
      />

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-bark/8 pt-6">
        <Button
          className="h-auto rounded-lg border border-bark/15 px-4 py-1.5 text-xs text-smoke hover:border-bark/30 hover:text-bark"
          onPress={onCancel}
          variant="ghost"
        >
          Cancel
        </Button>
        <Button
          className="h-auto rounded-lg px-5 py-1.5 text-xs font-medium"
          onPress={onSave}
          variant="primary"
        >
          Save Meal Prep
        </Button>
      </div>
    </div>
  )
}
