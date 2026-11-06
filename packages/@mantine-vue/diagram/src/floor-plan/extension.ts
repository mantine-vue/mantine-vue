import type { DiagramEditor } from '../core/editor'
import { distance, type Point } from '../core/geometry'
import type { DiagramId, DiagramNode, DiagramScale } from '../core/types'
import { DEFAULT_SCALE } from '../core/units'
import type { DiagramExtension, DiagramTemplate } from '../vue/types'
import { createFurnitureTemplates } from './furniture'
import {
  COLUMN_TYPE,
  DIMENSION_TYPE,
  DOOR_TYPE,
  findCollisions,
  findHostWall,
  FURNITURE_TYPE,
  getSegmentEndpoints,
  OPENING_TYPES,
  placeOpening,
  ROOM_TYPE,
  STAIRS_TYPE,
  WALL_TYPE,
  WINDOW_TYPE,
} from './geometry'
import { createFloorPlanNodeTypes } from './node-types'
import { createFloorPlanRuntime, FLOOR_PLAN_STATE_KEY } from './runtime'
import { createDimensionTool, createOpeningTool, createRoomTool, createWallTool } from './tools'

export const COLLISIONS_STATE_KEY = 'collisions'

export interface FloorPlanExtensionOptions {
  /** Real world scale applied to documents without one, 100 world units per meter by default */
  scale?: DiagramScale
  /** Default wall thickness in world units, 15 by default */
  wallThickness?: number
  /** Snaps doors and windows into walls and keeps them there when walls move, `true` by default */
  attachOpenings?: boolean
  /**
   * `'highlight'` marks overlapping objects, `'prevent'` rejects moves that make them overlap,
   * `false` disables collision detection. `'highlight'` by default
   */
  collisions?: 'highlight' | 'prevent' | false
  /** Node types that may not overlap each other */
  collisionTypes?: string[]
  /** Registers the wall, room, door, window and dimension tools, `true` by default */
  tools?: boolean
  /** Adds architectural and furniture templates for palettes, `true` by default */
  templates?: boolean
}

export const DEFAULT_COLLISION_TYPES = [
  FURNITURE_TYPE,
  COLUMN_TYPE,
  STAIRS_TYPE,
  'restaurant-table',
  'restaurant-booth',
  'restaurant-bar',
]

/** Architectural templates for palettes. */
export function createArchitectureTemplates(thickness = 15): DiagramTemplate[] {
  const category = 'Structure'

  return [
    {
      id: 'floor:wall',
      label: 'Wall',
      category,
      node: { type: WALL_TYPE, width: 300, height: thickness },
    },
    {
      id: 'floor:door',
      label: 'Door',
      category,
      node: { type: DOOR_TYPE, width: 90, height: thickness, data: { kind: 'single' } },
    },
    {
      id: 'floor:double-door',
      label: 'Double door',
      category,
      node: { type: DOOR_TYPE, width: 160, height: thickness, data: { kind: 'double' } },
    },
    {
      id: 'floor:sliding-door',
      label: 'Sliding door',
      category,
      node: { type: DOOR_TYPE, width: 160, height: thickness, data: { kind: 'sliding' } },
    },
    {
      id: 'floor:window',
      label: 'Window',
      category,
      node: { type: WINDOW_TYPE, width: 120, height: thickness },
    },
    { id: 'floor:room', label: 'Room', category, node: { type: ROOM_TYPE, label: 'Room' } },
    {
      id: 'floor:column',
      label: 'Column',
      category,
      node: { type: COLUMN_TYPE, width: 40, height: 40 },
    },
    {
      id: 'floor:round-column',
      label: 'Round column',
      category,
      node: { type: COLUMN_TYPE, width: 40, height: 40, data: { shape: 'round' } },
    },
    {
      id: 'floor:stairs',
      label: 'Stairs',
      category,
      node: { type: STAIRS_TYPE, width: 100, height: 300 },
    },
    {
      id: 'floor:dimension',
      label: 'Dimension',
      category,
      node: { type: DIMENSION_TYPE, width: 300, height: 30 },
    },
  ]
}

/** Moves a node right above another one in the rendering order, when it is below it. */
function ensureAbove(editor: DiagramEditor, id: DiagramId, below: DiagramId) {
  const order = editor.store.getNodeOrder()
  const index = order.indexOf(id)
  const target = order.indexOf(below)

  if (index === -1 || target === -1 || index > target) {
    return
  }

  const next = order.filter((item) => item !== id)
  next.splice(next.indexOf(below) + 1, 0, id)
  editor.store.setNodeOrder(next)
}

/** Openings attached to a wall. */
function getAttachedOpenings(editor: DiagramEditor, wallId: DiagramId): DiagramNode[] {
  return editor.store
    .getNodes()
    .filter((node) => OPENING_TYPES.has(node.type) && node.data?.wallId === wallId)
}

/**
 * Keeps openings in walls: a moved opening snaps into the closest wall (or leaves it), and the
 * openings of a moved wall follow it. Runs inside the transaction of the transform.
 */
