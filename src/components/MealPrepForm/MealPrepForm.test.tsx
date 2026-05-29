import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

vi.mock('../TagCombobox/TagCombobox', () => ({
  default: () => <div data-testid="tag-combobox" />,
}))

import type { MealPrepFormData } from './MealPrepForm.types'

import { render, screen } from '../../test-utils'
import MealPrepForm from './MealPrepForm'

const defaultData: MealPrepFormData = {
  carbs: '',
  fat: '',
  ingredients: [],
  instructions: '',
  protein: '',
  tags: [],
  title: '',
}

const defaultProps = {
  data: defaultData,
  errors: {},
  onBlur: vi.fn(),
  onCancel: vi.fn(),
  onChange: vi.fn(),
  onSave: vi.fn(),
  onTagRemove: vi.fn(),
  onTagSelect: vi.fn(),
  selectedTags: [],
}

describe('MealPrepForm', () => {
  it('renders the Title field', () => {
    render(<MealPrepForm {...defaultProps} />)
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('renders all three macro fields', () => {
    render(<MealPrepForm {...defaultProps} />)
    expect(screen.getByText('Carbs (g)')).toBeInTheDocument()
    expect(screen.getByText('Protein (g)')).toBeInTheDocument()
    expect(screen.getByText('Fat (g)')).toBeInTheDocument()
  })

  it('calls onSave when Save Meal Prep is clicked', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<MealPrepForm {...defaultProps} onSave={onSave} />)
    await user.click(screen.getByRole('button', { name: 'Save Meal Prep' }))
    expect(onSave).toHaveBeenCalledOnce()
  })

  it('calls onCancel when Cancel is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<MealPrepForm {...defaultProps} onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledOnce()
  })
})
