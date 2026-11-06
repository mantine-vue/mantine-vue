import type { DiagramStore, DiagramTransactionOptions } from './store'
import type { DiagramDocument, DiagramEdge, DiagramId, DiagramLayer, DiagramNode } from './types'

export interface DiagramEntityPatch<T extends { id: DiagramId }> {
  add?: T[]
  /** Partial records merged into existing ones */
  update?: (Partial<T> & { id: DiagramId })[]
  remove?: DiagramId[]
}

/** Incremental change of a document, e.g. received from a server or a collaborator. */
export interface DiagramPatch {
  nodes?: DiagramEntityPatch<DiagramNode>
  edges?: DiagramEntityPatch<DiagramEdge>
  /** Complete document metadata. Present `undefined` values remove the corresponding field. */
  document?: Pick<DiagramDocument, 'id' | 'name' | 'meta'>
  layers?: DiagramLayer[]
  settings?: DiagramDocument['settings']
  /** Full node order, back to front */
  nodeOrder?: DiagramId[]
  /** Full edge order, back to front */
  edgeOrder?: DiagramId[]
}

const equal = (a: unknown, b: unknown) => a === b || JSON.stringify(a) === JSON.stringify(b)

function diffEntities<T extends { id: DiagramId }>(
  before: readonly T[],
  after: readonly T[],
): DiagramEntityPatch<T> | undefined {
  const previous = new Map(before.map((item) => [item.id, item]))
  const next = new Map(after.map((item) => [item.id, item]))
  const patch: DiagramEntityPatch<T> = {}

  for (const item of after) {
    const old = previous.get(item.id)

    if (!old) {
      ;(patch.add ??= []).push(item)
      continue
    }

    if (old === item) {
      continue
    }

    const changes: Record<string, unknown> = { id: item.id }
    let changed = false
    const keys = new Set([...Object.keys(old), ...Object.keys(item)])

    for (const key of keys) {
      if (!equal((old as any)[key], (item as any)[key])) {
        changes[key] = (item as any)[key]
        changed = true
      }
    }

    if (changed) {
      ;(patch.update ??= []).push(changes as Partial<T> & { id: DiagramId })
    }
  }

  for (const item of before) {
    if (!next.has(item.id)) {
      ;(patch.remove ??= []).push(item.id)
    }
  }

  return patch.add || patch.update || patch.remove ? patch : undefined
}

/**
 * Smallest patch that turns one normalized, supported-version document into another. Fields
 * removed in `after` become `undefined`.
 */
export function diffDiagrams(before: DiagramDocument, after: DiagramDocument): DiagramPatch {
  const patch: DiagramPatch = {}
  const nodes = diffEntities(before.nodes, after.nodes)
  const edges = diffEntities(before.edges, after.edges)

  if (nodes) {
    patch.nodes = nodes
  }

  if (edges) {
    patch.edges = edges
  }

  if (
    !equal(
      { id: before.id, name: before.name, meta: before.meta },
      { id: after.id, name: after.name, meta: after.meta },
    )
  ) {
    patch.document = { id: after.id, name: after.name, meta: after.meta }
  }

  if (!equal(before.layers, after.layers) && after.layers) {
    patch.layers = after.layers
  }

  if (!equal(before.settings, after.settings)) {
    patch.settings = after.settings ?? {}
  }

  const beforeOrder = before.nodes.map((node) => node.id)
  const afterOrder = after.nodes.map((node) => node.id)

  if (!equal(beforeOrder, afterOrder)) {
    patch.nodeOrder = afterOrder
  }

  const beforeEdgeOrder = before.edges.map((edge) => edge.id)
  const afterEdgeOrder = after.edges.map((edge) => edge.id)

  if (!equal(beforeEdgeOrder, afterEdgeOrder)) {
    patch.edgeOrder = afterEdgeOrder
  }

  return patch
}

/** Applies a patch as one transaction. Unknown ids in updates and removals are ignored. */
export function applyDiagramPatch(
  store: DiagramStore,
  patch: DiagramPatch,
  options: DiagramTransactionOptions & { label?: string } = {},
) {
  store.transact(
    options.label ?? 'Apply changes',
    () => {
      if (patch.layers) {
        store.setLayers(patch.layers)
      }

      if (patch.settings) {
        store.setSettings(patch.settings)
      }

      if (patch.document) {
        store.setDocumentMeta(patch.document)
      }

      for (const id of patch.edges?.remove ?? []) {
        store.removeEdge(id)
      }

      for (const id of patch.nodes?.remove ?? []) {
        store.removeNode(id)
      }

      for (const node of patch.nodes?.add ?? []) {
        if (store.hasNode(node.id)) {
          store.updateNode(node.id, () => node)
        } else {
          store.addNode(node)
        }
      }

      for (const update of patch.nodes?.update ?? []) {
        store.updateNode(update.id, update)
      }

      for (const edge of patch.edges?.add ?? []) {
        if (store.hasEdge(edge.id)) {
          store.updateEdge(edge.id, () => edge)
        } else {
          store.addEdge(edge)
        }
      }

      for (const update of patch.edges?.update ?? []) {
        store.updateEdge(update.id, update)
      }

      if (patch.nodeOrder) {
        store.setNodeOrder(patch.nodeOrder)
      }

      if (patch.edgeOrder) {
        store.setEdgeOrder(patch.edgeOrder)
      }
    },
    { source: 'remote', ...options },
  )
}
