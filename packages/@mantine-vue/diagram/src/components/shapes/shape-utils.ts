import type { DiagramStyle } from '../../core/types'

export interface ShapeAttrs {
  fill: string
  stroke: string
  'stroke-width': number
  'stroke-dasharray'?: string
  'fill-opacity'?: number
  'stroke-linejoin': 'round'
}

/** SVG presentation attributes for a style, with theme aware defaults from CSS variables. */
export function getShapeAttrs(
  style: DiagramStyle | undefined,
  resolveColor: (color: string | undefined) => string | undefined,
  defaults: { fill?: string; stroke?: string; strokeWidth?: number } = {},
): ShapeAttrs {
  const attrs: ShapeAttrs = {
    fill: resolveColor(style?.fill) ?? defaults.fill ?? 'var(--diagram-node-fill)',
    stroke: resolveColor(style?.stroke) ?? defaults.stroke ?? 'var(--diagram-node-stroke)',
    'stroke-width': style?.strokeWidth ?? defaults.strokeWidth ?? 1.5,
    'stroke-linejoin': 'round',
  }

  if (style?.strokeDasharray) {
    attrs['stroke-dasharray'] = style.strokeDasharray
  }

  if (style?.fillOpacity !== undefined) {
    attrs['fill-opacity'] = style.fillOpacity
  }

  return attrs
}

/** CSS filter of a node shadow, `undefined` without one. */
export function getShadowFilter(
  style: DiagramStyle | undefined,
  resolveColor: (color: string | undefined) => string | undefined,
) {
  const shadow = style?.shadow

  if (!shadow) {
    return undefined
  }

  if (shadow === true) {
    return 'drop-shadow(var(--diagram-node-shadow))'
  }

  const color = resolveColor(shadow.color) ?? 'rgba(0, 0, 0, 0.25)'

  return `drop-shadow(${shadow.x ?? 0}px ${shadow.y ?? 2}px ${shadow.blur ?? 6}px ${color})`
}

const SCHEME = /^([a-z][a-z0-9+.-]*):/i
const SAFE_SCHEMES = new Set(['http', 'https', 'blob'])

/**
 * Whether a URL may be used as an image source: relative URLs, `http(s):`, `blob:` and image
 * data URLs. Everything else, e.g. `javascript:`, is rejected.
 */
export function isSafeImageUrl(url: unknown): url is string {
  if (typeof url !== 'string' || url.trim().length === 0) {
    return false
  }

  const trimmed = url.trim()
  const scheme = SCHEME.exec(trimmed)?.[1].toLowerCase()

  if (!scheme) {
    return true
  }

  return SAFE_SCHEMES.has(scheme) || /^data:image\//i.test(trimmed)
}

const PATH_DATA = /^[MmLlHhVvCcSsQqTtAaZz0-9eE.,+\-\s]*$/

/** Keeps SVG path data that only contains path commands and numbers. */
export function sanitizePathData(d: unknown): string {
  return typeof d === 'string' && PATH_DATA.test(d) ? d : ''
}

export const pointsAttr = (points: readonly { x: number; y: number }[]) =>
  points.map((p) => `${Math.round(p.x * 100) / 100},${Math.round(p.y * 100) / 100}`).join(' ')
