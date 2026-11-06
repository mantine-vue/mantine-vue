import { snapValue, type Point, type Rect } from './geometry'
import type { DiagramGuide, DiagramSnapLine } from './types'

export interface SnapOptions {
  /** Grid size in world units, `0` or `undefined` disables grid snapping */
  gridSize?: number
  /** Rectangles of other elements to align with */
  targets?: readonly Rect[]
  /** User guide lines */
  guides?: readonly DiagramGuide[]
  /** Maximum snapping distance in world units */
  threshold: number
  /** Which edges of the moving rectangle may snap, all by default */
  edges?: { x?: ('start' | 'center' | 'end')[]; y?: ('start' | 'center' | 'end')[] }
}

export interface SnapResult {
  /** Offset to add to the moving rectangle */
  dx: number
  dy: number
  lines: DiagramSnapLine[]
}

interface Candidate {
  value: number
  rect?: Rect
}

const xEdges = (rect: Rect) => ({
  start: rect.x,
  center: rect.x + rect.width / 2,
  end: rect.x + rect.width,
})

const yEdges = (rect: Rect) => ({
  start: rect.y,
  center: rect.y + rect.height / 2,
  end: rect.y + rect.height,
})

/**
 * Snaps a moving rectangle to the edges and centers of other rectangles and to guides, falling
 * back to the grid on each axis where nothing is close enough.
 */
export function snapRect(rect: Rect, options: SnapOptions): SnapResult {
  const { gridSize, targets = [], guides = [], threshold } = options
  const xKeys = options.edges?.x ?? (['start', 'center', 'end'] as const)
  const yKeys = options.edges?.y ?? (['start', 'center', 'end'] as const)

  const xCandidates: Candidate[] = []
  const yCandidates: Candidate[] = []

  for (const target of targets) {
    for (const value of Object.values(xEdges(target))) {
      xCandidates.push({ value, rect: target })
    }

    for (const value of Object.values(yEdges(target))) {
      yCandidates.push({ value, rect: target })
    }
  }

  for (const guide of guides) {
    ;(guide.axis === 'x' ? xCandidates : yCandidates).push({ value: guide.value })
  }

  const moving = { x: xEdges(rect), y: yEdges(rect) }
  const bestX = findBest(
    xKeys.map((key) => moving.x[key]),
    xCandidates,
    threshold,
  )
  const bestY = findBest(
    yKeys.map((key) => moving.y[key]),
    yCandidates,
    threshold,
  )

  let dx = bestX ? bestX.offset : 0
  let dy = bestY ? bestY.offset : 0

  if (!bestX && gridSize) {
    const edge = moving.x[xKeys[0]]
    dx = snapValue(edge, gridSize) - edge
  }

  if (!bestY && gridSize) {
    const edge = moving.y[yKeys[0]]
    dy = snapValue(edge, gridSize) - edge
  }

  const snapped = { x: rect.x + dx, y: rect.y + dy, width: rect.width, height: rect.height }
  const lines: DiagramSnapLine[] = []

  if (bestX) {
    lines.push(...buildLines('x', bestX.value, snapped, xCandidates))
  }

  if (bestY) {
    lines.push(...buildLines('y', bestY.value, snapped, yCandidates))
  }

  return { dx, dy, lines }
}

function findBest(values: number[], candidates: Candidate[], threshold: number) {
  let best: { offset: number; value: number } | null = null

  for (const value of values) {
    for (const candidate of candidates) {
      const offset = candidate.value - value

      if (Math.abs(offset) <= threshold && (!best || Math.abs(offset) < Math.abs(best.offset))) {
        best = { offset, value: candidate.value }
      }
    }
  }

  return best
}

function buildLines(
  axis: 'x' | 'y',
  value: number,
  rect: Rect,
  candidates: Candidate[],
): DiagramSnapLine[] {
  const matching = candidates.filter((candidate) => Math.abs(candidate.value - value) < 1e-6)
  const span = (r: Rect) => (axis === 'x' ? [r.y, r.y + r.height] : [r.x, r.x + r.width])
  let [from, to] = span(rect)
  let isGuide = false

  for (const candidate of matching) {
    if (!candidate.rect) {
      isGuide = true
      continue
    }

    const [start, end] = span(candidate.rect)
    from = Math.min(from, start)
    to = Math.max(to, end)
  }

  // Guides are infinite lines already, a snap line over them would be noise.
  return isGuide && matching.every((candidate) => !candidate.rect)
    ? []
    : [{ axis, value, from, to }]
}

/** Snaps a point to the grid. */
export function snapPointToGrid(p: Point, gridSize: number | undefined): Point {
  return gridSize ? { x: snapValue(p.x, gridSize), y: snapValue(p.y, gridSize) } : p
}
