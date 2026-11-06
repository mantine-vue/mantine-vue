import {
  addPoints,
  angleBetween,
  degToRad,
  distance,
  expandRect,
  pointsEqual,
  rectContainsPoint,
  rectsIntersect,
  rectFromPoints,
  sampleCubic,
  scalePoint,
  simplifyPolyline,
  type Point,
  type Rect,
} from './geometry'
import { SIDE_VECTORS, sideTowards, type ResolvedEndpoint } from './connectors'
import type { DiagramArrowhead, DiagramSide } from './types'

export interface RouteContext {
  source: ResolvedEndpoint
  target: ResolvedEndpoint
  waypoints: readonly Point[]
  /** Rectangles to route around, queried lazily because only some routers need them */
  obstacles: (area: Rect) => Rect[]
  /** Corner radius for routers that support it */
  cornerRadius?: number
}

export interface RouteResult {
  /** SVG path data */
  path: string
  /** Polyline approximation used for hit testing, labels and arrowheads */
  points: Point[]
  /** Points where the connector bends, shown as editable control points */
  corners?: Point[]
}

export type DiagramRouter = (ctx: RouteContext) => RouteResult

const fmt = (value: number) => Math.round(value * 100) / 100

export function polylinePath(points: readonly Point[]) {
  return points.map((p, index) => `${index === 0 ? 'M' : 'L'}${fmt(p.x)} ${fmt(p.y)}`).join(' ')
}

/** Path through the points with rounded corners. */
export function roundedPolylinePath(points: readonly Point[], radius: number) {
  if (radius <= 0 || points.length < 3) {
    return polylinePath(points)
  }

  let d = `M${fmt(points[0].x)} ${fmt(points[0].y)}`

  for (let index = 1; index < points.length - 1; index += 1) {
    const prev = points[index - 1]
    const current = points[index]
    const next = points[index + 1]
    const r = Math.min(radius, distance(prev, current) / 2, distance(current, next) / 2)
    const before = moveTowards(current, prev, r)
    const after = moveTowards(current, next, r)
    d += ` L${fmt(before.x)} ${fmt(before.y)} Q${fmt(current.x)} ${fmt(current.y)} ${fmt(after.x)} ${fmt(after.y)}`
  }

  const last = points[points.length - 1]

  return `${d} L${fmt(last.x)} ${fmt(last.y)}`
}

function moveTowards(from: Point, to: Point, by: number): Point {
  const length = distance(from, to)

  return length === 0
    ? from
    : addPoints(from, scalePoint({ x: to.x - from.x, y: to.y - from.y }, by / length))
}

export const straightRouter: DiagramRouter = ({ source, target, waypoints }) => {
  const points = [source.point, ...waypoints, target.point]

  return { path: polylinePath(points), points, corners: [...waypoints] }
}

const STUB = 20

function stubPoint(
  endpoint: ResolvedEndpoint,
  other: Point,
  length = STUB,
): { stub: Point; side: DiagramSide } {
  const side = endpoint.side ?? sideTowards(endpoint.point, other)

  return { stub: addPoints(endpoint.point, scalePoint(SIDE_VECTORS[side], length)), side }
}

/** Joins points with horizontal and vertical segments only. */
function orthogonalize(points: readonly Point[], startHorizontal: boolean): Point[] {
  const result: Point[] = [points[0]]
  let horizontal = startHorizontal

  for (let index = 1; index < points.length; index += 1) {
    const from = result[result.length - 1]
    const to = points[index]

    if (Math.abs(from.x - to.x) > 1e-6 && Math.abs(from.y - to.y) > 1e-6) {
      result.push(horizontal ? { x: to.x, y: from.y } : { x: from.x, y: to.y })
    } else {
      horizontal = Math.abs(from.y - to.y) <= 1e-6
    }

    result.push(to)
    horizontal = !horizontal
  }

  return result
}

const isHorizontal = (side: DiagramSide) => side === 'left' || side === 'right'

/**
 * Finds an orthogonal route between two stubs that avoids obstacles. Builds a sparse grid from
 * the obstacle edges and runs A* with a penalty for bends.
 */
