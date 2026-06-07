export type GeargraftBaseId = 'driftboots' | 'phaseblade' | 'railmantle' | 'voidgauntlet'
export type GeargraftCatalystId = 'cryo-salt' | 'echo-amber' | 'null-glass' | 'solar-flux'
export interface GeargraftCraft {
  base: GeargraftBaseId
  catalyst: GeargraftCatalystId
  finish: GeargraftFinishId
  palette: GeargraftPaletteId
  rune: GeargraftRuneId
}
export type GeargraftFinishId = 'anodized' | 'cerakote' | 'prismatic' | 'smoked'
export interface GeargraftOperatorSettings {
  forgeTemperature: number
  materialStock: number
  qualityFloor: number
  season: string
  signatureRequired: boolean
}

export interface GeargraftOption<T extends string> {
  id: T
  label: string
  line: string
  score: number
}

export type GeargraftPaletteId = 'acid-gold' | 'ember-cyan' | 'frost-rose' | 'ion-violet'

export type GeargraftRuneId = 'blink' | 'harvest' | 'overclock' | 'ward'

export const equipmentBases: GeargraftOption<GeargraftBaseId>[] = [
  { id: 'phaseblade', label: 'Phaseblade Mk IV', line: 'Melee permit skin with edge bloom.', score: 18 },
  { id: 'railmantle', label: 'Rail Mantle', line: 'Back slot cloak with coil vents.', score: 13 },
  { id: 'voidgauntlet', label: 'Void Gauntlet', line: 'Casting glove for pulse effects.', score: 16 },
  { id: 'driftboots', label: 'Drift Boots', line: 'Traversal skin with skid trails.', score: 11 },
]

export const materialFinishes: GeargraftOption<GeargraftFinishId>[] = [
  { id: 'anodized', label: 'Anodized Titanium', line: 'Stable, clean, easy to verify.', score: 9 },
  { id: 'cerakote', label: 'Black Cerakote', line: 'Hard shell, low reflectance.', score: 7 },
  { id: 'prismatic', label: 'Prismatic Inlay', line: 'High pop, higher forge stress.', score: 15 },
  { id: 'smoked', label: 'Smoked Iridium', line: 'Rare shadow passivation.', score: 13 },
]

export const runeOrnaments: GeargraftOption<GeargraftRuneId>[] = [
  { id: 'overclock', label: 'Overclock Sigil', line: 'Adds haste and heat shimmer.', score: 14 },
  { id: 'ward', label: 'Ward Lattice', line: 'Defensive permit glyphing.', score: 8 },
  { id: 'blink', label: 'Blink Knot', line: 'Mobility trail ornament.', score: 12 },
  { id: 'harvest', label: 'Harvest Spiral', line: 'Resource aura and bright trim.', score: 10 },
]

export const catalysts: GeargraftOption<GeargraftCatalystId>[] = [
  { id: 'solar-flux', label: 'Solar Flux', line: 'Raises output, demands cooling.', score: 15 },
  { id: 'cryo-salt', label: 'Cryo Salt', line: 'Safer temper, lower volatility.', score: 6 },
  { id: 'echo-amber', label: 'Echo Amber', line: 'Boosts inscription resonance.', score: 11 },
  { id: 'null-glass', label: 'Null Glass', line: 'Mythic catalyst, brittle window.', score: 19 },
]

export const palettes: GeargraftOption<GeargraftPaletteId>[] = [
  { id: 'ember-cyan', label: 'Ember / Cyan', line: 'Forge heat against arc light.', score: 8 },
  { id: 'ion-violet', label: 'Ion / Violet', line: 'High energy esports trim.', score: 12 },
  { id: 'acid-gold', label: 'Acid / Gold', line: 'Toxic legendary contrast.', score: 14 },
  { id: 'frost-rose', label: 'Frost / Rose', line: 'Cold polish with warm rune.', score: 9 },
]

export const defaultCraft: GeargraftCraft = {
  base: 'phaseblade',
  catalyst: 'echo-amber',
  finish: 'smoked',
  palette: 'ember-cyan',
  rune: 'overclock',
}

export const defaultOperatorSettings: GeargraftOperatorSettings = {
  forgeTemperature: 61,
  materialStock: 38,
  qualityFloor: 70,
  season: 'Emberwake S3',
  signatureRequired: true,
}

export function craftLabel(craft: GeargraftCraft) {
  const base = findOption(equipmentBases, craft.base)
  const finish = findOption(materialFinishes, craft.finish)
  const rune = findOption(runeOrnaments, craft.rune)

  return `${finish.label.split(' ')[0]} ${base.label} - ${rune.label}`
}

export function findOption<T extends string>(options: GeargraftOption<T>[], id: T) {
  return options.find((option) => option.id === id) ?? options[0]
}

export function scoreCraft(craft: GeargraftCraft, settings: GeargraftOperatorSettings) {
  const base = findOption(equipmentBases, craft.base)
  const finish = findOption(materialFinishes, craft.finish)
  const rune = findOption(runeOrnaments, craft.rune)
  const catalyst = findOption(catalysts, craft.catalyst)
  const palette = findOption(palettes, craft.palette)
  const recipeScore = base.score + finish.score + rune.score + catalyst.score + palette.score
  const heatPenalty = Math.max(0, settings.forgeTemperature - 68)
  const stockPenalty = Math.max(0, 26 - settings.materialStock)
  const risk = Math.min(96, Math.round(recipeScore * 0.82 + heatPenalty + stockPenalty))
  const stability = Math.max(4, 100 - risk)
  const quality = Math.min(100, Math.round(recipeScore + stability * 0.42 + settings.materialStock * 0.18))
  const rarity = quality >= 92 ? 'Mythic' : quality >= 82 ? 'Legendary' : quality >= 70 ? 'Rare' : 'Prototype'
  const compatibility = [
    base.id === 'phaseblade' || rune.id === 'overclock' ? 'Arena melee' : 'Open-world traversal',
    catalyst.id === 'cryo-salt' ? 'Low heat rule sets' : 'High energy lobbies',
    finish.id === 'prismatic' || palette.id === 'acid-gold' ? 'Showcase skins' : 'Ranked inventory',
  ]
  const warnings = [
    ...(quality < settings.qualityFloor
      ? [`Quality ${quality} is below the operator floor ${settings.qualityFloor}.`]
      : []),
    ...(settings.materialStock < 25 ? ['Material stock is below the minimum launch buffer.'] : []),
    ...(risk > 72 ? ['Forge risk is high; require creator review before public mint.'] : []),
  ]

  return {
    compatibility,
    quality,
    rarity,
    risk,
    stability,
    stats: {
      control: Math.min(99, base.score + finish.score + 48),
      flair: Math.min(99, palette.score + rune.score + 52),
      tempo: Math.min(99, catalyst.score + rune.score + 44),
    },
    warnings,
  }
}
