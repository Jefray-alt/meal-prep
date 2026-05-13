import { Link } from 'react-router'

import Header from '../../components/Header/Header'

const GHOST_CARDS = [
  { lines: [28, 75, 55, 65], opacity: 1, tag: 'High-protein' },
  { lines: [24, 60, 45, 70], opacity: 0.65, tag: 'Plant-based' },
  { lines: [20, 80, 50, 40], opacity: 0.35, tag: 'Budget week' },
]

export default function MealPreps() {
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

          <div className="relative mt-12">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {GHOST_CARDS.map(({ lines, opacity, tag }) => (
                <div
                  className="rounded-xl border border-smoke/15 bg-ash/50 p-6"
                  key={tag}
                  style={{ opacity }}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="h-1.5 w-16 rounded-full bg-ember/20" />
                    <div className="rounded-full border border-smoke/20 px-2 py-0.5 text-[9px] tracking-[0.15em] text-smoke/50 uppercase">
                      {tag}
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {lines.map((w, i) => (
                      <div
                        className="h-2 rounded-full bg-bark/60"
                        key={i}
                        style={{ width: `${w.toString()}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-7 flex items-center gap-3">
                    <div className="h-6 w-16 rounded-full bg-bark/50" />
                    <div className="h-6 w-10 rounded-full bg-bark/30" />
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="rounded-2xl border border-bark/10 bg-char/92 px-10 py-9 text-center backdrop-blur-sm shadow-sm">
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
          </div>
        </div>
      </main>
    </div>
  )
}
