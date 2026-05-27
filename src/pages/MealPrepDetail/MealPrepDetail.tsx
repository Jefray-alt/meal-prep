import { Button } from '@heroui/react'
import { Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

import type { MealPrepDetail as MealPrepDetailType } from './MealPrepDetail.types'

import Header from '../../components/Header/Header'
import MacrosPill from '../../components/MacrosPill/MacrosPill'
import MealPrepDetailSkeleton from '../../components/MealPrepDetailSkeleton/MealPrepDetailSkeleton'
import { apiClient } from '../../lib/clients/api/api.client'

type Status = 'error' | 'loading' | 'not-found' | 'success'

export default function MealPrepDetail() {
  const { id = '' } = useParams<{ id: string }>()
  const [status, setStatus] = useState<Status>('loading')
  const [mealPrep, setMealPrep] = useState<MealPrepDetailType | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient(`/meal-preps/${id}`)
        if (res.status === 404) { setStatus('not-found'); return }
        if (!res.ok) { setStatus('error'); return }
        const body = (await res.json()) as MealPrepDetailType
        setMealPrep(body)
        setStatus('success')
      } catch {
        setStatus('error')
      }
    }
    void load()
  }, [id])

  return (
    <div
      className="relative flex h-dvh flex-col overflow-hidden bg-char text-bark antialiased"
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
        <div className="mx-auto max-w-4xl px-6 py-14">

          {status === 'loading' && <MealPrepDetailSkeleton />}

          {status === 'not-found' && (
            <div role="alert">
              <p className="text-sm text-smoke/60">Meal prep not found.</p>
              <Link
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-ember/30 px-5 py-2 text-[11px] tracking-[0.18em] text-ember/70 uppercase transition-all duration-200 hover:border-ember/60 hover:text-ember"
                to="/meal-preps"
              >
                ← Back to meal preps
              </Link>
            </div>
          )}

          {status === 'error' && (
            <p className="text-sm text-smoke/60" role="alert">
              Something went wrong. Try refreshing.
            </p>
          )}

          {status === 'success' && mealPrep && (
            <>
              <div className="mb-10 flex items-center justify-between">
                <Link
                  className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] text-smoke/50 uppercase transition-colors hover:text-smoke/80"
                  to="/meal-preps"
                >
                  ← Back
                </Link>
                <div className="flex items-center gap-1">
                  <Button
                    aria-label={`Edit ${mealPrep.title}`}
                    className="h-auto min-w-0 rounded-full p-2 text-smoke/50 hover:bg-smoke/8 hover:text-smoke/80"
                    isIconOnly
                    onPress={() => { console.log('edit') }}
                    variant="ghost"
                  >
                    <Pencil size={15} strokeWidth={1.5} />
                  </Button>
                  <Button
                    aria-label={`Delete ${mealPrep.title}`}
                    className="h-auto min-w-0 rounded-full p-2 text-smoke/50 hover:bg-red-500/10 hover:text-red-400"
                    isIconOnly
                    onPress={() => { console.log('delete') }}
                    variant="ghost"
                  >
                    <Trash2 size={15} strokeWidth={1.5} />
                  </Button>
                </div>
              </div>

              <p className="mb-3 text-[10px] tracking-[0.35em] text-ember/50 uppercase">
                Meal prep
              </p>
              <h1
                className="text-5xl font-light italic leading-[1.1] text-bark sm:text-6xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {mealPrep.title}
              </h1>

              {mealPrep.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {mealPrep.tags.map((tag) => (
                    <span
                      className="rounded-full border border-ember/25 bg-ember/10 px-3 py-0.5 text-[9px] tracking-[0.15em] text-ember/65 uppercase"
                      key={tag.id}
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              {(mealPrep.protein !== null || mealPrep.carbs !== null || mealPrep.fat !== null) && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {mealPrep.protein !== null && (
                    <MacrosPill label="protein" value={mealPrep.protein} />
                  )}
                  {mealPrep.carbs !== null && (
                    <MacrosPill label="carbs" value={mealPrep.carbs} />
                  )}
                  {mealPrep.fat !== null && (
                    <MacrosPill label="fat" value={mealPrep.fat} />
                  )}
                </div>
              )}

              {mealPrep.ingredients.length > 0 && (
                <section className="mt-10">
                  <p className="mb-3 text-[10px] tracking-[0.35em] text-ember/50 uppercase">
                    Ingredients
                  </p>
                  <ul className="space-y-2">
                    {mealPrep.ingredients.map((ing, i) => (
                      <li className="text-sm text-smoke/70" key={i}>
                        <span className="text-bark/80">{ing.quantity}</span>
                        {' '}
                        {ing.name}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {mealPrep.instructions && (
                <section className="mt-10">
                  <p className="mb-3 text-[10px] tracking-[0.35em] text-ember/50 uppercase">
                    Instructions
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-smoke/70">
                    {mealPrep.instructions}
                  </p>
                </section>
              )}

            </>
          )}
        </div>
      </main>
    </div>
  )
}
