import type { GeargraftCraft, GeargraftPaletteId } from '@/geargraft/data-access/geargraft-model'

import { craftLabel, findOption, palettes, scoreCraft } from '@/geargraft/data-access/geargraft-model'

const paletteColors: Record<GeargraftPaletteId, { accent: string; glow: string; hot: string; steel: string }> = {
  'acid-gold': { accent: '#d8ff42', glow: '#f7b733', hot: '#ff6b35', steel: '#151816' },
  'ember-cyan': { accent: '#35e8ff', glow: '#ff8a32', hot: '#ff4f1f', steel: '#171b20' },
  'frost-rose': { accent: '#8fe7ff', glow: '#ff6ea8', hot: '#f8b5cf', steel: '#161d24' },
  'ion-violet': { accent: '#45f4ff', glow: '#8f5cff', hot: '#ff4fd8', steel: '#141722' },
}

export function createGeargraftSvg(
  craft: GeargraftCraft,
  settings = {
    forgeTemperature: 61,
    materialStock: 38,
    qualityFloor: 70,
    season: 'Emberwake S3',
    signatureRequired: true,
  },
) {
  const colors = paletteColors[craft.palette]
  const score = scoreCraft(craft, settings)
  const palette = findOption(palettes, craft.palette)
  const label = svgEscape(craftLabel(craft))
  const runePath =
    craft.rune === 'ward'
      ? 'M256 160 L324 206 L300 326 L256 364 L212 326 L188 206 Z'
      : craft.rune === 'blink'
        ? 'M190 330 C250 250 224 214 318 148 C284 232 314 266 226 370'
        : craft.rune === 'harvest'
          ? 'M256 158 C342 196 320 334 238 350 C172 330 184 226 258 232 C318 238 302 310 250 314'
          : 'M176 314 L244 152 L230 266 L336 200 L272 360 L286 246 Z'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="${label}">
  <defs>
    <radialGradient id="heat" cx="50%" cy="42%" r="58%"><stop offset="0" stop-color="${colors.glow}" stop-opacity=".9"/><stop offset=".42" stop-color="${colors.accent}" stop-opacity=".28"/><stop offset="1" stop-color="#050607"/></radialGradient>
    <linearGradient id="steel" x1="0" x2="1"><stop offset="0" stop-color="${colors.steel}"/><stop offset=".5" stop-color="#2d3740"/><stop offset="1" stop-color="#0a0d10"/></linearGradient>
    <filter id="flare"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="512" height="512" rx="42" fill="#050607"/>
  <rect x="28" y="28" width="456" height="456" rx="28" fill="url(#heat)" stroke="${colors.accent}" stroke-opacity=".42"/>
  <path d="M86 388 C144 324 172 244 224 106 L292 106 C340 248 368 322 426 388 L392 420 C332 374 294 330 256 246 C218 330 180 374 120 420 Z" fill="url(#steel)" stroke="${colors.accent}" stroke-width="5"/>
  <path d="${runePath}" fill="none" stroke="${colors.hot}" stroke-linecap="round" stroke-linejoin="round" stroke-width="12" filter="url(#flare)"/>
  <circle cx="256" cy="246" r="78" fill="none" stroke="${colors.accent}" stroke-dasharray="16 12" stroke-width="4" opacity=".72"/>
  <path d="M110 116 H402 M110 396 H402" stroke="${colors.glow}" stroke-width="6" stroke-linecap="round" opacity=".72"/>
  <text x="256" y="454" fill="#effbff" font-family="Roboto, Arial, sans-serif" font-size="20" font-weight="700" text-anchor="middle">${label}</text>
  <text x="256" y="82" fill="${colors.accent}" font-family="Roboto, Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle">${svgEscape(score.rarity)} / ${svgEscape(palette.label)}</text>
</svg>`
}

export function svgDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function svgEscape(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}
