import { getEndpointAnchor, getPortPosition } from '../connectors'
import type { DiagramEditor, DiagramTool } from '../editor'
import {
  angleBetween,
  boxCenter,
  distance,
  expandRect,
  localToWorld,
  pointInPolygon,
  rectFromCorners,
  snapAngle,
  snapValue,
  unionRects,
  worldToLocal,
  type Point,
  type Rect,
} from '../geometry'
import { flipLocal, getNodeBounds, getNodePorts } from '../shapes'
import { snapRect } from '../snapping'
import type {
  DiagramEdge,
  DiagramEdgeEndpoint,
  DiagramId,
  DiagramMeasurement,
  DiagramNode,
  DiagramPointerEvent,
  DiagramResizeHandle,
} from '../types'
import { formatLength } from '../units'

/** Screen distance a pointer must travel before a press becomes a drag. */
export const DRAG_THRESHOLD = 3

type Gesture =
  | {
      kind: 'press'
      start: DiagramPointerEvent
      nodeId: DiagramId | null
      edgeId: DiagramId | null
      /** Selection to apply when the press ends without dragging */
      clickSelection: DiagramId[] | null
    }
  | {
      kind: 'move'
      start: Point
      originals: DiagramNode[]
      edges: DiagramEdge[]
      bounds: Rect
      offset: Point
    }
  | { kind: 'marquee'; start: Point; base: DiagramId[]; lasso: Point[] | null }
  | {
      kind: 'resize'
      handle: DiagramResizeHandle
      single: DiagramNode | null
      originals: DiagramNode[]
      frame: Rect
    }
  | { kind: 'rotate'; originals: DiagramNode[]; pivot: Point; startAngle: number; single: boolean }
  | {
      kind: 'connect'
      from: DiagramEdgeEndpoint
      fromPoint: Point
      edge: DiagramEdge | null
      end: 'source' | 'target'
    }
  | { kind: 'waypoint'; edge: DiagramEdge; index: number }
  | { kind: 'vertex'; node: DiagramNode; index: number }

/** Finds the port or node a connector being dragged would attach to. */
export function findConnectionTarget(
  editor: DiagramEditor,
  point: Point,
  exclude?: DiagramId,
): { nodeId: DiagramId; portId?: string; point: Point } | null {
  const radius = (editor.options.connection.radius ?? 24) / editor.viewport.zoom
  const candidates = [
    ...editor.queryNodes(expandRect({ x: point.x, y: point.y, width: 0, height: 0 }, radius)),
  ]
    .map((id) => editor.store.getNode(id)!)
    .filter(
      (node) =>
        node && editor.isNodeVisible(node) && editor.getBehavior(node.type).connectable !== false,
    )
    .filter((node) => !editor.getBehavior(node.type).container)
    .sort((a, b) => editor.store.getNodeIndex(b.id) - editor.store.getNodeIndex(a.id))

  let best: { nodeId: DiagramId; portId?: string; point: Point; distance: number } | null = null

  for (const node of candidates) {
    for (const port of getNodePorts(node, editor.getBehavior(node.type))) {
      if (node.id === exclude && !editor.options.connection.allowSelfLoops) {
        continue
      }

      const position = getPortPosition(node, port)
      const d = distance(position, point)

      if (d <= radius && (!best || d < best.distance)) {
        best = { nodeId: node.id, portId: port.id, point: position, distance: d }
      }
    }
  }

  if (best) {
    return best
  }

  const inside = candidates.find((node) => pointInPolygon(point, editor.getNodeOutline(node)))

  return inside ? { nodeId: inside.id, point: boxCenter(inside) } : null
}

/** World rectangles of visible nodes around the viewport that moving nodes may align with. */
export function getSnapTargets(editor: DiagramEditor, exclude: ReadonlySet<DiagramId>): Rect[] {
  if (!editor.options.smartGuides) {
    return []
  }

  const area = expandRect(editor.getVisibleRect(), 200)
  const targets: Rect[] = []

  for (const id of editor.queryNodes(area)) {
    const node = editor.store.getNode(id)

    if (node && !exclude.has(id) && editor.isNodeVisible(node) && !node.parentId) {
      targets.push(getNodeBounds(node))
    }

    if (targets.length >= 400) {
      break
    }
  }

  return targets
}

