import type { Ingredient } from '../IngredientPills/IngredientPills.types'
import type { Tag } from '../TagPill/TagPill.types'

export type { Tag }

export interface CreateFormData {
  carbs: string
  fat: string
  ingredients: Ingredient[]
  instructions: string
  protein: string
  tags: string[]
  title: string
}

export interface CreateFormProps {
  data: CreateFormData
  errors: Partial<Record<keyof CreateFormData, string>>
  isSaving?: boolean
  onBlur: (field: keyof CreateFormData) => void
  onCancel: () => void
  onChange: (patch: Partial<CreateFormData>) => void
  onSave: () => void
  onTagRemove: (tag: Tag) => void
  onTagSelect: (tag: Tag) => void
  selectedTags: Tag[]
  serverError?: null | string
}
