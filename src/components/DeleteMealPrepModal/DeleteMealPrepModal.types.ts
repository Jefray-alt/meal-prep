export interface DeleteMealPrepModalProps {
  error: null | string
  isLoading: boolean
  isOpen: boolean
  mealPrepTitle: string
  onClose: () => void
  onConfirm: () => void
  tags: { id: string; name: string }[]
}