export function measurementsFor(
  editor: DiagramEditor,
  node: Pick<DiagramNode, 'x' | 'y' | 'width' | 'height' | 'rotation'>,
): DiagramMeasurement[] {
  const corner = (x: number, y: number) => localToWorld({ x, y }, node)
  const offset = 12 / editor.viewport.zoom

  return [
    {
      from: corner(0, node.height + offset),
      to: corner(node.width, node.height + offset),
      text: formatLength(node.width, editor.scale),
    },
    {
      from: corner(node.width + offset, 0),
      to: corner(node.width + offset, node.height),
      text: formatLength(node.height, editor.scale),
    },
  ]
}

/** Resized rectangle in the local frame of a box, with the opposite edges fixed. */
export function resizeLocalRect(
  size: { width: number; height: number },
  handle: DiagramResizeHandle,
  local: Point,
  options: {
    keepRatio?: boolean
    fromCenter?: boolean
    minWidth?: number
    minHeight?: number
  } = {},
): Rect {
  const { width, height } = size
  const minWidth = options.minWidth ?? 1
  const minHeight = options.minHeight ?? 1
  let left = 0
  let top = 0
  let right = width
  let bottom = height

  if (handle.includes('e')) {
    right = Math.max(local.x, minWidth)
  }

  if (handle.includes('w')) {
    left = Math.min(local.x, width - minWidth)
  }

  if (handle.includes('s')) {
    bottom = Math.max(local.y, minHeight)
  }

  if (handle.includes('n')) {
    top = Math.min(local.y, height - minHeight)
  }

  if (options.fromCenter) {
    if (handle.includes('e')) {
      left = width - right
    }

    if (handle.includes('w')) {
      right = width - left
    }

    if (handle.includes('s')) {
      top = height - bottom
    }

    if (handle.includes('n')) {
      bottom = height - top
    }
  }

  let nextWidth = Math.max(minWidth, right - left)
  let nextHeight = Math.max(minHeight, bottom - top)

  if (options.keepRatio && width > 0 && height > 0) {
    const ratio = width / height
    const horizontal = handle.includes('e') || handle.includes('w')
    const vertical = handle.includes('n') || handle.includes('s')

    if (horizontal && vertical) {
      if (nextWidth / width > nextHeight / height) {
        nextHeight = nextWidth / ratio
      } else {
        nextWidth = nextHeight * ratio
      }
    } else if (horizontal) {
      nextHeight = nextWidth / ratio
    } else {
      nextWidth = nextHeight * ratio
    }

    // Re-anchor at the fixed edges, or at the center for side handles.
    if (options.fromCenter) {
      left = (width - nextWidth) / 2
      top = (height - nextHeight) / 2
    } else {
      left = handle.includes('w') ? width - nextWidth : horizontal && !vertical ? 0 : left
      top = handle.includes('n') ? height - nextHeight : vertical && !horizontal ? 0 : top

      if (horizontal && !vertical) {
        top = (height - nextHeight) / 2
      }

      if (vertical && !horizontal) {
        left = (width - nextWidth) / 2
      }
    }
  }

  return { x: left, y: top, width: nextWidth, height: nextHeight }
}

function selectionFrame(nodes: readonly DiagramNode[]): Rect | null {
  return unionRects(nodes.map((node) => getNodeBounds(node)))
}

/**
 * The default tool: selects, moves, resizes and rotates elements, draws marquee and lasso
 * selections, connects ports, reconnects edge ends and edits waypoints and vertices.
 */
