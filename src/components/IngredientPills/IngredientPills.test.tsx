import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { render, screen } from '../../test-utils'
import IngredientPills from './IngredientPills'
import type { Ingredient } from './IngredientPills.types'

describe('IngredientPills', () => {
  it('renders the Ingredients label', () => {
    render(<IngredientPills onChange={vi.fn()} value={[]} />)
    expect(screen.getByText('Ingredients')).toBeInTheDocument()
  })

  it('renders existing ingredients with their quantities', () => {
    const ingredients: Ingredient[] = [{ name: 'Chicken', quantity: '200g' }]
    render(<IngredientPills onChange={vi.fn()} value={ingredients} />)
    expect(screen.getByText('Chicken')).toBeInTheDocument()
    expect(screen.getByText('200g')).toBeInTheDocument()
  })

  it('calls onChange with the new ingredient when + is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<IngredientPills onChange={onChange} value={[]} />)
    await user.type(screen.getByPlaceholderText('Ingredient name'), 'Chicken')
    await user.type(screen.getByPlaceholderText('Qty (e.g. 200g)'), '200g')
    await user.click(screen.getByRole('button', { name: '+' }))
    expect(onChange).toHaveBeenCalledWith([{ name: 'Chicken', quantity: '200g' }])
  })

  it('calls onChange without the removed ingredient when × is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const ingredients: Ingredient[] = [{ name: 'Chicken', quantity: '200g' }]
    render(<IngredientPills onChange={onChange} value={ingredients} />)
    await user.click(screen.getByRole('button', { name: '×' }))
    expect(onChange).toHaveBeenCalledWith([])
  })
})