export function findOrthogonalRoute(
  start: Point,
  startSide: DiagramSide,
  end: Point,
  endSide: DiagramSide,
  obstacles: readonly Rect[],
): Point[] | null {
  const xs = new Set<number>([start.x, end.x, (start.x + end.x) / 2])
  const ys = new Set<number>([start.y, end.y, (start.y + end.y) / 2])

  for (const rect of obstacles) {
    xs.add(rect.x)
    xs.add(rect.x + rect.width)
    ys.add(rect.y)
    ys.add(rect.y + rect.height)
  }

  const xList = [...xs].sort((a, b) => a - b)
  const yList = [...ys].sort((a, b) => a - b)
  const inside = (p: Point) =>
    obstacles.some(
      (r) =>
        p.x > r.x + 1e-6 &&
        p.x < r.x + r.width - 1e-6 &&
        p.y > r.y + 1e-6 &&
        p.y < r.y + r.height - 1e-6,
    )
  const segmentBlocked = (a: Point, b: Point) => {
    const minX = Math.min(a.x, b.x)
    const maxX = Math.max(a.x, b.x)
    const minY = Math.min(a.y, b.y)
    const maxY = Math.max(a.y, b.y)

    return obstacles.some(
      (r) =>
        maxX > r.x + 1e-6 &&
        minX < r.x + r.width - 1e-6 &&
        maxY > r.y + 1e-6 &&
        minY < r.y + r.height - 1e-6,
    )
  }

  const key = (xi: number, yi: number) => xi * yList.length + yi
  const startKey = key(xList.indexOf(start.x), yList.indexOf(start.y))
  const endKey = key(xList.indexOf(end.x), yList.indexOf(end.y))
  const bendPenalty = 40
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ] as const

  // A state is a grid point plus the direction it was entered with.
  type State = { k: number; dir: number; g: number; f: number }
  const startDir = directions.findIndex(([dx, dy]) => {
    const v = SIDE_VECTORS[startSide]
    return dx === v.x && dy === v.y
  })
  const endVector = SIDE_VECTORS[endSide]
  const best = new Map<number, number>()
  const parent = new Map<number, number>()
  const open: State[] = [{ k: startKey, dir: startDir, g: 0, f: 0 }]
  const stateKey = (k: number, dir: number) => k * 4 + dir
  const pointOf = (k: number): Point => ({
    x: xList[Math.floor(k / yList.length)],
    y: yList[k % yList.length],
  })
  best.set(stateKey(startKey, startDir), 0)
  let iterations = 0

  while (open.length > 0 && iterations < 20000) {
    iterations += 1
    let lowest = 0

    for (let index = 1; index < open.length; index += 1) {
      if (open[index].f < open[lowest].f) {
        lowest = index
      }
    }

    const current = open.splice(lowest, 1)[0]

    if (current.k === endKey) {
      // The final segment must arrive against the direction of the target stub.
      const [dx, dy] = directions[current.dir]
      const arrivesCorrectly = dx === -endVector.x && dy === -endVector.y

      if (arrivesCorrectly || current.k === startKey) {
        const path: Point[] = []
        let cursor: number | undefined = stateKey(current.k, current.dir)

        while (cursor !== undefined) {
          path.unshift(pointOf(Math.floor(cursor / 4)))
          cursor = parent.get(cursor)
        }

        return simplifyPolyline(path, 0.01)
      }
    }

    const xi = Math.floor(current.k / yList.length)
    const yi = current.k % yList.length
    const from = pointOf(current.k)

    directions.forEach(([dx, dy], dir) => {
      // Never reverse, it only creates spikes.
      const [cdx, cdy] = directions[current.dir]

      if (dx === -cdx && dy === -cdy) {
        return
      }

      const nx = xi + dx
      const ny = yi + dy

      if (nx < 0 || ny < 0 || nx >= xList.length || ny >= yList.length) {
        return
      }

      const nk = key(nx, ny)
      const to = pointOf(nk)

      if ((nk !== endKey && inside(to)) || segmentBlocked(from, to)) {
        return
      }

      const g = current.g + distance(from, to) + (dir === current.dir ? 0 : bendPenalty)
      const sk = stateKey(nk, dir)

      if (g >= (best.get(sk) ?? Infinity)) {
        return
      }

      best.set(sk, g)
      parent.set(sk, stateKey(current.k, current.dir))
      open.push({ k: nk, dir, g, f: g + Math.abs(to.x - end.x) + Math.abs(to.y - end.y) })
    })
  }

  return null
}

