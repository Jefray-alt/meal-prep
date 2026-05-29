import type { Ingredient } from '../IngredientPills/IngredientPills.types'
import type { Tag } from '../TagPill/TagPill.types'

export type { Tag }

export interface MealPrepFormData {
  carbs: string
  fat: string
  ingredients: Ingredient[]
  instructions: string
  protein: string
  tags: string[]
  title: string
}

export interface MealPrepFormProps {
  data: MealPrepFormData
  errors: Partial<Record<keyof MealPrepFormData, string>>
  isSaving?: boolean
  onBlur: (field: keyof MealPrepFormData) => void
  onCancel: () => void
  onChange: (patch: Partial<MealPrepFormData>) => void
  onSave: () => void
  onTagRemove: (tag: Tag) => void
  onTagSelect: (tag: Tag) => void
  selectedTags: Tag[]
  serverError?: null | string
}
