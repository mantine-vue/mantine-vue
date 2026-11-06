import type { Point } from './geometry'
import type { DiagramEdge, DiagramId, DiagramNode } from './types'

export type DiagramLayoutDirection = 'TB' | 'BT' | 'LR' | 'RL'

export interface DiagramLayoutOptions {
  /** Flow direction, top to bottom by default */
  direction?: DiagramLayoutDirection
  /** Gap between ranks (levels) in world units */
  rankGap?: number
  /** Gap between nodes of the same rank in world units */
  nodeGap?: number
  /** Position of the top left corner of the layout */
  origin?: Point
}

type LayoutNode = Pick<DiagramNode, 'id' | 'width' | 'height'>
type LayoutEdge = Pick<DiagramEdge, 'source' | 'target'>

/** Top left positions by node id. */
export type DiagramLayoutResult = Map<DiagramId, Point>

const isVertical = (direction: DiagramLayoutDirection) => direction === 'TB' || direction === 'BT'

/** Maps rank coordinates (`along` the flow, `across` it) to world positions. */
function place(
  nodes: readonly LayoutNode[],
  rankOf: Map<DiagramId, number>,
  across: Map<DiagramId, number>,
  options: Required<Omit<DiagramLayoutOptions, 'origin'>> & { origin: Point },
): DiagramLayoutResult {
  const { direction, rankGap, origin } = options
  const vertical = isVertical(direction)
  const rankSizes: number[] = []

  for (const node of nodes) {
    const rank = rankOf.get(node.id) ?? 0
    rankSizes[rank] = Math.max(rankSizes[rank] ?? 0, vertical ? node.height : node.width)
  }

  const rankOffsets: number[] = []
  let offset = 0

  for (let rank = 0; rank < rankSizes.length; rank += 1) {
    rankOffsets[rank] = offset
    offset += (rankSizes[rank] ?? 0) + rankGap
  }

  const total = offset - rankGap
  const result: DiagramLayoutResult = new Map()
  let minAcross = Infinity

  for (const node of nodes) {
    const size = vertical ? node.width : node.height
    minAcross = Math.min(minAcross, (across.get(node.id) ?? 0) - size / 2)
  }

  for (const node of nodes) {
    const rank = rankOf.get(node.id) ?? 0
    const rankSize = rankSizes[rank] ?? 0
    const ownAlong = vertical ? node.height : node.width
    const ownAcross = vertical ? node.width : node.height
    let along = rankOffsets[rank] + (rankSize - ownAlong) / 2

    if (direction === 'BT' || direction === 'RL') {
      along = total - along - ownAlong
    }

    const acrossValue = (across.get(node.id) ?? 0) - ownAcross / 2 - minAcross

    result.set(
      node.id,
      vertical
        ? { x: origin.x + acrossValue, y: origin.y + along }
        : { x: origin.x + along, y: origin.y + acrossValue },
    )
  }

  return result
}

function withDefaults(options: DiagramLayoutOptions) {
  return {
    direction: options.direction ?? 'TB',
    rankGap: options.rankGap ?? 60,
    nodeGap: options.nodeGap ?? 32,
    origin: options.origin ?? { x: 0, y: 0 },
  }
}

/**
 * Tidy tree layout for hierarchies such as organizational charts. Each parent is centered over
 * its children. Nodes reached from more than one parent are placed under the first one.
 */