/** Simple route between two stubs when no obstacle aware route exists. */
function fallbackRoute(
  start: Point,
  startSide: DiagramSide,
  end: Point,
  endSide: DiagramSide,
): Point[] {
  if (isHorizontal(startSide) && isHorizontal(endSide)) {
    const midX = (start.x + end.x) / 2
    return [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end]
  }

  if (!isHorizontal(startSide) && !isHorizontal(endSide)) {
    const midY = (start.y + end.y) / 2
    return [start, { x: start.x, y: midY }, { x: end.x, y: midY }, end]
  }

  return isHorizontal(startSide)
    ? [start, { x: end.x, y: start.y }, end]
    : [start, { x: start.x, y: end.y }, end]
}

/** Routes an orthogonal connector, through the waypoints when there are any. */
export function computeOrthogonalPoints(ctx: RouteContext): Point[] {
  const { source, target, waypoints } = ctx
  const s = stubPoint(source, waypoints[0] ?? target.point)
  const t = stubPoint(target, waypoints[waypoints.length - 1] ?? source.point)

  if (waypoints.length > 0) {
    const points = orthogonalize([s.stub, ...waypoints, t.stub], isHorizontal(s.side))
    return simplifyPolyline([source.point, ...points, target.point], 0.01)
  }

  const area = expandRect(rectFromPoints([source.point, target.point]), 200)
  const obstacles = ctx
    .obstacles(area)
    .concat([source.rect, target.rect].filter((rect): rect is Rect => Boolean(rect)))
    .map((rect) => expandRect(rect, STUB - 1))
    // The stubs must stay reachable, obstacles covering them are ignored.
    .filter((rect) => !rectContainsPoint(rect, s.stub) && !rectContainsPoint(rect, t.stub))
    .filter((rect) => rectsIntersect(rect, area))
    .slice(0, 60)

  const route = pointsEqual(s.stub, t.stub, 0.5)
    ? [s.stub]
    : (findOrthogonalRoute(s.stub, s.side, t.stub, t.side, obstacles) ??
      fallbackRoute(s.stub, s.side, t.stub, t.side))

  return simplifyPolyline([source.point, ...route, target.point], 0.01)
}

export const orthogonalRouter: DiagramRouter = (ctx) => {
  const points = computeOrthogonalPoints(ctx)

  return {
    path: roundedPolylinePath(points, ctx.cornerRadius ?? 0),
    points,
    corners: points.slice(1, -1),
  }
}

export const roundedRouter: DiagramRouter = (ctx) => {
  const points = computeOrthogonalPoints(ctx)

  return {
    path: roundedPolylinePath(points, ctx.cornerRadius ?? 12),
    points,
    corners: points.slice(1, -1),
  }
}

/** Smooth curve. Without waypoints the curve leaves and enters along the port directions. */
export const bezierRouter: DiagramRouter = ({ source, target, waypoints }) => {
  if (waypoints.length > 0) {
    return catmullRom([source.point, ...waypoints, target.point], waypoints)
  }

  const dist = distance(source.point, target.point)
  const k = Math.max(30, dist * 0.4)
  const sourceSide = source.side ?? sideTowards(source.point, target.point)
  const targetSide = target.side ?? sideTowards(target.point, source.point)
  const c1 = addPoints(source.point, scalePoint(SIDE_VECTORS[sourceSide], k))
  const c2 = addPoints(target.point, scalePoint(SIDE_VECTORS[targetSide], k))
  const points = sampleCubic(source.point, c1, c2, target.point, 24)

  return {
    path: `M${fmt(source.point.x)} ${fmt(source.point.y)} C${fmt(c1.x)} ${fmt(c1.y)} ${fmt(c2.x)} ${fmt(c2.y)} ${fmt(target.point.x)} ${fmt(target.point.y)}`,
    points,
    corners: [],
  }
}

