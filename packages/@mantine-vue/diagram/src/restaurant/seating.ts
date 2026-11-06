import { ellipsePoints, rectToPolygon, type Point } from '../core/geometry'
import type { DiagramNode } from '../core/types'

export const TABLE_TYPE = 'restaurant-table'
export const BOOTH_TYPE = 'restaurant-booth'
export const BAR_TYPE = 'restaurant-bar'
export const ZONE_TYPE = 'restaurant-zone'

/** Types that seat guests. */
export const SEATING_TYPES = new Set([TABLE_TYPE, BOOTH_TYPE, BAR_TYPE])

export type TableShape = 'round' | 'oval' | 'square' | 'rectangle'

/**
 * Which sides of a rectangular table get chairs: all four, the two long sides, one long side
 * (e.g. against a wall) or the two short ends only.
 */
export type SeatLayout = 'around' | 'long-sides' | 'one-side' | 'ends'

export interface TableData {
  shape?: TableShape
  seats?: number
  /** Number or name shown on the table */
  number?: string | number
  /** Status key, see `DEFAULT_TABLE_STATUSES` */
  status?: string
  seatLayout?: SeatLayout
  /** Chair width and depth in world units, `45` by default */
  chairSize?: number
  /** Gap between table and chairs in world units, `6` by default */
  chairGap?: number
  /** Tables this one was merged from, restored by `splitTable` */
  mergedFrom?: DiagramNode[]
  /** Guests the table may take at least */
  minSeats?: number
  /** Free form attributes for reservation and POS systems */
  attributes?: Record<string, unknown>
}

export interface SeatPosition {
  /** Center of the chair in local coordinates of the table */
  x: number
  y: number
  /** Rotation of the chair in degrees. `0` faces down (towards +y), `90` faces left */
  rotation: number
}

/** Splits `total` into integer parts proportional to `weights` (largest remainder method). */
export function allocate(total: number, weights: readonly number[]): number[] {
  const sum = weights.reduce((acc, weight) => acc + weight, 0)

  if (sum <= 0 || total <= 0) {
    return weights.map(() => 0)
  }

  const exact = weights.map((weight) => (total * weight) / sum)
  const result = exact.map(Math.floor)
  let remaining = total - result.reduce((acc, value) => acc + value, 0)
  const order = exact
    .map((value, index) => ({ index, fraction: value - Math.floor(value), weight: weights[index] }))
    .sort((a, b) => b.fraction - a.fraction || b.weight - a.weight)

  for (const { index } of order) {
    if (remaining <= 0) {
      break
    }

    result[index] += 1
    remaining -= 1
  }

  return result
}

const chairSize = (data: TableData | undefined) => data?.chairSize ?? 45
const chairGap = (data: TableData | undefined) => data?.chairGap ?? 6

/** Positions of the chairs around a table, in local coordinates of the table box. */
export function getSeatPositions(
  table: Pick<DiagramNode, 'width' | 'height' | 'data'>,
): SeatPosition[] {
  const data = table.data as TableData | undefined
  const seats = Math.max(0, Math.floor(data?.seats ?? 0))
  const { width: w, height: h } = table
  const offset = chairSize(data) / 2 + chairGap(data)

  if (seats === 0) {
    return []
  }

  const shape = data?.shape ?? 'round'

  if (shape === 'round' || shape === 'oval') {
    return Array.from({ length: seats }, (_, index) => {
      const angle = -Math.PI / 2 + (index / seats) * Math.PI * 2
      return {
        x: w / 2 + Math.cos(angle) * (w / 2 + offset),
        y: h / 2 + Math.sin(angle) * (h / 2 + offset),
        rotation: (angle * 180) / Math.PI + 90,
      }
    })
  }

  const layout = data?.seatLayout ?? 'around'
  // Sides in order: top, right, bottom, left. Long sides first get the larger share.
  const weights =
    layout === 'around'
      ? [w, h, w, h]
      : layout === 'long-sides'
        ? w >= h
          ? [w, 0, w, 0]
          : [0, h, 0, h]
        : layout === 'one-side'
          ? w >= h
            ? [w, 0, 0, 0]
            : [0, h, 0, 0]
          : w >= h
            ? [0, h, 0, h]
            : [w, 0, w, 0]
  const counts = allocate(seats, weights)
  const result: SeatPosition[] = []
  const along = (count: number, length: number) =>
    Array.from({ length: count }, (_, index) => ((index + 0.5) * length) / count)

  // Every chair faces the table: rotation 0 faces down, 90 faces left and so on.
  along(counts[0], w).forEach((x) => result.push({ x, y: -offset, rotation: 0 }))
  along(counts[1], h).forEach((y) => result.push({ x: w + offset, y, rotation: 90 }))
  along(counts[2], w).forEach((x) => result.push({ x: w - x, y: h + offset, rotation: 180 }))
  along(counts[3], h).forEach((y) => result.push({ x: -offset, y: h - y, rotation: 270 }))

  return result
}

/** Footprint of a table with its chairs in local coordinates, used for spacing and collisions. */
export function getTableFootprint(table: Pick<DiagramNode, 'width' | 'height' | 'data'>): Point[] {
  const data = table.data as TableData | undefined
  const seats = getSeatPositions(table)
  const reach = seats.length > 0 ? chairSize(data) + chairGap(data) : 0
  const { width: w, height: h } = table

  if ((data?.shape ?? 'round') === 'round' || data?.shape === 'oval') {
    return ellipsePoints(w + reach * 2, h + reach * 2, 24).map((p) => ({
      x: p.x - reach,
      y: p.y - reach,
    }))
  }

  // Only the sides with chairs grow.
  const has = (test: (seat: SeatPosition) => boolean) => (seats.some(test) ? reach : 0)
  const top = has((seat) => seat.y < 0)
  const bottom = has((seat) => seat.y > h)
  const left = has((seat) => seat.x < 0)
  const right = has((seat) => seat.x > w)

  return rectToPolygon({
    x: left ? -left : 0,
    y: top ? -top : 0,
    width: w + left + right,
    height: h + top + bottom,
  })
}

/** Positions of the stools of a bar counter, along its front (bottom) side. */
export function getBarStoolPositions(
  bar: Pick<DiagramNode, 'width' | 'height' | 'data'>,
): SeatPosition[] {
  const seats = Math.max(0, Math.floor(bar.data?.seats ?? 0))
  const offset = (bar.data?.chairSize ?? 36) / 2 + 8

  return Array.from({ length: seats }, (_, index) => ({
    x: ((index + 0.5) * bar.width) / seats,
    y: bar.height + offset,
    rotation: 180,
  }))
}
