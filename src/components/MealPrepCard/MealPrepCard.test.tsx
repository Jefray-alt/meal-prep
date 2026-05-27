import { describe, expect, it } from 'vitest'

import type { MealPrepSummary } from './MealPrepCard.types'

import { render, screen } from '../../test-utils'
import MealPrepCard from './MealPrepCard'

const base: MealPrepSummary = {
  carbs: 80,
  fat: 38,
  id: 'meal-1',
  protein: 142,
  tags: [{ id: 'tag-1', name: 'High-protein' }],
  title: 'High-protein Sunday batch',
}

describe('MealPrepCard', () => {
  it('renders title, tag pill, and all three macro values when all macros present', () => {
    render(<MealPrepCard mealPrep={base} />)
    expect(screen.getByText('High-protein Sunday batch')).toBeInTheDocument()
    expect(screen.getByText('High-protein')).toBeInTheDocument()
    expect(screen.getByText('142g protein')).toBeInTheDocument()
    expect(screen.getByText('80g carbs')).toBeInTheDocument()
    expect(screen.getByText('38g fat')).toBeInTheDocument()
  })

  it('renders only non-null macro values when some macros are null', () => {
    render(<MealPrepCard mealPrep={{ ...base, carbs: null }} />)
    expect(screen.getByText('142g protein')).toBeInTheDocument()
    expect(screen.queryByText(/carbs/)).not.toBeInTheDocument()
    expect(screen.getByText('38g fat')).toBeInTheDocument()
  })

  it('does not render macro row when all macros are null', () => {
    render(<MealPrepCard mealPrep={{ ...base, carbs: null, fat: null, protein: null }} />)
    expect(screen.queryAllByText(/g protein|g carbs|g fat/)).toHaveLength(0)
  })

  it('shows first tag pill and overflow count for multiple tags', () => {
    const mealPrep = {
      ...base,
      tags: [
        { id: 'tag-1', name: 'High-protein' },
        { id: 'tag-2', name: 'Bulk' },
        { id: 'tag-3', name: 'Weekly' },
      ],
    }
    render(<MealPrepCard mealPrep={mealPrep} />)
    expect(screen.getByText('High-protein')).toBeInTheDocument()
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('shows only the first tag pill with no overflow when there is one tag', () => {
    render(<MealPrepCard mealPrep={base} />)
    expect(screen.getByText('High-protein')).toBeInTheDocument()
    expect(screen.queryByText(/^\+\d/)).not.toBeInTheDocument()
  })
})