export function createSelectTool(): DiagramTool {
  let gesture: Gesture | null = null
  let transaction = false

  const begin = (editor: DiagramEditor, label: string) => {
    editor.store.begin(label)
    transaction = true
  }

  const end = (editor: DiagramEditor, commit: boolean) => {
    if (transaction) {
      if (commit) {
        editor.store.commit()
      } else {
        editor.store.rollback()
      }
    }

    transaction = false
    gesture = null
    editor.setOverlay({
      snapLines: [],
      marquee: null,
      lasso: null,
      connection: null,
      measurements: [],
    })
  }

  const startMove = (editor: DiagramEditor, start: DiagramPointerEvent, duplicate: boolean) => {
    if (duplicate && editor.canEdit) {
      editor.duplicate()
    }

    const selected = editor.getSelectedIds()
    const originals = editor.getTransformableNodes(selected)
    const nodeIds = new Set(originals.map((node) => node.id))
    const edges = editor.getEdgesMovingWith(
      nodeIds,
      selected.filter((id) => editor.store.hasEdge(id)),
    )
    const topLevel = originals.filter((node) => !node.parentId || !nodeIds.has(node.parentId))
    const bounds = selectionFrame(topLevel) ?? {
      x: start.world.x,
      y: start.world.y,
      width: 0,
      height: 0,
    }

    if (originals.length === 0 && edges.length === 0) {
      gesture = null
      return
    }

    begin(editor, 'Move')
    gesture = { kind: 'move', start: start.world, originals, edges, bounds, offset: { x: 0, y: 0 } }
  }

  const updateMove = (editor: DiagramEditor, event: DiagramPointerEvent) => {
    if (gesture?.kind !== 'move') {
      return
    }

    let dx = event.world.x - gesture.start.x
    let dy = event.world.y - gesture.start.y

    // Shift constrains the movement to the dominant axis.
    if (event.shiftKey) {
      if (Math.abs(dx) > Math.abs(dy)) {
        dy = 0
      } else {
        dx = 0
      }
    }

    let snapLines: ReturnType<typeof snapRect>['lines'] = []

    if (!event.altKey && gesture.originals.length > 0) {
      const moved = { ...gesture.bounds, x: gesture.bounds.x + dx, y: gesture.bounds.y + dy }
      const snap = snapRect(moved, {
        gridSize: editor.options.snapToGrid ? editor.gridSize : 0,
        targets: getSnapTargets(editor, new Set(gesture.originals.map((node) => node.id))),
        guides: editor.settings.guides,
        threshold: editor.options.snapThreshold / editor.viewport.zoom,
      })
      dx += event.shiftKey && dx === 0 ? 0 : snap.dx
      dy += event.shiftKey && dy === 0 ? 0 : snap.dy
      snapLines = snap.lines
    }

    if (editor.options.validateTransform) {
      const moved = gesture.originals.map((node) => ({ ...node, x: node.x + dx, y: node.y + dy }))

      if (!editor.options.validateTransform(editor, moved)) {
        return
      }
    }

    gesture.offset = { x: dx, y: dy }
    editor.applyMove(gesture.originals, dx, dy, gesture.edges)
    editor.setOverlay({ snapLines })
  }

  const updateResize = (editor: DiagramEditor, event: DiagramPointerEvent) => {
    if (gesture?.kind !== 'resize') {
      return
    }

    const { handle, single } = gesture
    const snapToGrid = editor.options.snapToGrid && !event.altKey

    if (single) {
      const behavior = editor.getBehavior(single.type)
      let pointer = event.world

      if (snapToGrid && !single.rotation) {
        pointer = {
          x:
            handle.includes('e') || handle.includes('w')
              ? snapValue(pointer.x, editor.gridSize)
              : pointer.x,
          y:
            handle.includes('n') || handle.includes('s')
              ? snapValue(pointer.y, editor.gridSize)
              : pointer.y,
        }
      }

      const local = resizeLocalRect(single, handle, worldToLocal(pointer, single), {
        keepRatio: event.shiftKey || behavior.resizable === 'proportional',
        fromCenter: event.ctrlKey || event.metaKey,
        minWidth: behavior.minWidth,
        minHeight: behavior.minHeight,
      })
      const center = localToWorld(
        { x: local.x + local.width / 2, y: local.y + local.height / 2 },
        single,
      )
      const next = {
        x: center.x - local.width / 2,
        y: center.y - local.height / 2,
        width: local.width,
        height: local.height,
      }

      if (
        editor.options.validateTransform &&
        !editor.options.validateTransform(editor, [{ ...single, ...next }])
      ) {
        return
      }

      editor.store.batch(() => {
        editor.setNodeBox(single.id, next)
        editor.notifyTransform([single.id])
      })
      editor.setOverlay({
        measurements: measurementsFor(editor, { ...next, rotation: single.rotation }),
      })
      return
    }

    const frame = gesture.frame
    let pointer = event.world

    if (snapToGrid) {
      pointer = {
        x: snapValue(pointer.x, editor.gridSize),
        y: snapValue(pointer.y, editor.gridSize),
      }
    }

    const local = resizeLocalRect(
      frame,
      handle,
      { x: pointer.x - frame.x, y: pointer.y - frame.y },
      {
        keepRatio: event.shiftKey,
        fromCenter: event.ctrlKey || event.metaKey,
      },
    )
    const next = {
      x: frame.x + local.x,
      y: frame.y + local.y,
      width: local.width,
      height: local.height,
    }

    const originals = gesture.originals

    // Every gesture frame starts from the original records.
    editor.store.batch(() => {
      for (const node of originals) {
        editor.store.updateNode(node.id, () => node)
      }

      editor.scaleNodes(originals, frame, next)
      editor.notifyTransform(originals.map((node) => node.id))
    })
    editor.setOverlay({ measurements: measurementsFor(editor, next) })
  }

  const updateRotate = (editor: DiagramEditor, event: DiagramPointerEvent) => {
    if (gesture?.kind !== 'rotate') {
      return
    }

    let delta = angleBetween(gesture.pivot, event.world) - gesture.startAngle

    if (event.shiftKey) {
      const step = gesture.single
        ? (editor.getBehavior(gesture.originals[0].type).rotationStep ??
          editor.options.rotationStep)
        : editor.options.rotationStep
      const base = gesture.single ? (gesture.originals[0].rotation ?? 0) : 0
      delta = snapAngle(base + delta, step) - base
    }

    const originals = gesture.originals
    const pivot = gesture.pivot

    editor.store.batch(() => {
      for (const node of originals) {
        editor.store.updateNode(node.id, () => node)
      }

      editor.applyRotation(originals, delta, pivot)
    })
  }

  const updateConnect = (editor: DiagramEditor, event: DiagramPointerEvent) => {
    if (gesture?.kind !== 'connect') {
      return
    }

    const fixedNode = gesture.from.nodeId
    const target = findConnectionTarget(editor, event.world, fixedNode)
    let valid = false

    if (target && fixedNode) {
      const request =
        gesture.end === 'target'
          ? {
              sourceNodeId: fixedNode,
              sourcePortId: gesture.from.portId,
              targetNodeId: target.nodeId,
              targetPortId: target.portId,
            }
          : {
              sourceNodeId: target.nodeId,
              sourcePortId: target.portId,
              targetNodeId: fixedNode,
              targetPortId: gesture.from.portId,
            }
      valid = editor.isConnectionValid({ ...request, edgeId: gesture.edge?.id })
    } else if (target) {
      valid = true
    }

    editor.setOverlay({
      connection: {
        from: gesture.fromPoint,
        to: target && valid ? target.point : event.world,
        targetNodeId: target?.nodeId,
        targetPortId: target?.portId,
        valid: !target || valid,
      },
      hoverNodeId: target?.nodeId ?? null,
    })

    if (gesture.edge) {
      // Show the edge following the pointer while it is reconnected.
      const end: DiagramEdgeEndpoint =
        target && valid ? { nodeId: target.nodeId, portId: target.portId } : { point: event.world }
      editor.store.updateEdge(gesture.edge.id, { [gesture.end]: end })
    }
  }

  const finishConnect = (editor: DiagramEditor, event: DiagramPointerEvent) => {
    if (gesture?.kind !== 'connect') {
      return
    }

    const { from, edge, end: movingEnd } = gesture
    const connection = editor.overlay.connection

    if (edge) {
      // The edge already follows the pointer, an invalid target leaves a free end.
      if (connection?.targetNodeId && !connection.valid) {
        editor.store.updateEdge(edge.id, { [movingEnd]: { point: event.world } })
      }

      end(editor, true)
      const updated = editor.store.getEdge(edge.id)

      if (updated && !updated[movingEnd].nodeId) {
        editor.events.emit('connectEnd', { source: from, point: event.world, edgeId: edge.id })
      }

      return
    }

    end(editor, false)

    if (connection?.targetNodeId && connection.valid && from.nodeId) {
      editor.connect(
        { nodeId: from.nodeId, portId: from.portId },
        { nodeId: connection.targetNodeId, portId: connection.targetPortId },
      )
    } else {
      editor.events.emit('connectEnd', { source: from, point: event.world })
    }
  }

  const tool: DiagramTool = {
    id: 'select',
    label: 'Select',
    icon: 'pointer',
    cursor: 'default',

    pointerDown(editor, event) {
      const { target } = event
      const additive = event.shiftKey || event.ctrlKey || event.metaKey

      if (event.button !== 0) {
        return
      }

      switch (target.kind) {
        case 'resize': {
          const nodes = editor.getSelectedNodes().filter((node) => editor.isNodeEditable(node))

          if (!editor.canEdit || nodes.length === 0) {
            return
          }

          const single =
            nodes.length === 1 && !editor.getBehavior(nodes[0].type).container ? nodes[0] : null
          const originals = editor.getTransformableNodes(nodes.map((node) => node.id))
          begin(editor, 'Resize')
          gesture = {
            kind: 'resize',
            handle: target.handle,
            single,
            originals,
            frame: selectionFrame(nodes)!,
          }
          return
        }
        case 'rotate': {
          const nodes = editor
            .getSelectedNodes()
            .filter(
              (node) =>
                editor.isNodeEditable(node) && editor.getBehavior(node.type).rotatable !== false,
            )

          if (!editor.canEdit || nodes.length === 0) {
            return
          }

          const originals = editor.getTransformableNodes(nodes.map((node) => node.id))
          const frame = selectionFrame(nodes)!
          const single = nodes.length === 1
          const pivot = single
            ? boxCenter(nodes[0])
            : { x: frame.x + frame.width / 2, y: frame.y + frame.height / 2 }
          begin(editor, 'Rotate')
          gesture = {
            kind: 'rotate',
            originals,
            pivot,
            startAngle: angleBetween(pivot, event.world),
            single,
          }
          return
        }
        case 'port': {
          const node = editor.store.getNode(target.nodeId)

          if (!editor.canEdit || !node) {
            return
          }

          const port = getNodePorts(node, editor.getBehavior(node.type)).find(
            (item) => item.id === target.portId,
          )
          const from = { nodeId: target.nodeId, portId: target.portId }
          gesture = {
            kind: 'connect',
            from,
            fromPoint: port ? getPortPosition(node, port) : event.world,
            edge: null,
            end: 'target',
          }
          return
        }
        case 'edge-end': {
          const edge = editor.store.getEdge(target.edgeId)

          if (!edge || !editor.isEdgeEditable(edge)) {
            return
          }

          const other = target.end === 'source' ? edge.target : edge.source
          begin(editor, 'Reconnect')
          gesture = {
            kind: 'connect',
            from: other,
            fromPoint: getEndpointAnchor(other, {
              getNode: (id) => editor.store.getNode(id),
              behaviors: editor.behaviors,
            }),
            edge,
            end: target.end,
          }
          return
        }
        case 'waypoint': {
          const edge = editor.store.getEdge(target.edgeId)

          if (edge && editor.isEdgeEditable(edge)) {
            begin(editor, 'Move control point')
            gesture = { kind: 'waypoint', edge, index: target.index }
          }

          return
        }
        case 'segment': {
          const edge = editor.store.getEdge(target.edgeId)

          if (edge && editor.isEdgeEditable(edge)) {
            begin(editor, 'Add control point')
            const waypoints = [...(edge.waypoints ?? [])]
            waypoints.splice(target.index, 0, event.world)
            editor.store.updateEdge(edge.id, { waypoints })
            gesture = {
              kind: 'waypoint',
              edge: editor.store.getEdge(edge.id)!,
              index: target.index,
            }
          }

          return
        }
        case 'vertex': {
          const node = editor.store.getNode(target.nodeId)

          if (editor.canEdit && node && editor.isNodeEditable(node)) {
            begin(editor, 'Move vertex')
            gesture = { kind: 'vertex', node, index: target.index }
          }

          return
        }
        case 'node': {
          const node = editor.store.getNode(target.id)

          if (!node) {
            return
          }

          // Clicking outside of the entered group leaves it.
          if (
            editor.enteredGroupId &&
            !editor.store
              .getAncestors(target.id)
              .some((ancestor) => ancestor.id === editor.enteredGroupId)
          ) {
            editor.enteredGroupId = null
          }

          const id = editor.resolveSelectionTarget(target.id)
          const wasSelected = editor.isSelected(id)
          let clickSelection: DiagramId[] | null = null

          if (additive) {
            editor.select(id, { toggle: true })
          } else if (!wasSelected) {
            editor.setSelection([id])
          } else {
            // Clicking one of several selected nodes selects only it, unless it turns into a drag.
            clickSelection = [id]
          }

          gesture = { kind: 'press', start: event, nodeId: id, edgeId: null, clickSelection }
          return
        }
        case 'edge': {
          const edge = editor.store.getEdge(target.id)

          if (!edge) {
            return
          }

          if (additive) {
            editor.select(edge.id, { toggle: true })
          } else if (!editor.isSelected(edge.id)) {
            editor.setSelection([edge.id])
          }

          gesture = {
            kind: 'press',
            start: event,
            nodeId: null,
            edgeId: edge.id,
            clickSelection: null,
          }
          return
        }
        case 'canvas': {
          const base = additive ? editor.getSelectedIds() : []

          if (!additive) {
            editor.clearSelection()
          }

          gesture = {
            kind: 'marquee',
            start: event.world,
            base,
            lasso: event.altKey ? [event.world] : null,
          }
        }
      }
    },

    pointerMove(editor, event) {
      if (!gesture) {
        const target = event.target
        const hover =
          target.kind === 'node' ? target.id : target.kind === 'port' ? target.nodeId : null
        editor.setOverlay({ hoverNodeId: hover })
        return
      }

      switch (gesture.kind) {
        case 'press': {
          const start = gesture.start
          const moved = distance(start.screen, event.screen)

          if (moved < DRAG_THRESHOLD) {
            return
          }

          if (gesture.nodeId && editor.canEdit) {
            startMove(editor, start, start.altKey)
            updateMove(editor, event)
          } else if (gesture.edgeId && editor.canEdit) {
            startMove(editor, start, false)
            updateMove(editor, event)
          } else {
            gesture = null
          }

          return
        }
        case 'move':
          updateMove(editor, event)
          return
        case 'marquee': {
          if (gesture.lasso) {
            gesture.lasso.push(event.world)
            editor.setOverlay({ lasso: [...gesture.lasso] })
            editor.setSelection([
              ...gesture.base,
              ...editor.getNodesInPolygon(gesture.lasso).map((node) => node.id),
            ])
            return
          }

          const rect = rectFromCorners(gesture.start, event.world)
          editor.setOverlay({ marquee: rect })
          editor.setSelection([
            ...gesture.base,
            ...editor.getNodesInRect(rect).map((node) => node.id),
          ])
          return
        }
        case 'resize':
          updateResize(editor, event)
          return
        case 'rotate':
          updateRotate(editor, event)
          return
        case 'connect':
          updateConnect(editor, event)
          return
        case 'waypoint': {
          const point =
            editor.options.snapToGrid && !event.altKey
              ? {
                  x: snapValue(event.world.x, editor.gridSize),
                  y: snapValue(event.world.y, editor.gridSize),
                }
              : event.world
          const waypoints = [...(gesture.edge.waypoints ?? [])]
          waypoints[gesture.index] = point
          editor.store.updateEdge(gesture.edge.id, { waypoints })
          return
        }
        case 'vertex': {
          const { node, index } = gesture
          const behavior = editor.getBehavior(node.type)

          if (!behavior.points) {
            return
          }

          const world =
            editor.options.snapToGrid && !event.altKey
              ? {
                  x: snapValue(event.world.x, editor.gridSize),
                  y: snapValue(event.world.y, editor.gridSize),
                }
              : event.world
          const points = behavior.points.get(node)
          points[index] = flipLocal(worldToLocal(world, node), node)
          editor.store.batch(() => {
            editor.store.updateNode(node.id, () => behavior.points!.set(node, points))
            editor.refreshGroups([node.id])
            editor.notifyTransform([node.id])
          })
        }
      }
    },

    pointerUp(editor, event) {
      const current = gesture

      if (!current) {
        return
      }

      switch (current.kind) {
        case 'press':
          gesture = null

          if (current.clickSelection) {
            editor.setSelection(current.clickSelection)
          }

          editor.emitClick(current.start)
          return
        case 'marquee': {
          const moved = distance(editor.worldToScreen(current.start), event.screen)
          end(editor, true)

          if (moved < DRAG_THRESHOLD) {
            editor.emitClick(event)
          }

          return
        }
        case 'connect':
          finishConnect(editor, event)
          return
        default:
          end(editor, true)
      }
    },

    doubleClick(editor, event) {
      const { target } = event

      if (target.kind === 'waypoint') {
        const edge = editor.store.getEdge(target.edgeId)

        if (edge?.waypoints && editor.isEdgeEditable(edge)) {
          editor.updateEdge(
            edge.id,
            { waypoints: edge.waypoints.filter((_, index) => index !== target.index) },
            'Remove control point',
          )
        }

        return
      }

      if (target.kind === 'vertex') {
        const node = editor.store.getNode(target.nodeId)
        const behavior = node ? editor.getBehavior(node.type) : undefined

        if (editor.canEdit && node && behavior?.points) {
          const points = behavior.points.get(node)

          if (points.length > (behavior.points.min ?? (behavior.points.closed ? 3 : 2))) {
            points.splice(target.index, 1)
            editor.updateNode(node.id, () => behavior.points!.set(node, points), 'Remove vertex')
          }
        }

        return
      }

      if (target.kind === 'node') {
        const node = editor.store.getNode(target.id)

        if (!node) {
          return
        }

        const selected = editor.resolveSelectionTarget(target.id)

        // Double clicking a group enters it and selects the child under the pointer.
        if (selected !== target.id) {
          editor.enteredGroupId = selected
          editor.setSelection([editor.resolveSelectionTarget(target.id)])
          return
        }

        editor.events.emit('nodeDoubleClick', { node, event })

        if (editor.canEdit) {
          editor.startTextEdit({ kind: 'node', id: node.id })
        }

        return
      }

      if (target.kind === 'edge') {
        if (editor.canEdit) {
          editor.startTextEdit({ kind: 'edge', id: target.id })
        }

        return
      }

      if (target.kind === 'canvas') {
        editor.enteredGroupId = null
        editor.events.emit('canvasDoubleClick', { point: event.world, event })
      }
    },

    keyDown(editor, event) {
      if (event.key !== 'Escape') {
        return false
      }

      if (gesture) {
        end(editor, false)
        return true
      }

      if (editor.enteredGroupId) {
        const group = editor.enteredGroupId
        editor.enteredGroupId = null
        editor.setSelection([editor.resolveSelectionTarget(group)])
        return true
      }

      if (editor.selection.size > 0) {
        editor.clearSelection()
        return true
      }

      return false
    },

    cancel(editor) {
      if (gesture) {
        end(editor, false)
      }
    },
  }

  return tool
}
