import type { DiagramEditor, DiagramTool } from '../core/editor'
import { distance, type Point } from '../core/geometry'
import { fitPointsToBox } from '../core/shapes'
import { createPolylineTool, createShapeTool } from '../core/tools/basic-tools'
import type { DiagramNode } from '../core/types'
import { formatLength, metersToWorld } from '../core/units'
import {
  DIMENSION_TYPE,
  DOOR_TYPE,
  findHostWall,
  placeOpening,
  ROOM_TYPE,
  segmentBox,
  snapToWalls,
  WALL_TYPE,
  WINDOW_TYPE,
} from './geometry'

/** Default wall thickness of 15 cm in the units of the document. */
export function defaultWallThickness(editor: DiagramEditor) {
  const scale = editor.scale

  return scale.unit === 'px' ? 15 : metersToWorld(0.15, scale)
}

const wallSnap = (editor: DiagramEditor, p: Point) =>
  snapToWalls(editor, p, 10 / editor.viewport.zoom).point

/**
 * Draws walls: click to place corners, double click or Enter to finish. Points snap to the ends
 * and centerlines of existing walls, so new walls join them.
 */
export function createWallTool(options: { id?: string; thickness?: number } = {}): DiagramTool {
  return createPolylineTool({
    id: options.id ?? 'wall',
    label: 'Wall',
    icon: 'wall',
    closed: false,
    snapPoint: (editor, p) => wallSnap(editor, p),
    complete(editor, points) {
      const thickness = options.thickness ?? defaultWallThickness(editor)
      const segments = points.slice(1).map((point, index) => [points[index], point] as const)
      const walls = segments
        .filter(([a, b]) => distance(a, b) > 1)
        .map(([a, b]) => ({ type: WALL_TYPE, ...segmentBox(a, b, thickness) }))

      if (walls.length > 0) {
        editor.addNodes(walls, { select: true })
      }
    },
  })
}

/** Draws a room outline point by point. Clicking the first point closes it. */
export function createRoomTool(options: { id?: string; label?: string } = {}): DiagramTool {
  return createPolylineTool({
    id: options.id ?? 'room',
    label: 'Room',
    icon: 'room',
    closed: true,
    sticky: false,
    snapPoint: (editor, p) => wallSnap(editor, p),
    complete(editor, points) {
      const box = fitPointsToBox(points)
      editor.addNode(
        {
          type: ROOM_TYPE,
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
          label: options.label ?? 'Room',
          data: { points: box.points, showArea: true },
        },
        { select: true },
      )
    },
  })
}

/** Measures a distance with two clicks and keeps the dimension line. */
export function createDimensionTool(options: { id?: string } = {}): DiagramTool {
  return createPolylineTool({
    id: options.id ?? 'dimension',
    label: 'Dimension',
    icon: 'dimension',
    closed: false,
    minPoints: 2,
    maxPoints: 2,
    snapPoint: (editor, p) => wallSnap(editor, p),
    complete(editor, [a, b]) {
      editor.addNode({ type: DIMENSION_TYPE, ...segmentBox(a, b, 30) }, { select: true })
    },
  })
}

/**
 * Measures a known distance on a background plan: click two points and `onMeasure` receives
 * the length in world units, e.g. to ask for the real length and call `calibrateScale`.
 */
export function createCalibrationTool(options: {
  id?: string
  onMeasure: (worldLength: number, editor: DiagramEditor) => void
}): DiagramTool {
  return createPolylineTool({
    id: options.id ?? 'calibrate',
    label: 'Calibrate scale',
    icon: 'ruler',
    closed: false,
    minPoints: 2,
    maxPoints: 2,
    sticky: false,
    measure: (editor, a, b) => formatLength(distance(a, b), editor.scale),
    complete(editor, [a, b]) {
      options.onMeasure(distance(a, b), editor)
    },
  })
}

/** Places a door or window with a click. Clicked near a wall, it snaps into the wall. */
export function createOpeningTool(
  options: {
    id?: string
    type?: typeof DOOR_TYPE | typeof WINDOW_TYPE
    node?: Partial<DiagramNode>
  } = {},
): DiagramTool {
  const type = options.type ?? DOOR_TYPE
  const shape = createShapeTool({
    id: options.id ?? (type === DOOR_TYPE ? 'door' : 'window'),
    label: type === DOOR_TYPE ? 'Door' : 'Window',
    icon: type === DOOR_TYPE ? 'door' : 'window',
    node: { ...options.node, type },
  })

  return {
    ...shape,
    pointerUp(editor, event) {
      if (!editor.canEdit) {
        return
      }

      shape.cancel?.(editor)
      const draft = editor.createNode({ ...options.node, type })
      const centered = {
        ...draft,
        x: event.world.x - draft.width / 2,
        y: event.world.y - draft.height / 2,
      }
      const host = findHostWall(editor, centered, 60 / editor.viewport.zoom)
      const placement = host ? placeOpening(centered, host, event.world) : null

      const node =
        placement && host
          ? {
              ...centered,
              ...placement.box,
              data: { ...centered.data, wallId: host.id, offset: placement.offset },
            }
          : centered

      editor.store.transact(`Add ${shape.label}`, () => {
        editor.store.addNode(node)
        // Lets the floor plan extension order the opening above its wall.
        editor.notifyTransform([node.id])
      })
      editor.setSelection([node.id])
      editor.setTool('select')
    },
  }
}
