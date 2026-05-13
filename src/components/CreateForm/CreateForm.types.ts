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
  onCancel: () => void
  onChange: (patch: Partial<CreateFormData>) => void
  onSave: () => void
}
