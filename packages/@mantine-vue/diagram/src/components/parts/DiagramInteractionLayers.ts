import { computed, defineComponent, h, type VNode } from 'vue'
import { getPortPosition } from '../../core/connectors'
import { distance, midpoint, unionRects, type Point } from '../../core/geometry'
import { measureText } from '../../core/text'
import { flipLocal, getNodeBounds, getNodePorts } from '../../core/shapes'
import type { DiagramNode, DiagramResizeHandle } from '../../core/types'
import { useDiagramContext } from '../../vue/context'
import { pointsAttr } from '../shapes/shape-utils'

const HANDLES: DiagramResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']
const CORNERS: DiagramResizeHandle[] = ['nw', 'ne', 'se', 'sw']

const handlePosition = (handle: DiagramResizeHandle, width: number, height: number): Point => ({
  x: handle.includes('w') ? 0 : handle.includes('e') ? width : width / 2,
  y: handle.includes('n') ? 0 : handle.includes('s') ? height : height / 2,
})

const CURSORS: Record<DiagramResizeHandle, string> = {
  n: 'ns-resize',
  s: 'ns-resize',
  e: 'ew-resize',
  w: 'ew-resize',
  nw: 'nwse-resize',
  se: 'nwse-resize',
  ne: 'nesw-resize',
  sw: 'nesw-resize',
}

