export default function MacrosPill({ label, value }: { label: string, value: number }) {
  return (
    <span className="flex items-baseline gap-1.5 rounded-lg border border-smoke/15 bg-smoke/8 px-3 py-1.5">
      <span className="text-sm font-medium text-bark/90">{value}g</span>
      <span className="text-[9px] tracking-[0.1em] text-smoke/45 uppercase">{label}</span>
    </span>
  )
}