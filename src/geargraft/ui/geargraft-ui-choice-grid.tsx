import type { GeargraftOption } from '@/geargraft/data-access/geargraft-model'

import { cn } from '@/core/util/utils'

export function GeargraftUiChoiceGrid<T extends string>({
  label,
  options,
  select,
  value,
}: {
  label: string
  options: GeargraftOption<T>[]
  select: (value: T) => void
  value: T
}) {
  return (
    <section className="space-y-2">
      <h2 className="text-xs font-black tracking-[0.18em] text-cyan-200 uppercase">{label}</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <button
            className={cn(
              'min-h-24 rounded-md border bg-zinc-950/78 p-3 text-left transition hover:border-cyan-300/70 hover:bg-cyan-950/24',
              option.id === value ? 'border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,.22)]' : 'border-zinc-700/80',
            )}
            key={option.id}
            onClick={() => select(option.id)}
            type="button"
          >
            <span className="block text-sm font-bold text-zinc-50">{option.label}</span>
            <span className="mt-1 block text-xs leading-5 text-zinc-400">{option.line}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
