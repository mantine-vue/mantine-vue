/**
 * Plain geometry used by every layer of the diagram. Nothing here knows about nodes, Vue or the
 * DOM, so it is safe to use on the server and in workers.
 */

export interface Point {
  x: number
  y: number
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

/** A rectangle rotated around its center by `rotation` degrees. */
export interface Box extends Rect {
  rotation?: number
}

export const EPSILON = 1e-9

export const point = (x: number, y: number): Point => ({ x, y })
export const addPoints = (a: Point, b: Point): Point => ({ x: a.x + b.x, y: a.y + b.y })
export const subtractPoints = (a: Point, b: Point): Point => ({ x: a.x - b.x, y: a.y - b.y })
export const scalePoint = (p: Point, factor: number): Point => ({
  x: p.x * factor,
  y: p.y * factor,
})
export const dot = (a: Point, b: Point) => a.x * b.x + a.y * b.y
export const cross = (a: Point, b: Point) => a.x * b.y - a.y * b.x
export const vectorLength = (p: Point) => Math.hypot(p.x, p.y)
export const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)
export const lerpPoint = (a: Point, b: Point, t: number): Point => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
})
export const midpoint = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })
export const pointsEqual = (a: Point, b: Point, tolerance = EPSILON) =>
  Math.abs(a.x - b.x) <= tolerance && Math.abs(a.y - b.y) <= tolerance

export function normalizeVector(p: Point): Point {
  const length = vectorLength(p)

  return length < EPSILON ? { x: 0, y: 0 } : { x: p.x / length, y: p.y / length }
}

export const degToRad = (deg: number) => (deg * Math.PI) / 180
export const radToDeg = (rad: number) => (rad * 180) / Math.PI

/** Normalizes an angle to `[0, 360)`. */
export function normalizeAngle(deg: number) {
  const value = deg % 360

  // Adding zero turns -0 into 0.
  return value < 0 ? value + 360 : value + 0
}

/** Snaps an angle to the closest multiple of `step` degrees. */
export function snapAngle(deg: number, step: number) {
  return step > 0 ? normalizeAngle(Math.round(deg / step) * step) : normalizeAngle(deg)
}

export function angleBetween(from: Point, to: Point) {
  return radToDeg(Math.atan2(to.y - from.y, to.x - from.x))
}

export function rotatePoint(p: Point, center: Point, deg: number): Point {
  if (!deg) {
    return { x: p.x, y: p.y }
  }

  const rad = degToRad(deg)
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  const dx = p.x - center.x
  const dy = p.y - center.y

  return { x: center.x + dx * cos - dy * sin, y: center.y + dx * sin + dy * cos }
}

export function round(value: number, precision = 2) {
  const factor = 10 ** precision

  return Math.round(value * factor) / factor
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/* Rectangles */

export function rectCenter(rect: Rect): Point {
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
}

/** The rectangle spanned by two corners, in any order. */
export function rectFromCorners(a: Point, b: Point): Rect {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  }
}

export function rectFromPoints(points: readonly Point[]): Rect {
  if (points.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 }
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const p of points) {
    minX = Math.min(minX, p.x)
    minY = Math.min(minY, p.y)
    maxX = Math.max(maxX, p.x)
    maxY = Math.max(maxY, p.y)
  }

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
}

export function unionRects(rects: readonly Rect[]): Rect | null {
  if (rects.length === 0) {
    return null
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const rect of rects) {
    minX = Math.min(minX, rect.x)
    minY = Math.min(minY, rect.y)
    maxX = Math.max(maxX, rect.x + rect.width)
    maxY = Math.max(maxY, rect.y + rect.height)
  }

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
}

export function expandRect(rect: Rect, by: number): Rect {
  return {
    x: rect.x - by,
    y: rect.y - by,
    width: rect.width + by * 2,
    height: rect.height + by * 2,
  }
}

export function rectContainsPoint(rect: Rect, p: Point, tolerance = 0) {
  return (
    p.x >= rect.x - tolerance &&
    p.x <= rect.x + rect.width + tolerance &&
    p.y >= rect.y - tolerance &&
    p.y <= rect.y + rect.height + tolerance
  )
}

export function rectContainsRect(outer: Rect, inner: Rect) {
  return (
    inner.x >= outer.x - EPSILON &&
    inner.y >= outer.y - EPSILON &&
    inner.x + inner.width <= outer.x + outer.width + EPSILON &&
    inner.y + inner.height <= outer.y + outer.height + EPSILON
  )
}

