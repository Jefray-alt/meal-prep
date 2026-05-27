import { Link } from 'react-router'

import type { MealPrepCardProps } from './MealPrepCard.types'

export default function MealPrepCard({ mealPrep }: MealPrepCardProps) {
  const { carbs, fat, id, protein, tags, title } = mealPrep
  const hasMacros = protein !== null || carbs !== null || fat !== null

  return (
    <Link
      aria-label={`View ${title}`}
      className="block rounded-xl border border-smoke/15 bg-ash/50 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
      to={`/meal-preps/${id}`}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <span
          className="font-light italic text-bark"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </span>
        <div className="flex shrink-0 items-center gap-1.5">
          {tags.length > 0 && (
            <span className="rounded-full border border-smoke/20 px-2 py-0.5 text-[9px] tracking-[0.15em] text-smoke/50 uppercase">
              {tags[0].name}
            </span>
          )}
          {tags.length > 1 && (
            <span className="rounded-full border border-smoke/20 px-2 py-0.5 text-[9px] tracking-[0.15em] text-smoke/50 uppercase">
              +{tags.length - 1}
            </span>
          )}
        </div>
      </div>
      {hasMacros && (
        <div className="flex flex-wrap items-center gap-2">
          {protein !== null && (
            <span className="rounded-full border border-smoke/15 px-2.5 py-0.5 text-[10px] text-smoke/60">
              {protein}g protein
            </span>
          )}
          {carbs !== null && (
            <span className="rounded-full border border-smoke/15 px-2.5 py-0.5 text-[10px] text-smoke/60">
              {carbs}g carbs
            </span>
          )}
          {fat !== null && (
            <span className="rounded-full border border-smoke/15 px-2.5 py-0.5 text-[10px] text-smoke/60">
              {fat}g fat
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
