export interface Ingredient {
  name: string
  quantity: string
}

export interface IngredientPillsProps {
  onChange: (value: Ingredient[]) => void
  value: Ingredient[]
}
