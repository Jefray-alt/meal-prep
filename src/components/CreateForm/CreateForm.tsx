import { Button, FieldError, Input, Label, TextArea, TextField } from '@heroui/react'

import type { CreateFormProps } from './CreateForm.types'

import IngredientPills from '../IngredientPills/IngredientPills'
import TagPills from '../TagPills/TagPills'

const labelCls = 'mb-1 text-[10px] tracking-[0.2em] text-smoke/60 uppercase'

export default function CreateForm({ data, errors, existingTags, isLoadingTags, isSaving, onBlur, onCancel, onChange, onSave, serverError, tagsLoadError }: CreateFormProps) {
  return (
    <div className="mt-10 flex flex-col gap-6 rounded-2xl border border-bark/10 bg-char/92 p-8 shadow-sm backdrop-blur-sm">
      {/* Title */}
      <TextField
        fullWidth
        isInvalid={!!errors.title}
        onBlur={() => { onBlur('title') }}
        onChange={(v) => { onChange({ title: v }) }}
        value={data.title}
      >
        <Label className={labelCls}>Title</Label>
        <Input fullWidth placeholder="e.g. High-protein Sunday batch" />
        <FieldError className="mt-1 text-xs">{errors.title}</FieldError>
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
      <TextField
        fullWidth
        isInvalid={!!errors.instructions}
        onBlur={() => { onBlur('instructions') }}
        onChange={(v) => { onChange({ instructions: v }) }}
        value={data.instructions}
      >
        <Label className={labelCls}>Instructions</Label>
        <TextArea
          className="max-h-48 min-h-28 resize-none border-0 bg-transparent p-0 text-sm leading-relaxed text-bark shadow-none outline-none placeholder:text-smoke/50 focus:ring-0 focus:shadow-none data-[focused=true]:ring-0 data-[focused=true]:shadow-none"
          placeholder="Describe preparation steps, cooking times, storage tips…"
        />
        <div className="flex items-start justify-between gap-2">
          <FieldError className="text-xs">{errors.instructions}</FieldError>
          <span className={`ml-auto shrink-0 text-xs ${data.instructions.length > 1000 ? 'text-red-400' : 'text-smoke/40'}`}>
            {data.instructions.length} / 1000
          </span>
        </div>
      </TextField>

      {/* Ingredients */}
      <IngredientPills
        error={errors.ingredients}
        onChange={(ingredients) => { onChange({ ingredients }) }}
        value={data.ingredients}
      />

      {/* Tags */}
      <TagPills
        error={errors.tags}
        existingTags={existingTags}
        isLoadingTags={isLoadingTags}
        onChange={(tags) => { onChange({ tags }) }}
        tagsLoadError={tagsLoadError}
        value={data.tags}
      />

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-bark/8 pt-6">
        {serverError && (
          <p className="mr-auto text-xs text-red-400" role="alert">{serverError}</p>
        )}
        <Button
          className="h-auto rounded-lg border border-bark/15 px-4 py-1.5 text-xs text-smoke hover:border-bark/30 hover:text-bark"
          onPress={onCancel}
          variant="ghost"
        >
          Cancel
        </Button>
        <Button
          className="h-auto rounded-lg px-5 py-1.5 text-xs font-medium"
          isDisabled={isSaving}
          onPress={onSave}
          variant="primary"
        >
          {isSaving ? 'Saving…' : 'Save Meal Prep'}
        </Button>
      </div>
    </div>
  )
}
