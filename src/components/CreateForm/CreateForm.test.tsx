import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '../../test-utils'
import CreateForm from './CreateForm'
import type { CreateFormData } from './CreateForm.types'

const defaultData: CreateFormData = {
  carbs: '',
  fat: '',
  ingredients: [],
  instructions: '',
  protein: '',
  tags: [],
  title: '',
}

describe('CreateForm', () => {
  it('renders the Title field', () => {
    render(<CreateForm data={defaultData} onCancel={vi.fn()} onChange={vi.fn()} onSave={vi.fn()} />)
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('renders all three macro fields', () => {
    render(<CreateForm data={defaultData} onCancel={vi.fn()} onChange={vi.fn()} onSave={vi.fn()} />)
    expect(screen.getByText('Carbs (g)')).toBeInTheDocument()
    expect(screen.getByText('Protein (g)')).toBeInTheDocument()
    expect(screen.getByText('Fat (g)')).toBeInTheDocument()
  })

  it('calls onSave when Save Meal Prep is clicked', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<CreateForm data={defaultData} onCancel={vi.fn()} onChange={vi.fn()} onSave={onSave} />)
    await user.click(screen.getByRole('button', { name: 'Save Meal Prep' }))
    expect(onSave).toHaveBeenCalledOnce()
  })

  it('calls onCancel when Cancel is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<CreateForm data={defaultData} onCancel={onCancel} onChange={vi.fn()} onSave={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledOnce()
  })
})
