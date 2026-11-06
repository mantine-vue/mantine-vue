import type { DiagramEditor, DiagramTool } from '../editor'
import {
  angleBetween,
  degToRad,
  distance,
  rectFromCorners,
  snapAngle,
  type Point,
} from '../geometry'
import { fitPointsToBox } from '../shapes'
import { snapPointToGrid } from '../snapping'
import type { DiagramEdge, DiagramEdgeEndpoint, DiagramNode, DiagramPointerEvent } from '../types'
import { formatLength } from '../units'
import { DRAG_THRESHOLD, findConnectionTarget } from './select-tool'

/** Drags the viewport. Pointer events of the pan tool are handled by the editor itself. */
export function createPanTool(): DiagramTool {
  return { id: 'pan', label: 'Pan', icon: 'hand', cursor: 'grab' }
}

const snapIfEnabled = (editor: DiagramEditor, p: Point, event?: { altKey: boolean }) =>
  editor.options.snapToGrid && !event?.altKey ? snapPointToGrid(p, editor.gridSize) : p

export interface ShapeToolOptions {
  id: string
  label?: string
  icon?: string
  /** Node created by the tool. Size and position come from the drag */
  node: Partial<Omit<DiagramNode, 'id'>> & { type: string }
  /** Keep the tool active after creating a node, `false` returns to the select tool */
  sticky?: boolean
}

/**
 * Draws a node by dragging a rectangle, or creates one with its default size on click.
 * Shift keeps a square, Alt disables snapping.
 */
export function createShapeTool(options: ShapeToolOptions): DiagramTool {
  let start: DiagramPointerEvent | null = null
  let origin: Point | null = null

  return {
    id: options.id,
    label: options.label,
    icon: options.icon,
    cursor: 'crosshair',
    edits: true,

    pointerDown(editor, event) {
      if (event.button !== 0 || !editor.canEdit) {
        return
      }

      start = event
      origin = snapIfEnabled(editor, event.world, event)
    },

    pointerMove(editor, event) {
      if (!start || !origin) {
        return
      }

      let corner = snapIfEnabled(editor, event.world, event)

      if (event.shiftKey) {
        const size = Math.max(Math.abs(corner.x - origin.x), Math.abs(corner.y - origin.y))
        corner = {
          x: origin.x + Math.sign(corner.x - origin.x || 1) * size,
          y: origin.y + Math.sign(corner.y - origin.y || 1) * size,
        }
      }

      const rect = rectFromCorners(origin, corner)
      editor.setOverlay({
        draft: { points: [], closed: true, rect },
        measurements: [
          {
            from: { x: rect.x, y: rect.y + rect.height },
            to: { x: rect.x + rect.width, y: rect.y + rect.height },
            text: `${formatLength(rect.width, editor.scale)} × ${formatLength(rect.height, editor.scale)}`,
          },
        ],
      })
    },

    pointerUp(editor, event) {
      if (!start || !origin) {
        return
      }

      const dragged = distance(start.screen, event.screen) >= DRAG_THRESHOLD
      const rect = editor.overlay.draft?.rect
      const defaults = editor.createNode({ ...options.node })
      const node =
        dragged && rect && rect.width > 2 && rect.height > 2
          ? { ...options.node, ...rect }
          : {
              ...options.node,
              x: origin.x - defaults.width / 2,
              y: origin.y - defaults.height / 2,
              width: defaults.width,
              height: defaults.height,
            }

      start = null
      origin = null
      editor.setOverlay({ draft: null, measurements: [] })
      editor.addNode(node, { select: true })

      if (!options.sticky) {
        editor.setTool('select')
      }
    },

    cancel(editor) {
      start = null
      origin = null
      editor.setOverlay({ draft: null, measurements: [] })
    },
  }
}

/** Creates a text node on click and starts editing it. */
export function createTextTool(options: { id?: string; label?: string } = {}): DiagramTool {
  return {
    id: options.id ?? 'text',
    label: options.label ?? 'Text',
    icon: 'text',
    cursor: 'text',
    edits: true,

    pointerUp(editor, event) {
      if (event.button !== 0 || !editor.canEdit) {
        return
      }

      const point = snapIfEnabled(editor, event.world, event)
      const node = editor.addNode(
        { type: 'text', x: point.x, y: point.y - 20, label: '' },
        { select: true },
      )
      editor.setTool('select')
      editor.startTextEdit({ kind: 'node', id: node.id })
    },
  }
}