export function syncOpenings(editor: DiagramEditor, ids: ReadonlySet<DiagramId>) {
  for (const id of ids) {
    const node = editor.store.getNode(id)

    if (!node) {
      continue
    }

    if (OPENING_TYPES.has(node.type)) {
      const host = findHostWall(editor, node)

      if (host) {
        const { box, offset } = placeOpening(node, host)
        editor.store.updateNode(id, { ...box, data: { ...node.data, wallId: host.id, offset } })
        ensureAbove(editor, id, host.id)
      } else if (node.data?.wallId) {
        const { wallId: _wallId, offset: _offset, ...data } = node.data
        editor.store.updateNode(id, { data })
      }

      continue
    }

    if (node.type === WALL_TYPE) {
      for (const opening of getAttachedOpenings(editor, id)) {
        if (ids.has(opening.id)) {
          continue
        }

        const [start, end] = getSegmentEndpoints(node)
        const length = distance(start, end)
        const offset = Math.min(opening.data?.offset ?? length / 2, length)
        const center: Point = {
          x: start.x + ((end.x - start.x) / Math.max(length, 1e-9)) * offset,
          y: start.y + ((end.y - start.y) / Math.max(length, 1e-9)) * offset,
        }
        const placement = placeOpening(opening, node, center)
        editor.store.updateNode(opening.id, {
          ...placement.box,
          data: { ...opening.data, offset: placement.offset },
        })
      }
    }
  }
}

/**
 * Floor planning: walls with mitered joins, doors and windows that live in walls, rooms with
 * areas, columns, stairs, dimension lines, a furniture library and collision detection.
 */
export function floorPlanExtension(options: FloorPlanExtensionOptions = {}): DiagramExtension {
  const thickness = options.wallThickness ?? 15
  const collisionTypes = new Set(options.collisionTypes ?? DEFAULT_COLLISION_TYPES)
  const collisions = options.collisions ?? 'highlight'

  return {
    name: 'floor-plan',
    nodeTypes: createFloorPlanNodeTypes({ wallThickness: thickness }),
    tools:
      options.tools === false
        ? []
        : [
            createWallTool({ thickness: options.wallThickness }),
            createRoomTool(),
            createOpeningTool({ type: DOOR_TYPE }),
            createOpeningTool({ type: WINDOW_TYPE }),
            createDimensionTool(),
          ],
    templates:
      options.templates === false
        ? []
        : [
            ...createArchitectureTemplates(thickness),
            ...createFurnitureTemplates(options.scale ?? DEFAULT_SCALE),
          ],
    setup(controller) {
      const { editor } = controller
      const cleanups: (() => void)[] = []

      if (!editor.settings.scale) {
        editor.store.transact(
          'Set scale',
          () => editor.store.updateSettings({ scale: options.scale ?? DEFAULT_SCALE }),
          { history: false },
        )
      }

      const runtime = createFloorPlanRuntime(controller)
      controller.state[FLOOR_PLAN_STATE_KEY] = runtime
      cleanups.push(() => {
        runtime.dispose()
        delete controller.state[FLOOR_PLAN_STATE_KEY]
      })

      if (options.attachOpenings !== false) {
        // Saved documents may only store the wall and offset of an opening: place them.
        const placeAll = () => {
          const walls = editor.store.getNodes().filter((node) => node.type === WALL_TYPE)

          if (walls.length > 0) {
            editor.store.transact(
              'Place openings',
              () => syncOpenings(editor, new Set(walls.map((node) => node.id))),
              {
                history: false,
              },
            )
          }
        }

        placeAll()
        cleanups.push(
          editor.addTransformHook((target, ids) => syncOpenings(target, ids)),
          editor.events.on('change', (change) => {
            if (change.source === 'load') {
              placeAll()
            }
          }),
        )
      }

      if (collisions === 'highlight') {
        let scheduled = false
        const recompute = () => {
          scheduled = false
          const ids = new Set<DiagramId>()

          for (const pair of findCollisions(editor, { types: collisionTypes })) {
            ids.add(pair.a)
            ids.add(pair.b)
          }

          const current = controller.state[COLLISIONS_STATE_KEY] as Set<DiagramId> | undefined

          if (!current || current.size !== ids.size || [...ids].some((id) => !current.has(id))) {
            controller.state[COLLISIONS_STATE_KEY] = ids
          }
        }

        recompute()
        cleanups.push(
          editor.events.on('change', () => {
            if (!scheduled) {
              scheduled = true
              queueMicrotask(recompute)
            }
          }),
          () => delete controller.state[COLLISIONS_STATE_KEY],
        )
      }

      if (collisions === 'prevent') {
        const previousValidate = editor.options.validateTransform
        editor.setOptions({
          validateTransform: (target, nodes) => {
            if (previousValidate && !previousValidate(target, nodes)) {
              return false
            }

            return findCollisions(target, { types: collisionTypes, candidates: nodes }).length === 0
          },
        })
        cleanups.push(() => editor.setOptions({ validateTransform: previousValidate }))
      }

      return () => cleanups.forEach((cleanup) => cleanup())
    },
  }
}
