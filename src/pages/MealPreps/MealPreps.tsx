import { Button } from '@heroui/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import type { MealPrepSummary } from '../../components/MealPrepCard/MealPrepCard.types'

import Header from '../../components/Header/Header'
import MealPrepCard from '../../components/MealPrepCard/MealPrepCard'
import MealPrepCardSkeleton from '../../components/MealPrepCardSkeleton/MealPrepCardSkeleton'
import { apiClient } from '../../lib/clients/api/api.client'

interface ListResponse {
  data: MealPrepSummary[]
  nextCursor: null | string
}

export default function MealPreps() {
  const [status, setStatus] = useState<'error' | 'loading' | 'success'>('loading')
  const [loadingMore, setLoadingMore] = useState(false)
  const [mealPreps, setMealPreps] = useState<MealPrepSummary[]>([])
  const [nextCursor, setNextCursor] = useState<null | string>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient('/meal-preps?limit=20')
        if (!res.ok) { setStatus('error'); return }
        const body = (await res.json()) as ListResponse
        setMealPreps(body.data)
        setNextCursor(body.nextCursor)
        setStatus('success')
      } catch {
        setStatus('error')
      }
    }
    void load()
  }, [])

  const handleLoadMore = async () => {
    if (!nextCursor) return
    setLoadingMore(true)
    try {
      const res = await apiClient(`/meal-preps?limit=20&cursor=${nextCursor}`)
      if (!res.ok) { setStatus('error'); return }
      const body = (await res.json()) as ListResponse
      setMealPreps((prev) => [...prev, ...body.data])
      setNextCursor(body.nextCursor)
    } catch {
      setStatus('error')
    } finally {
      setLoadingMore(false)
    }
  }

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
          <p className="mb-3 text-[10px] tracking-[0.35em] text-ember/50 uppercase">
            Your collection
          </p>
          <h1
            className="text-5xl font-light italic leading-[1.1] text-bark sm:text-6xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            My Meal Preps
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-smoke/70">
            Meal plans you've refined through mise will appear here — saved, structured, and ready to revisit.
          </p>

          <div className="mt-12">
            {status === 'loading' && (
              <div
                aria-busy="true"
                aria-label="Loading meal preps"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                <MealPrepCardSkeleton />
                <MealPrepCardSkeleton />
                <MealPrepCardSkeleton />
              </div>
            )}

            {status === 'error' && (
              <p className="text-sm text-smoke/60" role="alert">
                Couldn't load your meal preps. Try refreshing.
              </p>
            )}

            {status === 'success' && mealPreps.length === 0 && (
              <div className="flex min-h-64 items-center justify-center">
                <div className="rounded-2xl border border-bark/10 bg-char/92 px-10 py-9 text-center shadow-sm backdrop-blur-sm">
                  <p
                    className="text-3xl font-light italic text-bark/60"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Nothing prepared yet
                  </p>
                  <p className="mt-2.5 text-xs leading-relaxed text-smoke/50">
                    Start a conversation and your refined meal plans will live here.
                  </p>
                  <Link
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-ember/30 px-5 py-2 text-[11px] tracking-[0.18em] text-ember/70 uppercase transition-all duration-200 hover:border-ember/60 hover:text-ember"
                    to="/"
                  >
                    ← Back to kitchen
                  </Link>
                </div>
              </div>
            )}

            {status === 'success' && mealPreps.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mealPreps.map((mp) => (
                    <MealPrepCard key={mp.id} mealPrep={mp} />
                  ))}
                </div>
                {nextCursor !== null && (
                  <div className="mt-8 flex justify-center">
                    <Button
                      isDisabled={loadingMore}
                      onPress={() => { void handleLoadMore() }}
                      variant="outline"
                    >
                      {loadingMore ? 'Loading…' : 'Load more'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