/**
 * Draws connectors by dragging between nodes. Dropping on the canvas creates a connector with
 * a free end, starting on the canvas creates one with two free ends.
 */
export function createConnectorTool(
  options: { id?: string; label?: string; edge?: Partial<DiagramEdge>; sticky?: boolean } = {},
): DiagramTool {
  let from: { endpoint: DiagramEdgeEndpoint; point: Point; screen: Point } | null = null

  const reset = (editor: DiagramEditor) => {
    from = null
    editor.setOverlay({ connection: null, hoverNodeId: null })
  }

  return {
    id: options.id ?? 'connector',
    label: options.label ?? 'Connector',
    icon: 'connector',
    cursor: 'crosshair',
    edits: true,

    pointerDown(editor, event) {
      if (event.button !== 0 || !editor.canEdit) {
        return
      }

      const target =
        event.target.kind === 'port'
          ? { nodeId: event.target.nodeId, portId: event.target.portId }
          : findConnectionTarget(editor, event.world)

      if (target) {
        const point = 'point' in target ? target.point : event.world
        from = {
          endpoint: { nodeId: target.nodeId, portId: target.portId },
          point,
          screen: event.screen,
        }
      } else {
        const point = snapIfEnabled(editor, event.world, event)
        from = { endpoint: { point }, point, screen: event.screen }
      }
    },

    pointerMove(editor, event) {
      if (!from) {
        const target = findConnectionTarget(editor, event.world)
        editor.setOverlay({ hoverNodeId: target?.nodeId ?? null })
        return
      }

      const target = findConnectionTarget(editor, event.world, from.endpoint.nodeId)
      const valid =
        !target ||
        !from.endpoint.nodeId ||
        editor.isConnectionValid({
          sourceNodeId: from.endpoint.nodeId,
          sourcePortId: from.endpoint.portId,
          targetNodeId: target.nodeId,
          targetPortId: target.portId,
        })

      editor.setOverlay({
        connection: {
          from: from.point,
          to: target && valid ? target.point : snapIfEnabled(editor, event.world, event),
          targetNodeId: target?.nodeId,
          targetPortId: target?.portId,
          valid,
        },
        hoverNodeId: target?.nodeId ?? null,
      })
    },

    pointerUp(editor, event) {
      if (!from) {
        return
      }

      const connection = editor.overlay.connection
      const start = from
      reset(editor)

      if (
        !connection ||
        distance(start.screen, event.screen) < DRAG_THRESHOLD ||
        !connection.valid
      ) {
        return
      }

      const target: DiagramEdgeEndpoint = connection.targetNodeId
        ? { nodeId: connection.targetNodeId, portId: connection.targetPortId }
        : { point: connection.to }

      if (start.endpoint.nodeId && target.nodeId) {
        editor.connect(
          { nodeId: start.endpoint.nodeId, portId: start.endpoint.portId },
          { nodeId: target.nodeId, portId: target.portId },
          options.edge,
        )
      } else {
        const edge = editor.addEdge({ ...options.edge, source: start.endpoint, target })
        editor.setSelection([edge.id])
      }

      if (!options.sticky) {
        editor.setTool('select')
      }
    },

    cancel: reset,
  }
}

export interface PolylineToolOptions {
  id: string
  label?: string
  icon?: string
  /** Closed tools draw polygons, open ones polylines */
  closed: boolean
  /** Fewest points that make a valid shape, `3` for polygons and `2` for polylines by default */
  minPoints?: number
  /** Finishes automatically once this many points were placed, e.g. `2` for measurements */
  maxPoints?: number
  /** Adjusts a point while drawing, e.g. to snap to the ends of walls */
  snapPoint?: (editor: DiagramEditor, point: Point, previous: Point | undefined) => Point
  /** Turns the drawn world points into elements */
  complete: (editor: DiagramEditor, points: Point[]) => void
  /** Label shown next to the segment being drawn, the length by default */
  measure?: (editor: DiagramEditor, from: Point, to: Point) => string
  /** Keep the tool active after a shape is finished, `true` by default */
  sticky?: boolean
}

