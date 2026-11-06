import type { DiagramCommand } from '../core/editor'
import type { DiagramExtension, DiagramTemplate } from '../vue/types'
import {
  createRestaurantNodeTypes,
  STATUS_DEFINITIONS_STATE_KEY,
  STATUS_STATE_KEY,
} from './node-types'
import { BAR_TYPE, BOOTH_TYPE, TABLE_TYPE, ZONE_TYPE } from './seating'
import {
  DEFAULT_TABLE_STATUSES,
  isTable,
  mergeTables,
  nextTableNumber,
  renumberTables,
  splitTable,
  type TableStatusDefinition,
} from './tables'

export interface RestaurantExtensionOptions {
  /** Status definitions, merged with the defaults. Keys are stored in `data.status` */
  statuses?: Record<string, TableStatusDefinition>
  /** Adds table, booth, bar and zone templates for palettes, `true` by default */
  templates?: boolean
  /** Numbers new tables automatically, `true` by default */
  autoNumber?: boolean
}

/** Tables, booths, bars and zones for palettes. Sizes assume 100 world units per meter. */
export function createRestaurantTemplates(): DiagramTemplate[] {
  const tables = 'Tables'
  const zones = 'Areas'
  const zone = (id: string, label: string, kind: string): DiagramTemplate => ({
    id: `restaurant:zone-${id}`,
    label,
    category: zones,
    node: {
      type: ZONE_TYPE,
      label,
      width: 600,
      height: 400,
      data: {
        kind,
        points: [
          { x: 0, y: 0 },
          { x: 600, y: 0 },
          { x: 600, y: 400 },
          { x: 0, y: 400 },
        ],
      },
    },
  })

  return [
    {
      id: 'restaurant:round-2',
      label: 'Round table for 2',
      category: tables,
      keywords: ['two'],
      node: { type: TABLE_TYPE, width: 70, height: 70, data: { shape: 'round', seats: 2 } },
    },
    {
      id: 'restaurant:round-4',
      label: 'Round table for 4',
      category: tables,
      node: { type: TABLE_TYPE, width: 90, height: 90, data: { shape: 'round', seats: 4 } },
    },
    {
      id: 'restaurant:round-8',
      label: 'Round table for 8',
      category: tables,
      keywords: ['banquet'],
      node: { type: TABLE_TYPE, width: 150, height: 150, data: { shape: 'round', seats: 8 } },
    },
    {
      id: 'restaurant:square-4',
      label: 'Square table for 4',
      category: tables,
      node: { type: TABLE_TYPE, width: 80, height: 80, data: { shape: 'square', seats: 4 } },
    },
    {
      id: 'restaurant:rect-6',
      label: 'Table for 6',
      category: tables,
      node: {
        type: TABLE_TYPE,
        width: 180,
        height: 80,
        data: { shape: 'rectangle', seats: 6, seatLayout: 'long-sides' },
      },
    },
    {
      id: 'restaurant:rect-10',
      label: 'Banquet table for 10',
      category: tables,
      node: { type: TABLE_TYPE, width: 300, height: 90, data: { shape: 'rectangle', seats: 10 } },
    },
    {
      id: 'restaurant:wall-2',
      label: 'Wall table for 2',
      category: tables,
      node: {
        type: TABLE_TYPE,
        width: 70,
        height: 60,
        data: { shape: 'square', seats: 2, seatLayout: 'one-side' },
      },
    },
    {
      id: 'restaurant:booth',
      label: 'Booth for 4',
      category: tables,
      node: { type: BOOTH_TYPE, width: 160, height: 160, data: { seats: 4, layout: 'double' } },
    },
    {
      id: 'restaurant:bar',
      label: 'Bar counter',
      category: tables,
      node: { type: BAR_TYPE, width: 360, height: 60, data: { seats: 6 } },
    },
    zone('dining', 'Dining area', 'dining'),
    zone('outdoor', 'Terrace', 'outdoor'),
    zone('bar', 'Bar area', 'bar'),
    zone('kitchen', 'Kitchen', 'kitchen'),
    zone('walkway', 'Walkway', 'walkway'),
    zone('restricted', 'Staff only', 'restricted'),
  ]
}

function createRestaurantCommands(): DiagramCommand[] {
  const selectedTables = (editor: Parameters<DiagramCommand['run']>[0]) =>
    editor.getSelectedNodes().filter(isTable)

  return [
    {
      id: 'mergeTables',
      label: 'Merge tables',
      shortcuts: ['mod+alt+M'],
      isEnabled: (editor) => selectedTables(editor).length >= 2,
      run: (editor) => mergeTables(editor, editor.selection),
    },
    {
      id: 'splitTable',
      label: 'Split table',
      isEnabled: (editor) =>
        selectedTables(editor).some((table) => (table.data?.mergedFrom?.length ?? 0) > 0),
      run: (editor) => selectedTables(editor).forEach((table) => splitTable(editor, table.id)),
    },
    {
      id: 'renumberTables',
      label: 'Renumber tables',
      run: (editor) => renumberTables(editor),
    },
  ]
}

/**
 * Restaurant layouts: tables with generated seating, booths, bar counters and zones, table
 * statuses with colors, merging and splitting, numbering and layout validation. Statuses from
 * a reservation or POS system can be shown live with `useRestaurantFloor`.
 */
export function restaurantExtension(options: RestaurantExtensionOptions = {}): DiagramExtension {
  const statuses = { ...DEFAULT_TABLE_STATUSES, ...options.statuses }

  return {
    name: 'restaurant',
    nodeTypes: createRestaurantNodeTypes(statuses),
    commands: createRestaurantCommands(),
    templates: options.templates === false ? [] : createRestaurantTemplates(),
    setup(controller) {
      const { editor } = controller
      controller.state[STATUS_DEFINITIONS_STATE_KEY] = statuses
      const cleanups: (() => void)[] = [() => delete controller.state[STATUS_DEFINITIONS_STATE_KEY]]

      if (options.autoNumber !== false) {
        // New seating gets the next free number, in the same transaction it was added in.
        cleanups.push(
          editor.addTransformHook((target, ids) => {
            for (const id of ids) {
              const node = target.store.getNode(id)

              if (
                node &&
                (node.type === TABLE_TYPE || node.type === BOOTH_TYPE || node.type === BAR_TYPE) &&
                node.data?.number === undefined
              ) {
                target.store.updateNodeData(id, { number: nextTableNumber(target) })
              }
            }
          }),
        )
      }

      return () => {
        cleanups.forEach((cleanup) => cleanup())
        delete controller.state[STATUS_STATE_KEY]
      }
    },
  }
}
