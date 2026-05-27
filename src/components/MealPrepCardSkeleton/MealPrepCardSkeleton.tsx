export default function MealPrepCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-smoke/15 bg-ash/50 p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="h-4 w-40 rounded-full bg-bark/20" />
        <div className="h-4 w-16 rounded-full bg-smoke/15" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-5 w-20 rounded-full bg-bark/15" />
        <div className="h-5 w-16 rounded-full bg-bark/15" />
        <div className="h-5 w-12 rounded-full bg-bark/15" />
      </div>
    </div>
  )
}