/**
 * Click to add points, double click or Enter to finish, Backspace removes the last point and
 * Escape cancels. Shift locks segments to 45° steps.
 */
export function createPolylineTool(options: PolylineToolOptions): DiagramTool {
  let points: Point[] = []
  let cursor: Point | null = null
  const minPoints = options.minPoints ?? (options.closed ? 3 : 2)

  const resolvePoint = (editor: DiagramEditor, event: DiagramPointerEvent) => {
    const previous = points[points.length - 1]
    let p = snapIfEnabled(editor, event.world, event)

    if (event.shiftKey && previous) {
      const angle = snapAngle(angleBetween(previous, event.world), 45)
      const length = distance(previous, event.world)
      p = {
        x: previous.x + Math.cos(degToRad(angle)) * length,
        y: previous.y + Math.sin(degToRad(angle)) * length,
      }
    }

    return options.snapPoint ? options.snapPoint(editor, p, previous) : p
  }

  const render = (editor: DiagramEditor) => {
    const draft = cursor ? [...points, cursor] : [...points]
    const last = points[points.length - 1]
    const measure = options.measure ?? ((e, a, b) => formatLength(distance(a, b), e.scale))

    editor.setOverlay({
      draft: draft.length > 0 ? { points: draft, closed: options.closed } : null,
      measurements:
        last && cursor ? [{ from: last, to: cursor, text: measure(editor, last, cursor) }] : [],
    })
  }

  const finish = (editor: DiagramEditor) => {
    const result = points
    points = []
    cursor = null
    editor.setOverlay({ draft: null, measurements: [] })

    if (result.length >= minPoints) {
      options.complete(editor, result)

      if (options.sticky === false) {
        editor.setTool('select')
      }
    }
  }

  return {
    id: options.id,
    label: options.label,
    icon: options.icon,
    cursor: 'crosshair',
    edits: true,

    pointerDown(editor, event) {
      if (event.button !== 0 || !editor.canEdit) {
        return
      }

      const p = resolvePoint(editor, event)
      const first = points[0]

      // Clicking the first point closes a polygon.
      if (
        options.closed &&
        first &&
        points.length >= minPoints &&
        distance(first, p) < 8 / editor.viewport.zoom
      ) {
        finish(editor)
        return
      }

      const last = points[points.length - 1]

      if (!last || distance(last, p) > 1e-6) {
        points.push(p)
      }

      if (options.maxPoints && points.length >= options.maxPoints) {
        finish(editor)
        return
      }

      render(editor)
    },

    pointerMove(editor, event) {
      if (points.length === 0) {
        return
      }

      cursor = resolvePoint(editor, event)
      render(editor)
    },

    doubleClick(editor) {
      finish(editor)
    },

    keyDown(editor, event) {
      if (points.length === 0) {
        return false
      }

      if (event.key === 'Enter') {
        finish(editor)
        return true
      }

      if (event.key === 'Escape') {
        points = []
        cursor = null
        editor.setOverlay({ draft: null, measurements: [] })
        return true
      }

      if (event.key === 'Backspace') {
        points.pop()
        render(editor)
        return true
      }

      return false
    },

    cancel(editor) {
      points = []
      cursor = null
      editor.setOverlay({ draft: null, measurements: [] })
    },
  }
}

/** Polygon and line drawing tools for the built-in `polygon` and `line` types. */
export function createPointsShapeTool(options: {
  id: string
  type: 'polygon' | 'line'
  label?: string
  icon?: string
  node?: Partial<DiagramNode>
}): DiagramTool {
  return createPolylineTool({
    id: options.id,
    label: options.label,
    icon: options.icon,
    closed: options.type === 'polygon',
    sticky: false,
    complete(editor, points) {
      const box = fitPointsToBox(points)
      editor.addNode(
        {
          ...options.node,
          type: options.type,
          x: box.x,
          y: box.y,
          width: Math.max(box.width, 1),
          height: Math.max(box.height, 1),
          data: { ...options.node?.data, points: box.points },
        },
        { select: true },
      )
    },
  })
}
