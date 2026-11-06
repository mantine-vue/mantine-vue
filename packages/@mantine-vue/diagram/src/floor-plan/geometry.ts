import {
  angleBetween,
  boxCenter,
  clamp,
  closestPointOnSegment,
  distance,
  expandRect,
  lineIntersection,
  localToWorld,
  normalizeVector,
  pointsEqual,
  polygonsOverlap,
  projectOnLine,
  rectContainsRect,
  rectFromPoints,
  subtractPoints,
  type Point,
} from '../core/geometry'
import type { DiagramEditor } from '../core/editor'
import { getNodeBounds } from '../core/shapes'
import type { DiagramId, DiagramNode } from '../core/types'

export const WALL_TYPE = 'floor-wall'
export const DOOR_TYPE = 'floor-door'
export const WINDOW_TYPE = 'floor-window'
export const ROOM_TYPE = 'floor-room'
export const COLUMN_TYPE = 'floor-column'
export const STAIRS_TYPE = 'floor-stairs'
export const DIMENSION_TYPE = 'floor-dimension'
export const FURNITURE_TYPE = 'floor-furniture'

/** Types that are placed inside a wall. */
export const OPENING_TYPES = new Set([DOOR_TYPE, WINDOW_TYPE])

/** Start and end of the centerline of a wall, or of any node drawn along its length. */
export function getSegmentEndpoints(
  node: Pick<DiagramNode, 'x' | 'y' | 'width' | 'height' | 'rotation'>,
): [Point, Point] {
  return [
    localToWorld({ x: 0, y: node.height / 2 }, node),
    localToWorld({ x: node.width, y: node.height / 2 }, node),
  ]
}

/** Box of a node drawn along the segment `a`–`b` with the given thickness. */
export function segmentBox(a: Point, b: Point, thickness: number) {
  const length = Math.max(distance(a, b), 1)
  const center = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }

  return {
    x: center.x - length / 2,
    y: center.y - thickness / 2,
    width: length,
    height: thickness,
    rotation: normalizeRotation(angleBetween(a, b)),
  }
}

function normalizeRotation(deg: number) {
  const value = ((deg % 360) + 360) % 360

  return Math.abs(value - 360) < 1e-9 ? 0 : Math.round(value * 1e6) / 1e6
}

interface WallLine {
  id: DiagramId
  start: Point
  end: Point
  thickness: number
}

const toLine = (wall: DiagramNode): WallLine => {
  const [start, end] = getSegmentEndpoints(wall)

  return { id: wall.id, start, end, thickness: wall.height }
}

/** Points of the two long edges of a wall, offset from the centerline by half its thickness. */
function edgeLines(line: WallLine) {
  const direction = normalizeVector(subtractPoints(line.end, line.start))
  const normal = { x: -direction.y, y: direction.x }
  const half = line.thickness / 2
  const offset = (p: Point, sign: number) => ({
    x: p.x + normal.x * half * sign,
    y: p.y + normal.y * half * sign,
  })

  return {
    left: [offset(line.start, 1), offset(line.end, 1)] as const,
    right: [offset(line.start, -1), offset(line.end, -1)] as const,
  }
}

export interface WallJoin {
  /** End of the wall the join is at */
  end: 'start' | 'end'
  /** Walls whose ends meet this end */
  corners: DiagramId[]
  /** Wall whose side this end meets, a T junction */
  tee?: DiagramId
}

/**
 * Outline of a wall in world coordinates with mitered corners where exactly two walls meet
 * at their ends. Ends that meet the side of another wall (T junctions) are extended into it.
 */
