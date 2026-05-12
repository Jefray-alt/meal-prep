import { Chip } from '@heroui/react'

export default function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between border-b border-bark/50 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded border border-ember/40 text-sm text-ember select-none">
          ◈
        </div>
        <span
          className="text-2xl font-light tracking-[0.15em] text-cream"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          mise
        </span>
        <Chip
          className="rounded border border-ember/25 px-1.5 py-px text-[9px] tracking-[0.15em] uppercase text-ember/55"
          color="accent"
          size="sm"
          variant="tertiary"
        >
          beta
        </Chip>
      </div>
      <p className="hidden text-[10px] tracking-[0.22em] text-smoke/55 sm:block">
        KITCHEN INTELLIGENCE
      </p>
    </header>
  )
}
