import {
  boxCenter,
  localToWorld,
  normalizeAngle,
  rayPolygonExit,
  type Point,
  type Rect,
} from './geometry'
import {
  flipLocal,
  getNodeBounds,
  getNodeOutline,
  getNodePorts,
  type DiagramBehaviorRegistry,
} from './shapes'
import type {
  DiagramEdge,
  DiagramEdgeEndpoint,
  DiagramNode,
  DiagramPort,
  DiagramSide,
} from './types'

export interface ResolvedEndpoint {
  point: Point
  /** Direction the connector leaves the endpoint in */
  side?: DiagramSide
  /** Bounds of the connected node */
  rect?: Rect
  nodeId?: string
  portId?: string
}

const SIDES: DiagramSide[] = ['top', 'right', 'bottom', 'left']

export const SIDE_VECTORS: Record<DiagramSide, Point> = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
}

/** Side of the box a relative port position is closest to. */
export function inferPortSide(port: Pick<DiagramPort, 'x' | 'y'>): DiagramSide {
  const distances: [DiagramSide, number][] = [
    ['top', port.y],
    ['right', 1 - port.x],
    ['bottom', 1 - port.y],
    ['left', port.x],
  ]

  return distances.sort((a, b) => a[1] - b[1])[0][0]
}

/** Rotates and flips a side together with its node. */
export function transformSide(side: DiagramSide, node: DiagramNode): DiagramSide {
  let resolved = side

  if (node.flipX && (side === 'left' || side === 'right')) {
    resolved = side === 'left' ? 'right' : 'left'
  }

  if (node.flipY && (side === 'top' || side === 'bottom')) {
    resolved = side === 'top' ? 'bottom' : 'top'
  }

  const steps = Math.round(normalizeAngle(node.rotation ?? 0) / 90) % 4

  return SIDES[(SIDES.indexOf(resolved) + steps) % 4]
}

export function getPortPosition(node: DiagramNode, port: DiagramPort): Point {
  return localToWorld(flipLocal({ x: port.x * node.width, y: port.y * node.height }, node), node)
}

export function getPortSide(node: DiagramNode, port: DiagramPort): DiagramSide {
  return transformSide(port.side ?? inferPortSide(port), node)
}

/** Side of a rectangle that faces a point. */
export function sideTowards(from: Point, to: Point): DiagramSide {
  const dx = to.x - from.x
  const dy = to.y - from.y

  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? 'right' : 'left'
  }

  return dy >= 0 ? 'bottom' : 'top'
}

export interface EndpointContext {
  getNode: (id: string) => DiagramNode | undefined
  behaviors: DiagramBehaviorRegistry
}

/** Center of a node or the point of a free end, used to aim floating ends. */
export function getEndpointAnchor(endpoint: DiagramEdgeEndpoint, ctx: EndpointContext): Point {
  const node = endpoint.nodeId ? ctx.getNode(endpoint.nodeId) : undefined

  if (!node) {
    return endpoint.point ?? { x: 0, y: 0 }
  }

  if (endpoint.portId) {
    const port = getNodePorts(node, ctx.behaviors.get(node.type)).find(
      (item) => item.id === endpoint.portId,
    )

    if (port) {
      return getPortPosition(node, port)
    }
  }

  return boxCenter(node)
}

/** Resolves where a connector end is drawn. Floating ends meet the outline of the node. */
export function resolveEndpoint(
  endpoint: DiagramEdgeEndpoint,
  toward: Point,
  ctx: EndpointContext,
): ResolvedEndpoint {
  const node = endpoint.nodeId ? ctx.getNode(endpoint.nodeId) : undefined

  if (!node) {
    return { point: endpoint.point ?? { x: 0, y: 0 } }
  }

  const behavior = ctx.behaviors.get(node.type)
  const rect = getNodeBounds(node)

  if (endpoint.portId) {
    const port = getNodePorts(node, behavior).find((item) => item.id === endpoint.portId)

    if (port) {
      return {
        point: getPortPosition(node, port),
        side: getPortSide(node, port),
        rect,
        nodeId: node.id,
        portId: port.id,
      }
    }
  }

  const center = boxCenter(node)
  const exit = rayPolygonExit(center, toward, getNodeOutline(node, behavior))

  return { point: exit, side: sideTowards(center, toward), rect, nodeId: node.id }
}

/** Resolves both ends of an edge. Each floating end aims at the anchor of the other end. */
export function resolveEdgeEndpoints(
  edge: DiagramEdge,
  ctx: EndpointContext,
): { source: ResolvedEndpoint; target: ResolvedEndpoint } {
  const waypoints = edge.waypoints ?? []
  const sourceAnchor = getEndpointAnchor(edge.source, ctx)
  const targetAnchor = getEndpointAnchor(edge.target, ctx)
  const towardSource = waypoints[0] ?? targetAnchor
  const towardTarget = waypoints[waypoints.length - 1] ?? sourceAnchor

  return {
    source: resolveEndpoint(edge.source, towardSource, ctx),
    target: resolveEndpoint(edge.target, towardTarget, ctx),
  }
}

export interface ConnectionRequest {
  sourceNodeId: string
  sourcePortId?: string
  targetNodeId: string
  targetPortId?: string
  /** Edge being reconnected, if any */
  edgeId?: string
}

export interface ConnectionRules {
  allowSelfLoops?: boolean
  allowDuplicates?: boolean
  validate?: (request: ConnectionRequest) => boolean
}

/** Checks a connection against port kinds, port limits and custom rules. */
export function isConnectionValid(
  request: ConnectionRequest,
  ctx: EndpointContext & { edges: readonly DiagramEdge[] },
  rules: ConnectionRules = {},
): boolean {
  const source = ctx.getNode(request.sourceNodeId)
  const target = ctx.getNode(request.targetNodeId)

  if (!source || !target) {
    return false
  }

  if (!rules.allowSelfLoops && source.id === target.id) {
    return false
  }

  for (const [node, portId, role] of [
    [source, request.sourcePortId, 'source'],
    [target, request.targetPortId, 'target'],
  ] as const) {
    const behavior = ctx.behaviors.get(node.type)

    if (behavior.connectable === false) {
      return false
    }

    if (!portId) {
      continue
    }

    const port = getNodePorts(node, behavior).find((item) => item.id === portId)

    if (!port) {
      return false
    }

    if (port.kind && port.kind !== 'both' && port.kind !== role) {
      return false
    }

    if (port.maxConnections !== undefined) {
      const used = ctx.edges.filter(
        (edge) =>
          edge.id !== request.edgeId &&
          ((edge.source.nodeId === node.id && edge.source.portId === portId) ||
            (edge.target.nodeId === node.id && edge.target.portId === portId)),
      ).length

      if (used >= port.maxConnections) {
        return false
      }
    }
  }

  if (!rules.allowDuplicates) {
    const duplicate = ctx.edges.some(
      (edge) =>
        edge.id !== request.edgeId &&
        edge.source.nodeId === request.sourceNodeId &&
        edge.target.nodeId === request.targetNodeId &&
        (edge.source.portId ?? null) === (request.sourcePortId ?? null) &&
        (edge.target.portId ?? null) === (request.targetPortId ?? null),
    )

    if (duplicate) {
      return false
    }
  }

  return rules.validate ? rules.validate(request) : true
}
