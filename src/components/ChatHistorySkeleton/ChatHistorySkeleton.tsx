export default function ChatHistorySkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <div className="flex justify-end">
        <div className="h-10 w-48 animate-pulse rounded-2xl rounded-tr-sm bg-ember/10 ring-1 ring-ember/20" />
      </div>
      <div className="flex items-start gap-3">
        <div className="mt-1 h-7 w-7 shrink-0 animate-pulse rounded bg-ember/10" />
        <div className="h-16 w-72 animate-pulse rounded-2xl rounded-tl-sm bg-ash ring-1 ring-bark/10" />
      </div>
      <div className="flex justify-end">
        <div className="h-10 w-36 animate-pulse rounded-2xl rounded-tr-sm bg-ember/10 ring-1 ring-ember/20" />
      </div>
    </div>
  )
}
