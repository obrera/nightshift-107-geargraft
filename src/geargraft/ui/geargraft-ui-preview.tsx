import type { GeargraftCraft, GeargraftOperatorSettings } from '@/geargraft/data-access/geargraft-model'

import { craftLabel, scoreCraft } from '@/geargraft/data-access/geargraft-model'
import { createGeargraftSvg, svgDataUri } from '@/geargraft/util/geargraft-svg'

export function GeargraftUiPreview({
  craft,
  settings,
}: {
  craft: GeargraftCraft
  settings: GeargraftOperatorSettings
}) {
  const score = scoreCraft(craft, settings)
  const image = svgDataUri(createGeargraftSvg(craft, settings))

  return (
    <section className="rounded-md border border-cyan-300/30 bg-zinc-950 p-4 shadow-[0_0_42px_rgba(8,145,178,.18)]">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="aspect-square w-full max-w-[360px] shrink-0 overflow-hidden rounded-md border border-zinc-700 bg-black">
          <img alt={craftLabel(craft)} className="h-full w-full object-cover" src={image} />
        </div>
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-orange-300 uppercase">Playable Equipment Skin</p>
            <h1 className="mt-2 text-3xl font-black text-zinc-50 sm:text-4xl">{craftLabel(craft)}</h1>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Metric label="Rarity" value={score.rarity} />
            <Metric label="Stability" value={`${score.stability}%`} />
            <Metric label="Risk" value={`${score.risk}%`} />
            <Metric label="Quality" value={`${score.quality}`} />
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <Metric label="Control" value={score.stats.control.toString()} />
            <Metric label="Flair" value={score.stats.flair.toString()} />
            <Metric label="Tempo" value={score.stats.tempo.toString()} />
          </div>
          <div className="flex flex-wrap gap-2">
            {score.compatibility.map((item) => (
              <span
                className="rounded border border-cyan-300/30 bg-cyan-950/35 px-2 py-1 text-xs text-cyan-100"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/78 p-3">
      <div className="text-[0.68rem] font-black tracking-[0.16em] text-zinc-500 uppercase">{label}</div>
      <div className="mt-1 text-lg font-black text-zinc-50">{value}</div>
    </div>
  )
}
