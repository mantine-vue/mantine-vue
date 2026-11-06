import { unionRects, type Rect } from './geometry'

export type DiagramAlignment = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
export type DiagramDistribution = 'horizontal' | 'vertical'

export interface PositionedRect<K = string> {
  id: K
  rect: Rect
}

/**
 * Offsets that align rectangles to each other, or to `reference` when given.
 * Returns a map from id to the `[dx, dy]` to apply.
 */
export function alignRects<K>(
  items: readonly PositionedRect<K>[],
  alignment: DiagramAlignment,
  reference?: Rect,
): Map<K, [number, number]> {
  const result = new Map<K, [number, number]>()
  const bounds = reference ?? unionRects(items.map((item) => item.rect))

  if (!bounds || (items.length < 2 && !reference)) {
    return result
  }

  for (const { id, rect } of items) {
    let dx = 0
    let dy = 0

    switch (alignment) {
      case 'left':
        dx = bounds.x - rect.x
        break
      case 'center':
        dx = bounds.x + bounds.width / 2 - (rect.x + rect.width / 2)
        break
      case 'right':
        dx = bounds.x + bounds.width - (rect.x + rect.width)
        break
      case 'top':
        dy = bounds.y - rect.y
        break
      case 'middle':
        dy = bounds.y + bounds.height / 2 - (rect.y + rect.height / 2)
        break
      case 'bottom':
        dy = bounds.y + bounds.height - (rect.y + rect.height)
        break
    }

    if (dx !== 0 || dy !== 0) {
      result.set(id, [dx, dy])
    }
  }

  return result
}

/**
 * Offsets that space rectangles with equal gaps between the first and the last one along an
 * axis. The outermost rectangles do not move.
 */
export function distributeRects<K>(
  items: readonly PositionedRect<K>[],
  direction: DiagramDistribution,
): Map<K, [number, number]> {
  const result = new Map<K, [number, number]>()

  if (items.length < 3) {
    return result
  }

  const horizontal = direction === 'horizontal'
  const start = (r: Rect) => (horizontal ? r.x : r.y)
  const size = (r: Rect) => (horizontal ? r.width : r.height)
  const sorted = [...items].sort((a, b) => start(a.rect) - start(b.rect))
  const first = sorted[0].rect
  const last = sorted[sorted.length - 1].rect
  const totalSize = sorted.reduce((sum, item) => sum + size(item.rect), 0)
  const gap = (start(last) + size(last) - start(first) - totalSize) / (sorted.length - 1)
  let cursor = start(first) + size(first) + gap

  for (let index = 1; index < sorted.length - 1; index += 1) {
    const { id, rect } = sorted[index]
    const offset = cursor - start(rect)

    if (Math.abs(offset) > 1e-9) {
      result.set(id, horizontal ? [offset, 0] : [0, offset])
    }

    cursor += size(rect) + gap
  }

  return result
}