function catmullRom(points: Point[], corners: readonly Point[]): RouteResult {
  let d = `M${fmt(points[0].x)} ${fmt(points[0].y)}`
  const sampled: Point[] = [points[0]]

  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] ?? points[index]
    const p1 = points[index]
    const p2 = points[index + 1]
    const p3 = points[index + 2] ?? p2
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }
    d += ` C${fmt(c1.x)} ${fmt(c1.y)} ${fmt(c2.x)} ${fmt(c2.y)} ${fmt(p2.x)} ${fmt(p2.y)}`
    sampled.push(...sampleCubic(p1, c1, c2, p2, 12).slice(1))
  }

  return { path: d, points: sampled, corners: [...corners] }
}

export const BUILT_IN_ROUTERS: Record<string, DiagramRouter> = {
  straight: straightRouter,
  orthogonal: orthogonalRouter,
  rounded: roundedRouter,
  bezier: bezierRouter,
}

/* Arrowheads */

export interface ArrowheadGeometry {
  path: string
  filled: boolean
  /** How far the line must stop short of the tip so it does not poke through */
  inset: number
}

/**
 * Geometry of an arrowhead whose tip is at `tip`, pointing in the direction `angle` (degrees).
 * Returns `null` for `'none'` and unknown arrowheads.
 */
export function getArrowhead(
  type: DiagramArrowhead | undefined,
  tip: Point,
  angle: number,
  size: number,
): ArrowheadGeometry | null {
  if (!type || type === 'none') {
    return null
  }

  const rad = degToRad(angle)
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  // Local coordinates: the tip is at the origin, the arrow points along +x.
  const at = (x: number, y: number) =>
    `${fmt(tip.x + x * cos - y * sin)} ${fmt(tip.y + x * sin + y * cos)}`
  const half = size / 2

  switch (type) {
    case 'arrow':
      return {
        path: `M${at(-size, -half)} L${at(0, 0)} L${at(-size, half)}`,
        filled: false,
        inset: 0,
      }
    case 'triangle':
      return {
        path: `M${at(0, 0)} L${at(-size, -half)} L${at(-size, half)} Z`,
        filled: true,
        inset: size,
      }
    case 'open-triangle':
      return {
        path: `M${at(0, 0)} L${at(-size, -half)} L${at(-size, half)} Z`,
        filled: false,
        inset: size,
      }
    case 'diamond':
    case 'open-diamond':
      return {
        path: `M${at(0, 0)} L${at(-size, -half)} L${at(-size * 2, 0)} L${at(-size, half)} Z`,
        filled: type === 'diamond',
        inset: size * 2,
      }
    case 'circle':
    case 'open-circle': {
      const cx = tip.x - half * cos
      const cy = tip.y - half * sin
      return {
        path: `M${fmt(cx - half)} ${fmt(cy)} a${fmt(half)} ${fmt(half)} 0 1 0 ${fmt(size)} 0 a${fmt(half)} ${fmt(half)} 0 1 0 ${fmt(-size)} 0`,
        filled: type === 'circle',
        inset: size,
      }
    }
    case 'bar':
      return { path: `M${at(0, -half)} L${at(0, half)}`, filled: false, inset: 0 }
    default:
      return null
  }
}

/** Direction of the last segment of a polyline that has a length. */
export function endAngle(points: readonly Point[], end: 'source' | 'target') {
  if (points.length < 2) {
    return 0
  }

  if (end === 'target') {
    for (let index = points.length - 1; index > 0; index -= 1) {
      if (!pointsEqual(points[index], points[index - 1], 0.01)) {
        return angleBetween(points[index - 1], points[index])
      }
    }
  } else {
    for (let index = 0; index < points.length - 1; index += 1) {
      if (!pointsEqual(points[index], points[index + 1], 0.01)) {
        return angleBetween(points[index + 1], points[index])
      }
    }
  }

  return 0
}