export function rectsIntersect(a: Rect, b: Rect) {
  return (
    a.x <= b.x + b.width && b.x <= a.x + a.width && a.y <= b.y + b.height && b.y <= a.y + a.height
  )
}

export function rectToPolygon(rect: Rect): Point[] {
  return [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height },
  ]
}

/* Rotated boxes */

export function boxCenter(box: Box): Point {
  return rectCenter(box)
}

/** Corners of a rotated box in world coordinates, clockwise from the top left. */
export function boxCorners(box: Box): Point[] {
  const center = boxCenter(box)

  return rectToPolygon(box).map((corner) => rotatePoint(corner, center, box.rotation ?? 0))
}

/** Axis-aligned bounds of a rotated box. */
export function boxBounds(box: Box): Rect {
  if (!box.rotation) {
    return { x: box.x, y: box.y, width: box.width, height: box.height }
  }

  return rectFromPoints(boxCorners(box))
}

/** Converts a world point to the local, unrotated coordinates of a box (origin at its top left). */
export function worldToLocal(p: Point, box: Box): Point {
  const unrotated = rotatePoint(p, boxCenter(box), -(box.rotation ?? 0))

  return { x: unrotated.x - box.x, y: unrotated.y - box.y }
}

/** Converts a local point of a box (origin at its top left) to world coordinates. */
export function localToWorld(p: Point, box: Box): Point {
  return rotatePoint({ x: p.x + box.x, y: p.y + box.y }, boxCenter(box), box.rotation ?? 0)
}

/* Segments and polylines */

/** Shortest distance between a point and the segment `a`–`b`. */
export function distanceToSegment(p: Point, a: Point, b: Point) {
  return distance(p, closestPointOnSegment(p, a, b))
}

export function closestPointOnSegment(p: Point, a: Point, b: Point): Point {
  const ab = subtractPoints(b, a)
  const lengthSquared = dot(ab, ab)

  if (lengthSquared < EPSILON) {
    return { x: a.x, y: a.y }
  }

  const t = clamp(dot(subtractPoints(p, a), ab) / lengthSquared, 0, 1)

  return lerpPoint(a, b, t)
}

/** Projection parameter of `p` on the infinite line through `a` and `b`. */
export function projectOnLine(p: Point, a: Point, b: Point) {
  const ab = subtractPoints(b, a)
  const lengthSquared = dot(ab, ab)

  return lengthSquared < EPSILON ? 0 : dot(subtractPoints(p, a), ab) / lengthSquared
}

/** Intersection of the segments `a1`–`a2` and `b1`–`b2`, `null` when they do not cross. */
export function segmentIntersection(a1: Point, a2: Point, b1: Point, b2: Point): Point | null {
  const r = subtractPoints(a2, a1)
  const s = subtractPoints(b2, b1)
  const denominator = cross(r, s)

  if (Math.abs(denominator) < EPSILON) {
    return null
  }

  const qp = subtractPoints(b1, a1)
  const t = cross(qp, s) / denominator
  const u = cross(qp, r) / denominator

  if (t < -EPSILON || t > 1 + EPSILON || u < -EPSILON || u > 1 + EPSILON) {
    return null
  }

  return { x: a1.x + r.x * t, y: a1.y + r.y * t }
}

/** Intersection of two infinite lines, `null` when they are parallel. */
export function lineIntersection(a1: Point, a2: Point, b1: Point, b2: Point): Point | null {
  const r = subtractPoints(a2, a1)
  const s = subtractPoints(b2, b1)
  const denominator = cross(r, s)

  if (Math.abs(denominator) < EPSILON) {
    return null
  }

  const t = cross(subtractPoints(b1, a1), s) / denominator

  return { x: a1.x + r.x * t, y: a1.y + r.y * t }
}

export function segmentsDistance(a1: Point, a2: Point, b1: Point, b2: Point) {
  if (segmentIntersection(a1, a2, b1, b2)) {
    return 0
  }

  return Math.min(
    distanceToSegment(a1, b1, b2),
    distanceToSegment(a2, b1, b2),
    distanceToSegment(b1, a1, a2),
    distanceToSegment(b2, a1, a2),
  )
}

export function polylineLength(points: readonly Point[]) {
  let total = 0

  for (let index = 1; index < points.length; index += 1) {
    total += distance(points[index - 1], points[index])
  }

  return total
}

