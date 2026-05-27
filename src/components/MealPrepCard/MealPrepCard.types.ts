export interface MealPrepCardProps {
  mealPrep: MealPrepSummary
}

export interface MealPrepSummary {
  carbs: null | number
  fat: null | number
  id: string
  protein: null | number
  tags: { id: string; name: string }[]
  title: string
}
