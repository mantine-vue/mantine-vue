import type { DiagramEditor } from '../core/editor'
import {
  boxCenter,
  expandRect,
  localToWorld,
  pointInPolygon,
  polygonDistance,
  polygonsOverlap,
  rectContainsRect,
  rectFromPoints,
  unionRects,
} from '../core/geometry'
import { getNodeBounds } from '../core/shapes'
import type { DiagramId, DiagramNode } from '../core/types'
import { SEATING_TYPES, TABLE_TYPE, ZONE_TYPE, type TableData } from './seating'

export interface TableStatusDefinition {
  label: string
  /** Mantine theme color or CSS color */
  color: string
  /** Whether guests can be seated, counted as free capacity */
  available?: boolean
}

export const DEFAULT_TABLE_STATUSES: Record<string, TableStatusDefinition> = {
  available: { label: 'Available', color: 'teal', available: true },
  reserved: { label: 'Reserved', color: 'yellow' },
  occupied: { label: 'Occupied', color: 'red' },
  cleaning: { label: 'Cleaning', color: 'blue' },
  disabled: { label: 'Disabled', color: 'gray' },
}

export const DEFAULT_STATUS = 'available'

export function isTable(node: DiagramNode | undefined): node is DiagramNode<TableData> {
  return node?.type === TABLE_TYPE
}

/** Number of guests a seating node takes. */
export function getCapacity(node: DiagramNode): number {
  return SEATING_TYPES.has(node.type) ? Math.max(0, Math.floor(node.data?.seats ?? 0)) : 0
}

/** Seating nodes in reading order: rows top to bottom, left to right. */
export function getTablesInReadingOrder(
  editor: DiagramEditor,
  types: ReadonlySet<string> = SEATING_TYPES,
) {
  return editor.store
    .getNodes()
    .filter((node) => types.has(node.type))
    .sort((a, b) => {
      const ra = getNodeBounds(a)
      const rb = getNodeBounds(b)
      return Math.abs(ra.y - rb.y) > Math.min(ra.height, rb.height) / 2 ? ra.y - rb.y : ra.x - rb.x
    })
}

/** The smallest unused table number, for new tables. */
export function nextTableNumber(editor: DiagramEditor): number {
  const used = new Set(
    editor.store
      .getNodes()
      .filter((node) => SEATING_TYPES.has(node.type))
      .map((node) => Number(node.data?.number))
      .filter((value) => Number.isFinite(value)),
  )
  let candidate = 1

  while (used.has(candidate)) {
    candidate += 1
  }

  return candidate
}

/** Numbers seating nodes in reading order as one undoable step. */
export function renumberTables(
  editor: DiagramEditor,
  options: { start?: number; prefix?: string } = {},
) {
  const start = options.start ?? 1
  const tables = getTablesInReadingOrder(editor)

  editor.store.transact('Renumber tables', () => {
    tables.forEach((table, index) => {
      const number = options.prefix ? `${options.prefix}${start + index}` : start + index
      editor.store.updateNodeData(table.id, { number })
    })
  })
}

/**
 * Merges tables into one rectangular table covering them, with the sum of their seats. The
 * original tables are kept in `data.mergedFrom`, `splitTable` restores them.
 */
export function mergeTables(editor: DiagramEditor, ids: Iterable<DiagramId>): DiagramNode | null {
  const tables = [...ids]
    .map((id) => editor.store.getNode(id))
    .filter(isTable)
    .filter((node) => editor.isNodeEditable(node))

  if (tables.length < 2) {
    return null
  }

  const bounds = unionRects(tables.map((table) => getNodeBounds(table)))!
  const ordered = [...tables].sort(
    (a, b) => editor.store.getNodeIndex(a.id) - editor.store.getNodeIndex(b.id),
  )
  const first = ordered[0]
  const originals = tables.flatMap((table) =>
    table.data?.mergedFrom?.length ? table.data.mergedFrom : [table],
  )
  const numbers = originals
    .map((table) => table.data?.number)
    .filter((value) => value !== undefined && value !== '')
  const merged = editor.createNode({
    type: TABLE_TYPE,
    ...bounds,
    layerId: first.layerId,
    style: first.style,
    data: {
      ...first.data,
      shape: 'rectangle',
      seatLayout:
        bounds.width >= bounds.height * 1.5 || bounds.height >= bounds.width * 1.5
          ? 'long-sides'
          : 'around',
      seats: tables.reduce((sum, table) => sum + getCapacity(table), 0),
      number: numbers.join('+'),
      mergedFrom: originals,
    },
  })
  const index = Math.max(...tables.map((table) => editor.store.getNodeIndex(table.id)))

  editor.store.transact('Merge tables', () => {
    editor.store.addNode(merged, index + 1)
    tables.forEach((table) => editor.store.removeNode(table.id))
  })
  editor.setSelection([merged.id])

  return editor.store.getNode(merged.id)!
}