export function computeWallOutline(
  wall: DiagramNode,
  neighbors: readonly DiagramNode[],
  tolerance = 1,
): Point[] {
  const line = toLine(wall)
  const own = edgeLines(line)
  const others = neighbors.filter((other) => other.id !== wall.id).map(toLine)
  // Corners in order: start-left, end-left, end-right, start-right.
  const corners: Point[] = [own.left[0], own.left[1], own.right[1], own.right[0]]
  const direction = normalizeVector(subtractPoints(line.end, line.start))

  for (const end of ['start', 'end'] as const) {
    const point = end === 'start' ? line.start : line.end
    const meeting = others.filter(
      (other) =>
        distance(other.start, point) <= tolerance + 1e-6 ||
        distance(other.end, point) <= tolerance + 1e-6,
    )
    const [leftIndex, rightIndex] = end === 'start' ? [0, 3] : [1, 2]

    if (meeting.length === 1) {
      const other = meeting[0]
      const otherDirection = normalizeVector(subtractPoints(other.end, other.start))

      // Collinear walls continue each other, nothing to miter.
      if (Math.abs(direction.x * otherDirection.y - direction.y * otherDirection.x) < 1e-6) {
        continue
      }

      // With both walls pointing away from the joint, the left edge of one meets the right
      // edge of the other.
      const awayOwn = end === 'start' ? direction : { x: -direction.x, y: -direction.y }
      const otherStartsHere = distance(other.start, point) <= distance(other.end, point)
      const awayOther = otherStartsHere
        ? otherDirection
        : { x: -otherDirection.x, y: -otherDirection.y }
      const leftOf = (v: Point) => ({ x: -v.y, y: v.x })

      for (const [side, index] of [
        ['left', leftIndex],
        ['right', rightIndex],
      ] as const) {
        const ownEdge = own[side]
        const ownOffset = subtractPoints(ownEdge[0], line.start)
        const sigma =
          Math.sign(ownOffset.x * leftOf(awayOwn).x + ownOffset.y * leftOf(awayOwn).y) || 1
        const normal = leftOf(awayOther)
        const shift = (-sigma * other.thickness) / 2
        const a = { x: other.start.x + normal.x * shift, y: other.start.y + normal.y * shift }
        const b = { x: other.end.x + normal.x * shift, y: other.end.y + normal.y * shift }
        const corner = lineIntersection(ownEdge[0], ownEdge[1], a, b)

        // Very sharp angles produce far away miters, those ends stay square.
        if (corner && distance(corner, point) <= Math.max(line.thickness, other.thickness) * 4) {
          corners[index] = corner
        }
      }

      continue
    }

    if (meeting.length > 1) {
      // Three or more walls: square ends extended by half the thickness cover the junction.
      const extend = (p: Point, sign: number) => ({
        x: p.x + direction.x * (line.thickness / 2) * sign,
        y: p.y + direction.y * (line.thickness / 2) * sign,
      })
      const sign = end === 'start' ? -1 : 1
      corners[leftIndex] = extend(corners[leftIndex], sign)
      corners[rightIndex] = extend(corners[rightIndex], sign)
      continue
    }

    // T junction: the end lies on the centerline of another wall.
    const host = others.find((other) => {
      const t = projectOnLine(point, other.start, other.end)
      return (
        t > 0 &&
        t < 1 &&
        distance(closestPointOnSegment(point, other.start, other.end), point) <=
          other.thickness / 2 + tolerance
      )
    })

    if (host) {
      const hostEdges = edgeLines(host)

      for (const [side, index] of [
        ['left', leftIndex],
        ['right', rightIndex],
      ] as const) {
        const ownEdge = own[side]
        // The far edge of the host, so the wall reaches into it.
        const hits = [hostEdges.left, hostEdges.right]
          .map((edge) => lineIntersection(ownEdge[0], ownEdge[1], edge[0], edge[1]))
          .filter((p): p is Point => p !== null)
          .sort((a, b) => distance(a, point) - distance(b, point))

        if (hits.length > 0) {
          corners[index] = hits[hits.length - 1]
        }
      }
    }
  }

  return corners
}

/** Walls whose bounds come close to a wall, candidates for joins. */
export function getWallNeighbors(
  editor: DiagramEditor,
  wall: DiagramNode,
  tolerance = 1,
): DiagramNode[] {
  const area = expandRect(getNodeBounds(wall), Math.max(wall.height, tolerance) + tolerance)

  return [...editor.queryNodes(area)]
    .map((id) => editor.store.getNode(id)!)
    .filter(
      (node) =>
        node && node.type === WALL_TYPE && node.id !== wall.id && editor.isNodeVisible(node),
    )
}

/** Snaps a point to the nearest wall end within `radius`, or onto a wall centerline. */
export function snapToWalls(
  editor: DiagramEditor,
  p: Point,
  radius: number,
  exclude: ReadonlySet<DiagramId> = new Set(),
): { point: Point; wallId?: DiagramId; kind: 'end' | 'line' | 'none' } {
  const area = expandRect({ x: p.x, y: p.y, width: 0, height: 0 }, radius * 2)
  let best: { point: Point; wallId?: DiagramId; kind: 'end' | 'line'; distance: number } | null =
    null

  for (const id of editor.queryNodes(area)) {
    const node = editor.store.getNode(id)

    if (!node || node.type !== WALL_TYPE || exclude.has(id) || !editor.isNodeVisible(node)) {
      continue
    }

    const [start, end] = getSegmentEndpoints(node)

    for (const candidate of [start, end]) {
      const d = distance(candidate, p)

      if (d <= radius && (!best || best.kind === 'line' || d < best.distance)) {
        best = { point: candidate, wallId: id, kind: 'end', distance: d }
      }
    }

    if (best?.kind !== 'end') {
      const onLine = closestPointOnSegment(p, start, end)
      const d = distance(onLine, p)

      if (d <= radius && (!best || d < best.distance)) {
        best = { point: onLine, wallId: id, kind: 'line', distance: d }
      }
    }
  }

  return best
    ? { point: best.point, wallId: best.wallId, kind: best.kind }
    : { point: p, kind: 'none' }
}