export function treeLayout(
  nodes: readonly LayoutNode[],
  edges: readonly LayoutEdge[],
  options: DiagramLayoutOptions & { roots?: DiagramId[] } = {},
): DiagramLayoutResult {
  const config = withDefaults(options)
  const vertical = isVertical(config.direction)
  const byId = new Map(nodes.map((node) => [node.id, node]))
  const children = new Map<DiagramId, DiagramId[]>()
  const hasParent = new Set<DiagramId>()

  for (const edge of edges) {
    const source = edge.source.nodeId
    const target = edge.target.nodeId

    if (!source || !target || !byId.has(source) || !byId.has(target) || hasParent.has(target)) {
      continue
    }

    if (source === target) {
      continue
    }

    hasParent.add(target)
    children.set(source, [...(children.get(source) ?? []), target])
  }

  const roots =
    options.roots ?? nodes.filter((node) => !hasParent.has(node.id)).map((node) => node.id)
  const rankOf = new Map<DiagramId, number>()
  const across = new Map<DiagramId, number>()
  const visited = new Set<DiagramId>()
  const sizeAcross = (id: DiagramId) => {
    const node = byId.get(id)!
    return vertical ? node.width : node.height
  }

  // Returns the extent of the subtree across the flow.
  const measure = new Map<DiagramId, number>()
  const measureSubtree = (id: DiagramId, trail: Set<DiagramId>): number => {
    if (trail.has(id)) {
      return 0
    }

    const kids = (children.get(id) ?? []).filter((kid) => !trail.has(kid))
    const nextTrail = new Set(trail).add(id)
    const kidsExtent =
      kids.reduce((sum, kid) => sum + measureSubtree(kid, nextTrail), 0) +
      Math.max(0, kids.length - 1) * config.nodeGap
    const extent = Math.max(sizeAcross(id), kidsExtent)
    measure.set(id, extent)
    return extent
  }

  const layoutSubtree = (id: DiagramId, rank: number, start: number) => {
    if (visited.has(id)) {
      return
    }

    visited.add(id)
    rankOf.set(id, rank)
    const extent = measure.get(id) ?? sizeAcross(id)
    across.set(id, start + extent / 2)
    const kids = (children.get(id) ?? []).filter((kid) => !visited.has(kid))
    const kidsExtent =
      kids.reduce((sum, kid) => sum + (measure.get(kid) ?? sizeAcross(kid)), 0) +
      Math.max(0, kids.length - 1) * config.nodeGap
    let cursor = start + (extent - kidsExtent) / 2

    for (const kid of kids) {
      layoutSubtree(kid, rank + 1, cursor)
      cursor += (measure.get(kid) ?? sizeAcross(kid)) + config.nodeGap
    }
  }

  let cursor = 0

  for (const root of roots) {
    if (!byId.has(root) || visited.has(root)) {
      continue
    }

    const extent = measureSubtree(root, new Set())
    layoutSubtree(root, 0, cursor)
    cursor += extent + config.nodeGap * 2
  }

  // Nodes in cycles without a root still get a position.
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      const extent = measureSubtree(node.id, new Set())
      layoutSubtree(node.id, 0, cursor)
      cursor += extent + config.nodeGap * 2
    }
  }

  return place(nodes, rankOf, across, config)
}

/**
 * Layered layout for directed graphs such as flowcharts: longest path ranking, barycenter
 * ordering to reduce crossings and centered placement within each rank. Cycles are broken by
 * ignoring edges that point back to a node on the current path.
 */