/** Point at a fraction `t` (0–1) of the length of a polyline, with the direction there. */
export function pointAlongPolyline(
  points: readonly Point[],
  t: number,
): { point: Point; angle: number; segment: number } {
  if (points.length === 0) {
    return { point: { x: 0, y: 0 }, angle: 0, segment: 0 }
  }

  if (points.length === 1) {
    return { point: { ...points[0] }, angle: 0, segment: 0 }
  }

  const target = polylineLength(points) * clamp(t, 0, 1)
  let travelled = 0

  for (let index = 1; index < points.length; index += 1) {
    const from = points[index - 1]
    const to = points[index]
    const length = distance(from, to)

    if (travelled + length >= target - EPSILON || index === points.length - 1) {
      const local = length < EPSILON ? 0 : clamp((target - travelled) / length, 0, 1)

      return {
        point: lerpPoint(from, to, local),
        angle: angleBetween(from, to),
        segment: index - 1,
      }
    }

    travelled += length
  }

  return { point: { ...points[points.length - 1] }, angle: 0, segment: points.length - 2 }
}

export function distanceToPolyline(p: Point, points: readonly Point[]) {
  let best = Infinity

  for (let index = 1; index < points.length; index += 1) {
    best = Math.min(best, distanceToSegment(p, points[index - 1], points[index]))
  }

  return points.length === 1 ? distance(p, points[0]) : best
}

/** Removes consecutive duplicates and collinear interior points. */
export function simplifyPolyline(points: readonly Point[], tolerance = 0.5): Point[] {
  const result: Point[] = []

  for (const p of points) {
    const last = result[result.length - 1]

    if (last && pointsEqual(last, p, tolerance)) {
      continue
    }

    if (result.length >= 2) {
      const prev = result[result.length - 2]

      if (Math.abs(cross(subtractPoints(last, prev), subtractPoints(p, last))) < tolerance) {
        const sameDirection = dot(subtractPoints(last, prev), subtractPoints(p, last)) >= 0

        if (sameDirection) {
          result[result.length - 1] = { x: p.x, y: p.y }
          continue
        }
      }
    }

    result.push({ x: p.x, y: p.y })
  }

  return result
}

/* Polygons */

/** Signed area, positive for clockwise polygons in screen coordinates (y down). */
export function polygonSignedArea(points: readonly Point[]) {
  let area = 0

  for (let index = 0; index < points.length; index += 1) {
    const a = points[index]
    const b = points[(index + 1) % points.length]
    area += a.x * b.y - b.x * a.y
  }

  return area / 2
}

export function polygonArea(points: readonly Point[]) {
  return Math.abs(polygonSignedArea(points))
}

export function polygonPerimeter(points: readonly Point[]) {
  return points.length < 2 ? 0 : polylineLength([...points, points[0]])
}

export function polygonCentroid(points: readonly Point[]): Point {
  const area = polygonSignedArea(points)

  if (Math.abs(area) < EPSILON) {
    const bounds = rectFromPoints(points)

    return rectCenter(bounds)
  }

  let x = 0
  let y = 0

  for (let index = 0; index < points.length; index += 1) {
    const a = points[index]
    const b = points[(index + 1) % points.length]
    const factor = a.x * b.y - b.x * a.y
    x += (a.x + b.x) * factor
    y += (a.y + b.y) * factor
  }

  return { x: x / (6 * area), y: y / (6 * area) }
}

/** Even-odd point in polygon test. Points on the boundary count as inside. */
export function pointInPolygon(p: Point, polygon: readonly Point[]) {
  let inside = false

  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const a = polygon[index]
    const b = polygon[previous]

    if (distanceToSegment(p, a, b) < 1e-6) {
      return true
    }

    const crosses = a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x

    if (crosses) {
      inside = !inside
    }
  }

  return inside
}

/** Whether two simple polygons overlap: an edge crossing or one containing the other. */
export function polygonsIntersect(a: readonly Point[], b: readonly Point[]) {
  if (a.length === 0 || b.length === 0) {
    return false
  }

  if (!rectsIntersect(rectFromPoints(a), rectFromPoints(b))) {
    return false
  }

  for (let i = 0; i < a.length; i += 1) {
    const a1 = a[i]
    const a2 = a[(i + 1) % a.length]

    for (let j = 0; j < b.length; j += 1) {
      if (segmentIntersection(a1, a2, b[j], b[(j + 1) % b.length])) {
        return true
      }
    }
  }

  return pointInPolygon(a[0], b) || pointInPolygon(b[0], a)
}

