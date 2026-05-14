import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import type { CreateFormData } from '../../components/CreateForm/CreateForm.types'

import CreateForm from '../../components/CreateForm/CreateForm'
import Header from '../../components/Header/Header'

const INITIAL_DATA: CreateFormData = {
  carbs: '',
  fat: '',
  ingredients: [],
  instructions: '',
  protein: '',
  tags: [],
  title: '',
}

const VALIDATABLE_FIELDS: (keyof CreateFormData)[] = ['ingredients', 'instructions', 'tags', 'title']

export default function Create() {
  const navigate = useNavigate()
  const [data, setData] = useState<CreateFormData>(INITIAL_DATA)
  const [touched, setTouched] = useState<Set<keyof CreateFormData>>(new Set())

  const errors = useMemo(() => validate(data, touched), [data, touched])

  const handleChange = (patch: Partial<CreateFormData>) => {
    setData((prev) => ({ ...prev, ...patch }))

    if ('ingredients' in patch && patch.ingredients?.length === 0) {
      setTouched((prev) => new Set([...prev, 'ingredients']))
    }
    if ('tags' in patch && patch.tags?.length === 0) {
      setTouched((prev) => new Set([...prev, 'tags']))
    }
  }

  const handleBlur = (field: keyof CreateFormData) => {
    setTouched((prev) => new Set([...prev, field]))
  }

  const handleSave = () => {
    const allTouched = new Set([...touched, ...VALIDATABLE_FIELDS])
    setTouched(allTouched)

    if (Object.keys(validate(data, allTouched)).length > 0) return

    const normalized = {
      ...data,
      carbs: data.carbs.trim() || '0',
      fat: data.fat.trim() || '0',
      protein: data.protein.trim() || '0',
    }
    console.log(normalized)
    void navigate('/meal-preps')
  }

  return (
    <div
      className="relative flex min-h-dvh flex-col overflow-hidden bg-char text-bark antialiased"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div aria-hidden="true" className="grain-overlay" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-0 h-175 w-175 -translate-x-1/2 translate-y-1/2 rounded-full bg-ember opacity-[0.04] blur-[160px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-0 top-0 h-125 w-125 translate-x-1/2 -translate-y-1/2 rounded-full bg-moss opacity-[0.04] blur-[140px]"
      />

      <Header />

      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-6 py-14">
          <p className="mb-3 text-[10px] tracking-[0.35em] text-ember/50 uppercase">
            Create your own
          </p>
          <h1
            className="text-5xl font-light italic leading-[1.1] text-bark sm:text-6xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            New Meal Prep
          </h1>

          <CreateForm
            data={data}
            errors={errors}
            onBlur={handleBlur}
            onCancel={() => { void navigate('/') }}
            onChange={handleChange}
            onSave={handleSave}
          />
        </div>
      </main>
    </div>
  )
}

function validate(
  data: CreateFormData,
  touched: Set<keyof CreateFormData>,
): Partial<Record<keyof CreateFormData, string>> {
  const errors: Partial<Record<keyof CreateFormData, string>> = {}

  if (touched.has('title')) {
    if (!data.title.trim()) errors.title = 'Title is required'
    else if (data.title.length > 100) errors.title = 'Title must be 100 characters or less'
  }

  if (touched.has('instructions')) {
    if (!data.instructions.trim()) errors.instructions = 'Instructions are required'
    else if (data.instructions.length > 1000) errors.instructions = 'Instructions must be 1000 characters or less'
  }

  if (touched.has('ingredients') && data.ingredients.length === 0) {
    errors.ingredients = 'Add at least one ingredient'
  }

  if (touched.has('tags') && data.tags.length === 0) {
    errors.tags = 'Add at least one tag'
  }

  return errors
}
