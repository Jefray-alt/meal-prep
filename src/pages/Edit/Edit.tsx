import { toast } from '@heroui/react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import type { MealPrepFormData, Tag } from '../../components/MealPrepForm/MealPrepForm.types'
import type { MealPrepDetail } from '../MealPrepDetail/MealPrepDetail.types'

import Header from '../../components/Header/Header'
import MealPrepDetailSkeleton from '../../components/MealPrepDetailSkeleton/MealPrepDetailSkeleton'
import MealPrepForm from '../../components/MealPrepForm/MealPrepForm'
import { apiClient } from '../../lib/clients/api/api.client'

type Status = 'error' | 'loading' | 'not-found' | 'success'

const INITIAL_DATA: MealPrepFormData = {
  carbs: '',
  fat: '',
  ingredients: [],
  instructions: '',
  protein: '',
  tags: [],
  title: '',
}

const VALIDATABLE_FIELDS: (keyof MealPrepFormData)[] = ['ingredients', 'instructions', 'tags', 'title']

export default function Edit() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [status, setStatus] = useState<Status>('loading')
  const [data, setData] = useState<MealPrepFormData>(INITIAL_DATA)
  const [touched, setTouched] = useState<Set<keyof MealPrepFormData>>(new Set())
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [serverError, setServerError] = useState<null | string>(null)

  const errors = useMemo(() => validate(data, touched), [data, touched])

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient(`/meal-preps/${id}`)
        if (res.status === 404) { setStatus('not-found'); return }
        if (!res.ok) { setStatus('error'); return }
        const body = (await res.json()) as MealPrepDetail
        setData({
          carbs: body.carbs != null ? String(body.carbs) : '',
          fat: body.fat != null ? String(body.fat) : '',
          ingredients: body.ingredients,
          instructions: body.instructions,
          protein: body.protein != null ? String(body.protein) : '',
          tags: body.tags.map((t) => t.name),
          title: body.title,
        })
        setSelectedTags(body.tags)
        setStatus('success')
      } catch {
        setStatus('error')
      }
    }
    void load()
  }, [id])

  const handleChange = (patch: Partial<MealPrepFormData>) => {
    setData((prev) => ({ ...prev, ...patch }))

    if ('ingredients' in patch && patch.ingredients?.length === 0) {
      setTouched((prev) => new Set([...prev, 'ingredients']))
    }
    if ('tags' in patch && patch.tags?.length === 0) {
      setTouched((prev) => new Set([...prev, 'tags']))
    }
  }

  const handleBlur = (field: keyof MealPrepFormData) => {
    setTouched((prev) => new Set([...prev, field]))
  }

  const handleTagSelect = (tag: Tag) => {
    setSelectedTags((prev) => [...prev, tag])
    handleChange({ tags: [...data.tags, tag.name] })
  }

  const handleTagRemove = (tag: Tag) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== tag.id))
    handleChange({ tags: data.tags.filter((n) => n !== tag.name) })
  }

  const handleSave = async () => {
    const allTouched = new Set([...touched, ...VALIDATABLE_FIELDS])
    setTouched(allTouched)

    if (Object.keys(validate(data, allTouched)).length > 0) return

    setIsSaving(true)
    setServerError(null)

    const res = await apiClient(`/meal-preps/${id}`, {
      body: JSON.stringify({
        carbs: parseFloat(data.carbs) || 0,
        fat: parseFloat(data.fat) || 0,
        ingredients: data.ingredients,
        instructions: data.instructions,
        protein: parseFloat(data.protein) || 0,
        tags: data.tags,
        title: data.title,
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
    })

    if (res.ok) {
      toast.success('Meal prep saved')
      void navigate(`/meal-preps/${id}`)
      return
    }

    setIsSaving(false)
    setServerError('Something went wrong. Please try again.')
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

          {status === 'loading' && <MealPrepDetailSkeleton />}

          {status === 'not-found' && (
            <p className="text-sm text-smoke/60" role="alert">Meal prep not found.</p>
          )}

          {status === 'error' && (
            <p className="text-sm text-smoke/60" role="alert">Something went wrong. Try refreshing.</p>
          )}

          {status === 'success' && (
            <>
              <p className="mb-3 text-[10px] tracking-[0.35em] text-ember/50 uppercase">
                Edit your own
              </p>
              <h1
                className="text-5xl font-light italic leading-[1.1] text-bark sm:text-6xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Edit Meal Prep
              </h1>

              <MealPrepForm
                data={data}
                errors={errors}
                isSaving={isSaving}
                onBlur={handleBlur}
                onCancel={() => { void navigate(`/meal-preps/${id}`) }}
                onChange={handleChange}
                onSave={() => { void handleSave() }}
                onTagRemove={handleTagRemove}
                onTagSelect={handleTagSelect}
                selectedTags={selectedTags}
                serverError={serverError}
              />
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function validate(
  data: MealPrepFormData,
  touched: Set<keyof MealPrepFormData>,
): Partial<Record<keyof MealPrepFormData, string>> {
  const errors: Partial<Record<keyof MealPrepFormData, string>> = {}

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
