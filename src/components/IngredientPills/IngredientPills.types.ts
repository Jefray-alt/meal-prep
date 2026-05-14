export interface Ingredient {
  name: string
  quantity: string
}

export interface IngredientPillsProps {
  error?: string
  onChange: (value: Ingredient[]) => void
  value: Ingredient[]
}
