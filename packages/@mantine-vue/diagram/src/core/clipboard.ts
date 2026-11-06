import type { DiagramBehaviorRegistry } from './shapes'
import type { DiagramStore } from './store'
import type { DiagramEdge, DiagramId, DiagramNode } from './types'

export const CLIPBOARD_MIME = 'application/x-mantine-vue-diagram'

export interface DiagramClipboardPayload {
  type: typeof CLIPBOARD_MIME
  nodes: DiagramNode[]
  edges: DiagramEdge[]
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const isPoint = (value: unknown) =>
  isRecord(value) && isFiniteNumber(value.x) && isFiniteNumber(value.y)

const isEndpoint = (value: unknown) =>
  isRecord(value) &&
  ((typeof value.nodeId === 'string' && value.nodeId.length > 0) || isPoint(value.point))

function hasValidEntities(value: { nodes: unknown[]; edges: unknown[] }) {
  const ids = new Set<string>()

  for (const node of value.nodes) {
    if (
      !isRecord(node) ||
      typeof node.id !== 'string' ||
      !node.id ||
      ids.has(node.id) ||
      typeof node.type !== 'string' ||
      !node.type ||
      !isFiniteNumber(node.x) ||
      !isFiniteNumber(node.y) ||
      !isFiniteNumber(node.width) ||
      node.width < 0 ||
      !isFiniteNumber(node.height) ||
      node.height < 0 ||
      (node.rotation !== undefined && !isFiniteNumber(node.rotation)) ||
      (node.ports !== undefined &&
        (!Array.isArray(node.ports) ||
          !node.ports.every(
            (port) =>
              isRecord(port) &&
              typeof port.id === 'string' &&
              port.id.length > 0 &&
              isFiniteNumber(port.x) &&
              isFiniteNumber(port.y),
          )))
    ) {
      return false
    }

    ids.add(node.id)
  }

  for (const edge of value.edges) {
    if (
      !isRecord(edge) ||
      typeof edge.id !== 'string' ||
      !edge.id ||
      ids.has(edge.id) ||
      !isEndpoint(edge.source) ||
      !isEndpoint(edge.target) ||
      (edge.waypoints !== undefined &&
        (!Array.isArray(edge.waypoints) || !edge.waypoints.every(isPoint))) ||
      (edge.labels !== undefined &&
        (!Array.isArray(edge.labels) ||
          !edge.labels.every(
            (label) =>
              isRecord(label) &&
              typeof label.text === 'string' &&
              (label.position === undefined || isFiniteNumber(label.position)) &&
              (label.offset === undefined || isFiniteNumber(label.offset)),
          )))
    ) {
      return false
    }

    ids.add(edge.id)
  }

  return true
}

/**
 * Collects the selected nodes with the descendants of selected groups and the edges whose ends
 * are both part of the copy. Selected edges with a free end are copied too.
 */
export function createClipboardPayload(
  store: DiagramStore,
  ids: Iterable<DiagramId>,
): DiagramClipboardPayload {
  const nodeIds = new Set<DiagramId>()
  const edgeIds = new Set<DiagramId>()

  for (const id of ids) {
    if (store.hasNode(id)) {
      nodeIds.add(id)
      store.getDescendants(id).forEach((node) => nodeIds.add(node.id))
    } else if (store.hasEdge(id)) {
      edgeIds.add(id)
    }
  }

  const included = (nodeId: DiagramId | undefined) => !nodeId || nodeIds.has(nodeId)

  for (const edge of store.getEdges()) {
    const touches = edge.source.nodeId || edge.target.nodeId

    if (touches && included(edge.source.nodeId) && included(edge.target.nodeId)) {
      edgeIds.add(edge.id)
    }
  }

  const nodes = store.getNodes().filter((node) => nodeIds.has(node.id))
  const edges = store.getEdges().filter((edge) => edgeIds.has(edge.id))

  return {
    type: CLIPBOARD_MIME,
    nodes: nodes.map((node) =>
      node.parentId && !nodeIds.has(node.parentId) ? { ...node, parentId: undefined } : node,
    ),
    edges,
  }
}

export function isClipboardPayload(value: unknown): value is DiagramClipboardPayload {
  if (
    !isRecord(value) ||
    value.type !== CLIPBOARD_MIME ||
    !Array.isArray(value.nodes) ||
    !Array.isArray(value.edges)
  ) {
    return false
  }

  return hasValidEntities({ nodes: value.nodes, edges: value.edges })
}

/** Parses clipboard text written by `serializeClipboard`, `null` for anything else. */
export function parseClipboard(text: string): DiagramClipboardPayload | null {
  try {
    const value = JSON.parse(text)

    return isClipboardPayload(value) ? value : null
  } catch {
    return null
  }
}

export const serializeClipboard = (payload: DiagramClipboardPayload) => JSON.stringify(payload)

/**
 * Copies of the payload with new ids and an offset. References between copied elements are
 * rewritten, edges to nodes that are not part of the payload keep pointing at the originals
 * when those still exist.
 */
export function clonePayload(
  payload: DiagramClipboardPayload,
  options: {
    createId: (prefix: string) => DiagramId
    offset: { x: number; y: number }
    behaviors: DiagramBehaviorRegistry
    hasNode: (id: DiagramId) => boolean
  },
): { nodes: DiagramNode[]; edges: DiagramEdge[]; ids: Map<DiagramId, DiagramId> } {
  const ids = new Map<DiagramId, DiagramId>()
  const { offset } = options

  for (const node of payload.nodes) {
    ids.set(node.id, options.createId(node.type))
  }

  for (const edge of payload.edges) {
    ids.set(edge.id, options.createId('edge'))
  }

  const nodes = payload.nodes.map((node) => {
    let copy: DiagramNode = {
      ...node,
      id: ids.get(node.id)!,
      x: node.x + offset.x,
      y: node.y + offset.y,
      parentId: node.parentId ? ids.get(node.parentId) : undefined,
      locked: false,
    }

    if (copy.parentId === undefined) {
      delete copy.parentId
    }

    const behavior = options.behaviors.get(node.type)

    if (behavior.remapReferences) {
      copy = behavior.remapReferences(copy, ids)
    }

    return copy
  })

  const remapEnd = (end: DiagramEdge['source']): DiagramEdge['source'] => {
    if (end.nodeId && ids.has(end.nodeId)) {
      return { ...end, nodeId: ids.get(end.nodeId) }
    }

    if (end.nodeId && options.hasNode(end.nodeId)) {
      return end
    }

    if (end.point) {
      return { point: { x: end.point.x + offset.x, y: end.point.y + offset.y } }
    }

    return end
  }

  const edges = payload.edges
    .map((edge) => ({
      ...edge,
      id: ids.get(edge.id)!,
      source: remapEnd(edge.source),
      target: remapEnd(edge.target),
      waypoints: edge.waypoints?.map((p) => ({ x: p.x + offset.x, y: p.y + offset.y })),
      locked: false,
    }))
    .filter(
      (edge) =>
        (edge.source.nodeId || edge.source.point) && (edge.target.nodeId || edge.target.point),
    )

  return { nodes, edges, ids }
}