export function layeredLayout(
  nodes: readonly LayoutNode[],
  edges: readonly LayoutEdge[],
  options: DiagramLayoutOptions & { iterations?: number } = {},
): DiagramLayoutResult {
  const config = withDefaults(options)
  const vertical = isVertical(config.direction)
  const ids = new Set(nodes.map((node) => node.id))
  const outgoing = new Map<DiagramId, DiagramId[]>()
  const incoming = new Map<DiagramId, DiagramId[]>()

  for (const node of nodes) {
    outgoing.set(node.id, [])
    incoming.set(node.id, [])
  }

  // Remove back edges with a depth first search.
  const state = new Map<DiagramId, 'visiting' | 'done'>()
  const forward: [DiagramId, DiagramId][] = []
  const adjacency = new Map<DiagramId, DiagramId[]>()

  for (const edge of edges) {
    const s = edge.source.nodeId
    const t = edge.target.nodeId

    if (s && t && s !== t && ids.has(s) && ids.has(t)) {
      adjacency.set(s, [...(adjacency.get(s) ?? []), t])
    }
  }

  const dfs = (id: DiagramId) => {
    state.set(id, 'visiting')

    for (const next of adjacency.get(id) ?? []) {
      if (state.get(next) === 'visiting') {
        continue
      }

      forward.push([id, next])

      if (!state.has(next)) {
        dfs(next)
      }
    }

    state.set(id, 'done')
  }

  for (const node of nodes) {
    if (!state.has(node.id)) {
      dfs(node.id)
    }
  }

  for (const [s, t] of forward) {
    outgoing.get(s)!.push(t)
    incoming.get(t)!.push(s)
  }

  // Longest path ranking.
  const rankOf = new Map<DiagramId, number>()
  const rankNode = (id: DiagramId): number => {
    if (rankOf.has(id)) {
      return rankOf.get(id)!
    }

    const parents = incoming.get(id) ?? []
    const rank = parents.length === 0 ? 0 : Math.max(...parents.map(rankNode)) + 1
    rankOf.set(id, rank)
    return rank
  }

  nodes.forEach((node) => rankNode(node.id))

  const ranks: DiagramId[][] = []

  for (const node of nodes) {
    const rank = rankOf.get(node.id)!
    ;(ranks[rank] ??= []).push(node.id)
  }

  // Barycenter sweeps, down then up.
  const position = new Map<DiagramId, number>()
  const updatePositions = () =>
    ranks.forEach((rank) => rank?.forEach((id, index) => position.set(id, index)))
  updatePositions()
  const iterations = options.iterations ?? 4

  const barycenter = (id: DiagramId, neighbors: Map<DiagramId, DiagramId[]>) => {
    const list = neighbors.get(id) ?? []

    return list.length === 0
      ? position.get(id)!
      : list.reduce((sum, item) => sum + position.get(item)!, 0) / list.length
  }

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    for (let rank = 1; rank < ranks.length; rank += 1) {
      ranks[rank]?.sort((a, b) => barycenter(a, incoming) - barycenter(b, incoming))
      updatePositions()
    }

    for (let rank = ranks.length - 2; rank >= 0; rank -= 1) {
      ranks[rank]?.sort((a, b) => barycenter(a, outgoing) - barycenter(b, outgoing))
      updatePositions()
    }
  }

  const byId = new Map(nodes.map((node) => [node.id, node]))
  const sizeAcross = (id: DiagramId) => (vertical ? byId.get(id)!.width : byId.get(id)!.height)
  const rankExtents = ranks.map(
    (rank) =>
      (rank ?? []).reduce((sum, id) => sum + sizeAcross(id), 0) +
      Math.max(0, (rank?.length ?? 0) - 1) * config.nodeGap,
  )
  const widest = Math.max(0, ...rankExtents)
  const across = new Map<DiagramId, number>()

  ranks.forEach((rank, index) => {
    let cursor = (widest - rankExtents[index]) / 2

    for (const id of rank ?? []) {
      across.set(id, cursor + sizeAcross(id) / 2)
      cursor += sizeAcross(id) + config.nodeGap
    }
  })

  return place(nodes, rankOf, across, config)
}

/** Places nodes on a grid with a fixed number of columns. */
export function gridLayout(
  nodes: readonly LayoutNode[],
  options: { columns?: number; gap?: number; origin?: Point } = {},
): DiagramLayoutResult {
  const columns = options.columns ?? Math.max(1, Math.ceil(Math.sqrt(nodes.length)))
  const gap = options.gap ?? 32
  const origin = options.origin ?? { x: 0, y: 0 }
  const cellWidth = Math.max(0, ...nodes.map((node) => node.width))
  const cellHeight = Math.max(0, ...nodes.map((node) => node.height))
  const result: DiagramLayoutResult = new Map()

  nodes.forEach((node, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)
    result.set(node.id, {
      x: origin.x + column * (cellWidth + gap) + (cellWidth - node.width) / 2,
      y: origin.y + row * (cellHeight + gap) + (cellHeight - node.height) / 2,
    })
  })

  return result
}
