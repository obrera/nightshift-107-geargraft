import type { GeargraftCraft, GeargraftOperatorSettings } from '@/geargraft/data-access/geargraft-model'

import { scoreCraft } from '@/geargraft/data-access/geargraft-model'

export function GeargraftUiOperator({
  craft,
  settings,
  updateSettings,
}: {
  craft: GeargraftCraft
  settings: GeargraftOperatorSettings
  updateSettings: (settings: GeargraftOperatorSettings) => void
}) {
  const score = scoreCraft(craft, settings)
  const ready = score.warnings.length === 0

  return (
    <section className="rounded-md border border-zinc-800 bg-zinc-950/86 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-black tracking-[0.16em] text-orange-300 uppercase">Operator Rule Rack</h2>
          <p className="mt-1 text-sm text-zinc-400">Tune supply gates and season constraints before minting.</p>
        </div>
        <span className={ready ? 'text-sm font-bold text-cyan-200' : 'text-sm font-bold text-orange-300'}>
          {ready ? 'Ready' : 'Invalid'}
        </span>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <RangeField
          label="Forge heat"
          max={90}
          min={35}
          setValue={(forgeTemperature) => updateSettings({ ...settings, forgeTemperature })}
          value={settings.forgeTemperature}
        />
        <RangeField
          label="Material stock"
          max={80}
          min={0}
          setValue={(materialStock) => updateSettings({ ...settings, materialStock })}
          value={settings.materialStock}
        />
        <RangeField
          label="Quality floor"
          max={96}
          min={45}
          setValue={(qualityFloor) => updateSettings({ ...settings, qualityFloor })}
          value={settings.qualityFloor}
        />
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          className="h-10 rounded-md border border-zinc-700 bg-black px-3 text-sm text-zinc-100 outline-none focus:border-cyan-300"
          onChange={(event) => updateSettings({ ...settings, season: event.target.value })}
          value={settings.season}
        />
        <label className="flex h-10 items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-200">
          <input
            checked={settings.signatureRequired}
            onChange={(event) => updateSettings({ ...settings, signatureRequired: event.target.checked })}
            type="checkbox"
          />
          Require proof signature
        </label>
      </div>
      <div className="mt-4 space-y-2">
        {(score.warnings.length
          ? score.warnings
          : ['Supply, quality, and risk constraints are inside the active recipe window.']
        ).map((warning) => (
          <div
            className="rounded border border-orange-300/25 bg-orange-950/20 px-3 py-2 text-sm text-orange-100"
            key={warning}
          >
            {warning}
          </div>
        ))}
      </div>
    </section>
  )
}

function RangeField({
  label,
  max,
  min,
  setValue,
  value,
}: {
  label: string
  max: number
  min: number
  setValue: (value: number) => void
  value: number
}) {
  return (
    <label className="space-y-2">
      <span className="flex justify-between text-xs font-bold text-zinc-300">
        {label}
        <span className="text-cyan-200">{value}</span>
      </span>
      <input
        className="w-full accent-cyan-300"
        max={max}
        min={min}
        onChange={(event) => setValue(Number(event.target.value))}
        type="range"
        value={value}
      />
    </label>
  )
}
