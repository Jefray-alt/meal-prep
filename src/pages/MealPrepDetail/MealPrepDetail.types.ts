export interface MealPrepDetail {
  carbs: null | number
  createdAt: string
  fat: null | number
  id: string
  ingredients: { name: string; quantity: string }[]
  instructions: string
  protein: null | number
  tags: { id: string; name: string }[]
  title: string
  updatedAt: string
}