/** Cursor of a resize handle, rotated with the node. */
function cursorFor(handle: DiagramResizeHandle, rotation: number) {
  const order: DiagramResizeHandle[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']
  const steps = Math.round((((rotation % 360) + 360) % 360) / 45)

  return CURSORS[order[(order.indexOf(handle) + steps) % 8]]
}

/** Selection frames, resize and rotate handles, connector handles, vertices and ports. */
export const DiagramSelectionLayer = defineComponent({
  name: 'DiagramSelectionLayer',
  setup() {
    const { controller, getStyles } = useDiagramContext()
    const { editor } = controller

    const selectedNodes = computed(() =>
      controller.selection.value
        .map((id) => controller.nodeRef(id).value)
        .filter((node): node is DiagramNode => Boolean(node)),
    )
    const selectedEdges = computed(() =>
      controller.selection.value
        .map((id) => controller.edgeRef(id).value)
        .filter((edge) => Boolean(edge)),
    )

    const handleNodes = (nodes: DiagramNode[], zoom: number): VNode[] => {
      const editable =
        controller.mode.value === 'edit' && nodes.every((node) => editor.isNodeEditable(node))
      const size = 8 / zoom
      const single =
        nodes.length === 1 && !editor.getBehavior(nodes[0].type).container ? nodes[0] : null
      const behavior = single ? editor.getBehavior(single.type) : null
      const frame = single
        ? { x: 0, y: 0, width: single.width, height: single.height }
        : unionRects(nodes.map((node) => getNodeBounds(node)))

      if (!frame) {
        return []
      }

      const rotation = single?.rotation ?? 0
      const transform = single
        ? `translate(${single.x} ${single.y})${rotation ? ` rotate(${rotation} ${single.width / 2} ${single.height / 2})` : ''}`
        : undefined
      const resizable = editable && (single ? behavior!.resizable !== false : true)
      const handles = !resizable
        ? []
        : single && behavior?.resizeHandles
          ? behavior.resizeHandles
          : single && behavior?.resizable === 'proportional'
            ? CORNERS
            : // Lines are as thin as their stroke, only the length handles make sense.
              single && single.height <= 1
              ? (['e', 'w'] as DiagramResizeHandle[])
              : HANDLES
      const rotatable =
        editable &&
        nodes.some(
          (node) =>
            editor.getBehavior(node.type).rotatable !== false &&
            !editor.getBehavior(node.type).container,
        )
      const children: VNode[] = [
        h('rect', {
          ...getStyles('selectionFrame'),
          x: frame.x,
          y: frame.y,
          width: frame.width,
          height: frame.height,
          'data-locked': !editable || undefined,
        }),
      ]

      if (rotatable) {
        const top = { x: frame.x + frame.width / 2, y: frame.y }
        children.push(
          h('line', {
            ...getStyles('rotateLine'),
            x1: top.x,
            y1: top.y,
            x2: top.x,
            y2: top.y - 24 / zoom,
          }),
          h('circle', {
            ...getStyles('rotateHandle'),
            cx: top.x,
            cy: top.y - 24 / zoom,
            r: 5 / zoom,
            'data-diagram-hit': 'rotate',
          }),
        )
      }

      for (const handle of handles) {
        const p = handlePosition(handle, frame.width, frame.height)
        const handleStyles = getStyles('resizeHandle')
        children.push(
          h('rect', {
            ...handleStyles,
            key: handle,
            x: frame.x + p.x - size / 2,
            y: frame.y + p.y - size / 2,
            width: size,
            height: size,
            'data-diagram-hit': 'resize',
            'data-handle': handle,
            style: { ...handleStyles.style, cursor: cursorFor(handle, rotation) },
          }),
        )
      }

      if (single && behavior?.points && editable) {
        for (const [index, p] of behavior.points.get(single).entries()) {
          const local = flipLocal(p, single)
          children.push(
            h('circle', {
              ...getStyles('vertexHandle'),
              key: `v${index}`,
              cx: local.x,
              cy: local.y,
              r: 5 / zoom,
              'data-diagram-hit': 'vertex',
              'data-id': single.id,
              'data-index': index,
            }),
          )
        }
      }

      return [h('g', { transform }, children)]
    }

    const handleEdges = (zoom: number): VNode[] => {
      const editable = controller.mode.value === 'edit'

      return selectedEdges.value.flatMap((edge) => {
        if (!edge) {
          return []
        }

        // Follow the connected nodes like the edge itself does.
        void controller.routeVersion.value

        for (const nodeId of [edge.source.nodeId, edge.target.nodeId]) {
          if (nodeId) {
            void controller.nodeRef(nodeId).value
          }
        }

        const route = editor.getEdgeRoute(edge)
        const children: VNode[] = [h('path', { ...getStyles('edgeSelection'), d: route.path })]

        if (!editable || !editor.isEdgeEditable(edge)) {
          return children
        }

        const ends = [route.points[0], route.points[route.points.length - 1]]
        const waypoints = edge.waypoints ?? []
        const through = [ends[0], ...waypoints, ends[1]]

        through.slice(0, -1).forEach((p, index) => {
          const next = through[index + 1]

          if (distance(p, next) > 24 / zoom) {
            const mid = midpoint(p, next)
            children.push(
              h('circle', {
                ...getStyles('segmentHandle'),
                key: `s${index}`,
                cx: mid.x,
                cy: mid.y,
                r: 4 / zoom,
                'data-diagram-hit': 'segment',
                'data-id': edge.id,
                'data-index': index,
              }),
            )
          }
        })

        waypoints.forEach((p, index) => {
          children.push(
            h('rect', {
              ...getStyles('waypointHandle'),
              key: `w${index}`,
              x: p.x - 4 / zoom,
              y: p.y - 4 / zoom,
              width: 8 / zoom,
              height: 8 / zoom,
              'data-diagram-hit': 'waypoint',
              'data-id': edge.id,
              'data-index': index,
            }),
          )
        })

        ;(['source', 'target'] as const).forEach((end, index) => {
          children.push(
            h('circle', {
              ...getStyles('edgeEndHandle'),
              key: end,
              cx: ends[index].x,
              cy: ends[index].y,
              r: 5 / zoom,
              'data-diagram-hit': 'edge-end',
              'data-id': edge.id,
              'data-end': end,
            }),
          )
        })

        return [h('g', { key: edge.id }, children)]
      })
    }

    const ports = (zoom: number): VNode[] => {
      if (controller.mode.value !== 'edit') {
        return []
      }

      const overlay = controller.overlay.value
      const ids = new Set<string>()

      if (overlay.hoverNodeId) {
        ids.add(overlay.hoverNodeId)
      }

      if (overlay.connection?.targetNodeId) {
        ids.add(overlay.connection.targetNodeId)
      }

      if (selectedNodes.value.length === 1) {
        ids.add(selectedNodes.value[0].id)
      }

      return [...ids].flatMap((id) => {
        const node = controller.nodeRef(id).value

        if (!node || !editor.isNodeVisible(node)) {
          return []
        }

        return getNodePorts(node, editor.getBehavior(node.type)).map((port) => {
          const p = getPortPosition(node, port)
          const active =
            overlay.connection?.targetNodeId === id && overlay.connection.targetPortId === port.id

          return h('circle', {
            ...getStyles('port'),
            key: `${id}:${port.id}`,
            cx: p.x,
            cy: p.y,
            r: (active ? 6 : 4.5) / zoom,
            'data-active': active || undefined,
            'data-diagram-hit': 'port',
            'data-id': id,
            'data-port': port.id,
          })
        })
      })
    }

    return () => {
      const zoom = controller.viewport.value.zoom
      const nodes = selectedNodes.value

      return h('g', { ...getStyles('selectionLayer') }, [
        ...handleEdges(zoom),
        ...(nodes.length > 0 && controller.editing.value === null ? handleNodes(nodes, zoom) : []),
        ...ports(zoom),
      ])
    }
  },
})

/** Snap lines, marquee, lasso, connector preview, drafts and measurements. */
export const DiagramOverlayLayer = defineComponent({
  name: 'DiagramOverlayLayer',
  setup() {
    const { controller, getStyles } = useDiagramContext()

    const label = (p: Point, text: string, zoom: number, key: string) => {
      const fontSize = 11 / zoom
      const width = measureText(text, { size: fontSize }) + 8 / zoom

      return h('g', { key, transform: `translate(${p.x} ${p.y})`, ...getStyles('measurement') }, [
        h('rect', { x: -width / 2, y: -fontSize, width, height: fontSize * 2, rx: 3 / zoom }),
        h(
          'text',
          { 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': fontSize },
          text,
        ),
      ])
    }

    return () => {
      const overlay = controller.overlay.value
      const zoom = controller.viewport.value.zoom
      const visible = controller.editor.getVisibleRect()
      const children: VNode[] = []

      for (const [index, line] of overlay.snapLines.entries()) {
        children.push(
          h('line', {
            ...getStyles('snapLine'),
            key: `snap${index}`,
            x1: line.axis === 'x' ? line.value : line.from,
            x2: line.axis === 'x' ? line.value : line.to,
            y1: line.axis === 'x' ? line.from : line.value,
            y2: line.axis === 'x' ? line.to : line.value,
          }),
        )
      }

      if (overlay.marquee) {
        children.push(h('rect', { ...getStyles('marquee'), ...overlay.marquee }))
      }

      if (overlay.lasso && overlay.lasso.length > 1) {
        children.push(h('polygon', { ...getStyles('marquee'), points: pointsAttr(overlay.lasso) }))
      }

      if (overlay.draft) {
        const { draft } = overlay

        if (draft.rect) {
          children.push(h('rect', { ...getStyles('draft'), ...draft.rect }))
        } else if (draft.points.length > 0) {
          children.push(
            h(draft.closed ? 'polygon' : 'polyline', {
              ...getStyles('draft'),
              points: pointsAttr(draft.points),
            }),
            ...draft.points.map((p, index) =>
              h('circle', {
                ...getStyles('draftPoint'),
                key: `d${index}`,
                cx: p.x,
                cy: p.y,
                r: 3 / zoom,
              }),
            ),
          )
        }
      }

      if (overlay.connection) {
        const { from, to, valid } = overlay.connection
        children.push(
          h('line', {
            ...getStyles('connectionPreview'),
            x1: from.x,
            y1: from.y,
            x2: to.x,
            y2: to.y,
            'data-invalid': !valid || undefined,
          }),
        )
      }

      for (const [index, measurement] of overlay.measurements.entries()) {
        children.push(
          h('line', {
            ...getStyles('measurementLine'),
            key: `ml${index}`,
            x1: measurement.from.x,
            y1: measurement.from.y,
            x2: measurement.to.x,
            y2: measurement.to.y,
          }),
          label(midpoint(measurement.from, measurement.to), measurement.text, zoom, `m${index}`),
        )
      }

      const guides = controller.settings.value.guides ?? []

      return h('g', { ...getStyles('overlayLayer') }, [
        ...guides.map((guide) =>
          h('line', {
            ...getStyles('guide'),
            key: guide.id,
            x1: guide.axis === 'x' ? guide.value : visible.x,
            x2: guide.axis === 'x' ? guide.value : visible.x + visible.width,
            y1: guide.axis === 'x' ? visible.y : guide.value,
            y2: guide.axis === 'x' ? visible.y + visible.height : guide.value,
            'data-diagram-hit': controller.mode.value === 'edit' ? 'guide' : undefined,
            'data-id': guide.id,
            'data-axis': guide.axis,
          }),
        ),
        ...children,
      ])
    }
  },
})
