export default function MealPrepDetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading meal prep" className="animate-pulse" role="status">
      <div className="mb-10 h-4 w-24 rounded-full bg-bark/20" />
      <div className="mb-2 h-3 w-20 rounded-full bg-bark/15" />
      <div className="mb-4 h-12 w-2/3 rounded-full bg-bark/20" />
      <div className="mb-6 flex gap-2">
        <div className="h-5 w-20 rounded-full bg-smoke/15" />
        <div className="h-5 w-16 rounded-full bg-smoke/15" />
      </div>
      <div className="mb-10 flex gap-2">
        <div className="h-6 w-24 rounded-full bg-bark/15" />
        <div className="h-6 w-20 rounded-full bg-bark/15" />
        <div className="h-6 w-16 rounded-full bg-bark/15" />
      </div>
      <div className="mb-8">
        <div className="mb-3 h-3 w-28 rounded-full bg-bark/20" />
        <div className="space-y-2">
          <div className="h-4 w-48 rounded-full bg-bark/15" />
          <div className="h-4 w-40 rounded-full bg-bark/15" />
          <div className="h-4 w-44 rounded-full bg-bark/15" />
        </div>
      </div>
      <div>
        <div className="mb-3 h-3 w-28 rounded-full bg-bark/20" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded-full bg-bark/15" />
          <div className="h-4 w-4/5 rounded-full bg-bark/15" />
          <div className="h-4 w-3/4 rounded-full bg-bark/15" />
        </div>
      </div>
    </div>
  )
}
