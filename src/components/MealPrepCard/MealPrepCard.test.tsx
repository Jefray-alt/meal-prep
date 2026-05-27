import { describe, expect, it, vi } from 'vitest'

import type { MealPrepSummary } from './MealPrepCard.types'

import { render, screen } from '../../test-utils'
import MealPrepCard from './MealPrepCard'

vi.mock('../../components/MacrosPill/MacrosPill', () => ({
  __esModule: true,
  default: ({ label, value }: { label: string; value: number }) => (
    <div>
      <span>{value}g {label}</span>
    </div>
  ),
}))

const base: MealPrepSummary = {
  carbs: 80,
  fat: 38,
  firstTag: { id: 'tag-1', name: 'High-protein' },
  id: 'meal-1',
  protein: 142,
  tagCount: 1,
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
    render(<MealPrepCard mealPrep={{ ...base, firstTag: { id: 'tag-1', name: 'High-protein' }, tagCount: 3 }} />)
    expect(screen.getByText('High-protein')).toBeInTheDocument()
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('shows only the first tag pill with no overflow when there is one tag', () => {
    render(<MealPrepCard mealPrep={base} />)
    expect(screen.getByText('High-protein')).toBeInTheDocument()
    expect(screen.queryByText(/^\+\d/)).not.toBeInTheDocument()
  })

  it('renders no tag pills when firstTag is null and tagCount is 0', () => {
    render(<MealPrepCard mealPrep={{ ...base, firstTag: null, tagCount: 0 }} />)
    expect(screen.queryByText('High-protein')).not.toBeInTheDocument()
    expect(screen.queryByText(/^\+\d/)).not.toBeInTheDocument()
  })
})