/**
 * Where an opening (door or window) sits in a wall: its center on the wall centerline, the
 * distance of that center from the wall start, and the matching box.
 */
export function placeOpening(
  opening: DiagramNode,
  wall: DiagramNode,
  center: Point = boxCenter(opening),
) {
  const [start, end] = getSegmentEndpoints(wall)
  const length = distance(start, end)
  const half = Math.min(opening.width / 2, length / 2)
  const offset = clamp(projectOnLine(center, start, end) * length, half, length - half)
  const direction = normalizeVector(subtractPoints(end, start))
  const point = { x: start.x + direction.x * offset, y: start.y + direction.y * offset }

  return {
    offset,
    box: {
      x: point.x - opening.width / 2,
      y: point.y - wall.height / 2,
      width: opening.width,
      height: wall.height,
      rotation: wall.rotation ?? 0,
    },
  }
}

/** Nearest wall an opening can be placed in: its center close to the wall centerline. */
export function findHostWall(
  editor: DiagramEditor,
  opening: DiagramNode,
  maxDistance?: number,
): DiagramNode | null {
  const center = boxCenter(opening)
  let best: { wall: DiagramNode; distance: number } | null = null
  const area = expandRect(
    { x: center.x, y: center.y, width: 0, height: 0 },
    Math.max(opening.width, 100),
  )

  for (const id of editor.queryNodes(area)) {
    const wall = editor.store.getNode(id)

    if (!wall || wall.type !== WALL_TYPE || !editor.isNodeVisible(wall)) {
      continue
    }

    const [start, end] = getSegmentEndpoints(wall)
    const d = distance(closestPointOnSegment(center, start, end), center)
    const limit = maxDistance ?? wall.height / 2 + Math.max(wall.height, opening.height)

    if (d <= limit && distance(start, end) >= opening.width * 0.5 && (!best || d < best.distance)) {
      best = { wall, distance: d }
    }
  }

  return best?.wall ?? null
}

export interface DiagramCollision {
  a: DiagramId
  b: DiagramId
}

/**
 * Pairs of overlapping nodes among the given types. Nodes that only touch do not collide.
 * Uses the spatial index, so the cost grows with the number of close pairs only.
 */
export function findCollisions(
  editor: DiagramEditor,
  options: {
    types: ReadonlySet<string>
    ids?: Iterable<DiagramId>
    candidates?: readonly DiagramNode[]
  },
): DiagramCollision[] {
  const result: DiagramCollision[] = []
  const seen = new Set<string>()
  const sources =
    options.candidates ??
    [...(options.ids ?? editor.store.getNodes().map((node) => node.id))]
      .map((id) => editor.store.getNode(id))
      .filter((node): node is DiagramNode => Boolean(node))
  const overrides = new Map((options.candidates ?? []).map((node) => [node.id, node]))

  for (const node of sources) {
    if (!options.types.has(node.type) || !editor.isNodeVisible(node)) {
      continue
    }

    const outline = editor.getNodeOutline(node)
    const bounds = rectFromPoints(outline)

    for (const id of editor.queryNodes(bounds)) {
      if (id === node.id) {
        continue
      }

      const other = overrides.get(id) ?? editor.store.getNode(id)

      if (!other || !options.types.has(other.type) || !editor.isNodeVisible(other)) {
        continue
      }

      // Nodes of one group, e.g. a table and its chairs, may overlap.
      if (node.parentId && node.parentId === other.parentId) {
        continue
      }

      const key = node.id < id ? `${node.id}|${id}` : `${id}|${node.id}`

      if (seen.has(key)) {
        continue
      }

      seen.add(key)

      if (polygonsOverlap(outline, editor.getNodeOutline(other))) {
        result.push({ a: node.id, b: id })
      }
    }
  }

  return result
}

/** Visible nodes not fully inside the floor boundary of the document. */
export function findOutsideBoundary(
  editor: DiagramEditor,
  types?: ReadonlySet<string>,
): DiagramId[] {
  const bounds = editor.settings.bounds

  if (!bounds) {
    return []
  }

  return editor.store
    .getNodes()
    .filter(
      (node) => (!types || types.has(node.type)) && editor.isNodeVisible(node) && !node.parentId,
    )
    .filter((node) => !rectContainsRect(bounds, getNodeBounds(node)))
    .map((node) => node.id)
}

export function outlinesEqual(
  a: readonly Point[] | null | undefined,
  b: readonly Point[] | null | undefined,
) {
  if (!a || !b || a.length !== b.length) {
    return a === b
  }

  return a.every((p, index) => pointsEqual(p, b[index], 1e-6))
}
