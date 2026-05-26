import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

vi.mock('../TagCombobox/TagCombobox', () => ({
  default: () => <div data-testid="tag-combobox" />,
}))

import type { CreateFormData } from './CreateForm.types'

import { render, screen } from '../../test-utils'
import CreateForm from './CreateForm'

const defaultData: CreateFormData = {
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

describe('CreateForm', () => {
  it('renders the Title field', () => {
    render(<CreateForm {...defaultProps} />)
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('renders all three macro fields', () => {
    render(<CreateForm {...defaultProps} />)
    expect(screen.getByText('Carbs (g)')).toBeInTheDocument()
    expect(screen.getByText('Protein (g)')).toBeInTheDocument()
    expect(screen.getByText('Fat (g)')).toBeInTheDocument()
  })

  it('calls onSave when Save Meal Prep is clicked', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<CreateForm {...defaultProps} onSave={onSave} />)
    await user.click(screen.getByRole('button', { name: 'Save Meal Prep' }))
    expect(onSave).toHaveBeenCalledOnce()
  })

  it('calls onCancel when Cancel is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<CreateForm {...defaultProps} onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledOnce()
  })
})