/** Restores the tables a merged table was made of. Returns their ids. */
export function splitTable(editor: DiagramEditor, id: DiagramId): DiagramId[] {
  const table = editor.store.getNode(id)
  const originals = isTable(table) ? (table.data?.mergedFrom ?? []) : []

  if (!table || originals.length === 0 || !editor.isNodeEditable(table)) {
    return []
  }

  const index = editor.store.getNodeIndex(id)
  const restored: DiagramId[] = []

  editor.store.transact('Split table', () => {
    editor.store.removeNode(id)

    originals.forEach((original, offset) => {
      // Keep the status of the merged table, the party is still seated.
      const node: DiagramNode = {
        ...original,
        data: { ...original.data, status: table.data?.status ?? original.data?.status },
      }
      const free =
        editor.store.hasNode(node.id) || editor.store.hasEdge(node.id)
          ? { ...node, id: editor.store.createId('table') }
          : node
      editor.store.addNode(free, index + offset)
      restored.push(free.id)
    })
  })
  editor.setSelection(restored)

  return restored
}

/** Zone a seating node belongs to: the topmost zone containing its center. */
export function getZoneOf(editor: DiagramEditor, node: DiagramNode): DiagramNode | undefined {
  const center = boxCenter(node)
  const zones = editor.store
    .getNodes()
    .filter((item) => item.type === ZONE_TYPE && editor.isNodeVisible(item))

  for (let index = zones.length - 1; index >= 0; index -= 1) {
    if (pointInPolygon(center, editor.getNodeOutline(zones[index]))) {
      return zones[index]
    }
  }

  return undefined
}

export interface RestaurantSummary {
  tables: number
  seats: number
  /** Seats of tables whose status counts as available */
  availableSeats: number
  byStatus: Record<string, { tables: number; seats: number }>
  byZone: Record<string, { name: string; kind?: string; tables: number; seats: number }>
}

/** Capacity per status and per zone. `statusOf` defaults to the stored table status. */
export function summarizeRestaurant(
  editor: DiagramEditor,
  options: {
    statusOf?: (node: DiagramNode) => string
    statuses?: Record<string, TableStatusDefinition>
  } = {},
): RestaurantSummary {
  const statuses = options.statuses ?? DEFAULT_TABLE_STATUSES
  const statusOf = options.statusOf ?? ((node: DiagramNode) => node.data?.status ?? DEFAULT_STATUS)
  const summary: RestaurantSummary = {
    tables: 0,
    seats: 0,
    availableSeats: 0,
    byStatus: {},
    byZone: {},
  }

  for (const node of editor.store.getNodes()) {
    if (!SEATING_TYPES.has(node.type) || !editor.isNodeVisible(node)) {
      continue
    }

    const seats = getCapacity(node)
    const status = statusOf(node)
    summary.tables += 1
    summary.seats += seats

    if (statuses[status]?.available) {
      summary.availableSeats += seats
    }

    const entry = (summary.byStatus[status] ??= { tables: 0, seats: 0 })
    entry.tables += 1
    entry.seats += seats

    const zone = getZoneOf(editor, node)

    if (zone) {
      const zoneEntry = (summary.byZone[zone.id] ??= {
        name: zone.label || zone.id,
        kind: zone.data?.kind,
        tables: 0,
        seats: 0,
      })
      zoneEntry.tables += 1
      zoneEntry.seats += seats
    }
  }

  return summary
}

export type RestaurantIssueType =
  | 'overlap'
  | 'spacing'
  | 'walkway'
  | 'restricted'
  | 'outside-boundary'
  | 'duplicate-number'
  | 'no-seats'

export interface RestaurantIssue {
  type: RestaurantIssueType
  severity: 'error' | 'warning'
  nodeIds: DiagramId[]
  message: string
}

export interface RestaurantLayoutRules {
  /** Minimum clear distance between seating footprints (chairs included) in world units, `60` by default */
  minSpacing?: number
  /** Seating may not touch walkway zones, `true` by default */
  keepWalkwaysClear?: boolean
  /** Seating may not be placed in restricted zones, `true` by default */
  respectRestrictedZones?: boolean
  /** Seating must be inside the floor boundary of the document, when one is set. `true` by default */
  requireInsideBoundary?: boolean
  /** Table numbers must be unique, `true` by default */
  uniqueNumbers?: boolean
}

