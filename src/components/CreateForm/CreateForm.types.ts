import type { Ingredient } from '../IngredientPills/IngredientPills.types'

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
  existingTags?: string[]
  isLoadingTags?: boolean
  isSaving?: boolean
  onBlur: (field: keyof CreateFormData) => void
  onCancel: () => void
  onChange: (patch: Partial<CreateFormData>) => void
  onSave: () => void
  serverError?: null | string
  tagsLoadError?: boolean
}
