// Extracted so the wrap-around index math can be unit tested without mounting a component.
export function getNextIndicatorIndex(index: number, total: number): number {
  return index < total - 1 ? index + 1 : 0
}

export function getPreviousIndicatorIndex(index: number, total: number): number {
  return index > 0 ? index - 1 : total - 1
}

// Note: when `max < min` (e.g. an empty carousel), this clamps to `max`, not `min`.
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