/**
 * Checks a restaurant layout against spacing and zoning rules. Distances use the footprints of
 * tables including their chairs.
 */
export function validateRestaurantLayout(
  editor: DiagramEditor,
  rules: RestaurantLayoutRules = {},
): RestaurantIssue[] {
  const minSpacing = rules.minSpacing ?? 60
  const issues: RestaurantIssue[] = []
  const seating = editor.store
    .getNodes()
    .filter((node) => SEATING_TYPES.has(node.type) && editor.isNodeVisible(node))
  const outlines = new Map(seating.map((node) => [node.id, editor.getNodeOutline(node)]))
  const label = (node: DiagramNode) => `Table ${node.data?.number ?? node.label ?? node.id}`
  const checked = new Set<string>()

  for (const node of seating) {
    const outline = outlines.get(node.id)!
    const area = expandRect(rectFromPoints(outline), minSpacing)

    for (const id of editor.queryNodes(area)) {
      const other = outlines.has(id) ? editor.store.getNode(id) : undefined

      if (!other || other.id === node.id) {
        continue
      }

      const key = node.id < id ? `${node.id}|${id}` : `${id}|${node.id}`

      if (checked.has(key)) {
        continue
      }

      checked.add(key)
      const otherOutline = outlines.get(id)!

      if (polygonsOverlap(outline, otherOutline)) {
        issues.push({
          type: 'overlap',
          severity: 'error',
          nodeIds: [node.id, id],
          message: `${label(node)} overlaps ${label(other)}`,
        })
      } else if (minSpacing > 0 && polygonDistance(outline, otherOutline) < minSpacing) {
        issues.push({
          type: 'spacing',
          severity: 'warning',
          nodeIds: [node.id, id],
          message: `${label(node)} is too close to ${label(other)}`,
        })
      }
    }
  }

  const zones = editor.store
    .getNodes()
    .filter((node) => node.type === ZONE_TYPE && editor.isNodeVisible(node))

  for (const zone of zones) {
    const kind = zone.data?.kind
    const blocking =
      (kind === 'walkway' && rules.keepWalkwaysClear !== false) ||
      (kind === 'restricted' && rules.respectRestrictedZones !== false)

    if (!blocking) {
      continue
    }

    const zoneOutline = editor.getNodeOutline(zone)

    for (const node of seating) {
      if (polygonsOverlap(outlines.get(node.id)!, zoneOutline)) {
        issues.push({
          type: kind === 'walkway' ? 'walkway' : 'restricted',
          severity: 'error',
          nodeIds: [node.id, zone.id],
          message:
            `${label(node)} ${kind === 'walkway' ? 'blocks the walkway' : 'is in a restricted area'} ${zone.label ?? ''}`.trim(),
        })
      }
    }
  }

  const bounds = editor.settings.bounds

  if (bounds && rules.requireInsideBoundary !== false) {
    for (const node of seating) {
      if (!rectContainsRect(bounds, rectFromPoints(outlines.get(node.id)!))) {
        issues.push({
          type: 'outside-boundary',
          severity: 'error',
          nodeIds: [node.id],
          message: `${label(node)} is outside of the floor`,
        })
      }
    }
  }

  if (rules.uniqueNumbers !== false) {
    const byNumber = new Map<string, DiagramId[]>()

    for (const node of seating) {
      const number = node.data?.number

      if (number !== undefined && number !== '') {
        const key = String(number)
        byNumber.set(key, [...(byNumber.get(key) ?? []), node.id])
      }
    }

    for (const [number, ids] of byNumber) {
      if (ids.length > 1) {
        issues.push({
          type: 'duplicate-number',
          severity: 'error',
          nodeIds: ids,
          message: `Table number ${number} is used ${ids.length} times`,
        })
      }
    }
  }

  for (const node of seating) {
    if (getCapacity(node) === 0) {
      issues.push({
        type: 'no-seats',
        severity: 'warning',
        nodeIds: [node.id],
        message: `${label(node)} has no seats`,
      })
    }
  }

  return issues
}

/** World position of the center of a seat, e.g. to place a guest marker. */
export function seatToWorld(table: DiagramNode, seat: { x: number; y: number }) {
  return localToWorld(seat, table)
}