/** Whether two polygons overlap with a positive area, touching edges do not count. */
export function polygonsOverlap(a: readonly Point[], b: readonly Point[], tolerance = 0.01) {
  if (!polygonsIntersect(a, b)) {
    return false
  }

  // Shrink both polygons towards their centroids, touching shapes stop intersecting.
  return polygonsIntersect(shrinkPolygon(a, tolerance), shrinkPolygon(b, tolerance))
}

function shrinkPolygon(points: readonly Point[], by: number) {
  const center = polygonCentroid(points)

  return points.map((p) => {
    const direction = normalizeVector(subtractPoints(center, p))

    return addPoints(p, scalePoint(direction, by))
  })
}

/** Shortest distance between two polygons, `0` when they overlap. */
export function polygonDistance(a: readonly Point[], b: readonly Point[]) {
  if (polygonsIntersect(a, b)) {
    return 0
  }

  let best = Infinity

  for (let i = 0; i < a.length; i += 1) {
    const a1 = a[i]
    const a2 = a[(i + 1) % a.length]

    for (let j = 0; j < b.length; j += 1) {
      best = Math.min(best, segmentsDistance(a1, a2, b[j], b[(j + 1) % b.length]))
    }
  }

  return best
}

/** Regular polygon or star points inside the `width` × `height` box. */
export function regularPolygonPoints(
  sides: number,
  width: number,
  height: number,
  options: { innerRatio?: number; startAngle?: number } = {},
): Point[] {
  const { innerRatio, startAngle = -90 } = options
  const count = innerRatio ? sides * 2 : sides
  const points: Point[] = []

  for (let index = 0; index < count; index += 1) {
    const angle = degToRad(startAngle + (index * 360) / count)
    const radius = innerRatio && index % 2 === 1 ? innerRatio : 1
    points.push({
      x: width / 2 + (Math.cos(angle) * radius * width) / 2,
      y: height / 2 + (Math.sin(angle) * radius * height) / 2,
    })
  }

  return points
}

export function ellipsePoints(width: number, height: number, segments = 32): Point[] {
  const points: Point[] = []

  for (let index = 0; index < segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2
    points.push({
      x: width / 2 + (Math.cos(angle) * width) / 2,
      y: height / 2 + (Math.sin(angle) * height) / 2,
    })
  }

  return points
}

/**
 * Where the ray from `from` towards `toward` leaves a polygon that contains `from`. Used for
 * floating connector ends that meet the outline of a shape.
 */
export function rayPolygonExit(from: Point, toward: Point, polygon: readonly Point[]): Point {
  const direction = normalizeVector(subtractPoints(toward, from))

  if (vectorLength(direction) < EPSILON) {
    return { x: from.x, y: from.y }
  }

  const bounds = rectFromPoints(polygon)
  const far = addPoints(from, scalePoint(direction, (bounds.width + bounds.height) * 2 + 1))
  let best: Point | null = null
  let bestDistance = Infinity

  for (let index = 0; index < polygon.length; index += 1) {
    const hit = segmentIntersection(
      from,
      far,
      polygon[index],
      polygon[(index + 1) % polygon.length],
    )

    if (hit) {
      const d = distance(from, hit)

      if (d < bestDistance) {
        bestDistance = d
        best = hit
      }
    }
  }

  return best ?? { x: from.x, y: from.y }
}

/* Curves */

export function cubicPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const mt = 1 - t
  const a = mt * mt * mt
  const b = 3 * mt * mt * t
  const c = 3 * mt * t * t
  const d = t * t * t

  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  }
}

/** Samples a cubic Bézier curve into a polyline. */
export function sampleCubic(p0: Point, p1: Point, p2: Point, p3: Point, segments = 16): Point[] {
  const points: Point[] = []

  for (let index = 0; index <= segments; index += 1) {
    points.push(cubicPoint(p0, p1, p2, p3, index / segments))
  }

  return points
}

/* Numbers */

/** Rounds to the closest multiple of `step`. */
export function snapValue(value: number, step: number) {
  return step > 0 ? Math.round(value / step) * step : value
}

/** A "nice" step (1, 2 or 5 × 10ⁿ) that is at least `minimum`. */
export function niceStep(minimum: number) {
  if (!(minimum > 0) || !Number.isFinite(minimum)) {
    return 1
  }

  const exponent = Math.floor(Math.log10(minimum))
  const base = 10 ** exponent

  for (const multiplier of [1, 2, 5, 10]) {
    if (base * multiplier >= minimum - EPSILON) {
      return base * multiplier
    }
  }

  return base * 10
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}
