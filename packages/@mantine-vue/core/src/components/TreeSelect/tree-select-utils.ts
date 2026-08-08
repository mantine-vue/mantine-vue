import type { TreeNodeData } from '../Tree'
import type { CheckedStrategy } from './TreeSelect.types'

/**
 * Layout constants and pure tree helpers for `TreeSelect`.
 *
 * Kept apart from the components: the flattening, filtering and checked-state rules are
 * independent of Vue and are shared by the field and the option rows.
 */

/** Horizontal indent added per nesting level, in px. */
export const LEVEL_OFFSET = 20
/** Padding of a root level option, in px. */
export const BASE_PADDING = 8
/** Gap between the connector lines and the option content, in px. */
export const LINE_CONTENT_GAP = 5
/** Space a leaf reserves where a parent would show its chevron, in px. */
export const OPTION_GAP = 6

export interface FlatNode {
  node: TreeNodeData
  level: number
  parent: string | null
  hasChildren: boolean
  expanded: boolean
  isLastChild: boolean
  lineGuides: boolean[]
}

export function flattenTo(
  acc: FlatNode[],
  data: TreeNodeData[],
  expandedSet: Set<string>,
  parent: string | null,
  level: number,
  parentGuides: boolean[],
): void {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const isLast = i === data.length - 1
    const hasLoadedChildren = Array.isArray(node.children) && node.children.length > 0
    const hasAsyncChildren = !!node.hasChildren && !hasLoadedChildren
    const hasChildren = hasLoadedChildren || hasAsyncChildren
    const expanded = expandedSet.has(node.value)

    acc.push({
      node,
      level,
      parent,
      hasChildren,
      expanded,
      isLastChild: isLast,
      lineGuides: parentGuides,
    })

    if (expanded && hasLoadedChildren) {
      const childGuides = level >= 2 ? [...parentGuides, !isLast] : []
      flattenTo(acc, node.children!, expandedSet, node.value, level + 1, childGuides)
    }
  }
}

export function flattenVisible(data: TreeNodeData[], expandedSet: Set<string>): FlatNode[] {
  const result: FlatNode[] = []
  flattenTo(result, data, expandedSet, null, 1, [])
  return result
}

export function allValues(data: TreeNodeData[]): string[] {
  return data.flatMap((node) => [node.value, ...allValues(node.children ?? [])])
}

export function leafValues(node: TreeNodeData): string[] {
  return node.children?.length ? node.children.flatMap(leafValues) : [node.value]
}

export function filterData(
  data: TreeNodeData[],
  query: string,
  filter?: (query: string, node: TreeNodeData) => boolean,
): TreeNodeData[] {
  const q = query.trim().toLowerCase()
  return data.flatMap((node) => {
    const children = filterData(node.children ?? [], query, filter)
    const match = filter ? filter(query, node) : String(node.label).toLowerCase().includes(q)
    return match || children.length ? [{ ...node, children }] : []
  })
}

export function buildLookup(data: TreeNodeData[]): Record<string, TreeNodeData> {
  const map: Record<string, TreeNodeData> = {}
  function walk(nodes: TreeNodeData[]) {
    for (const node of nodes) {
      map[node.value] = node
      if (node.children) walk(node.children)
    }
  }
  walk(data)
  return map
}

export function displayChecked(values: string[], data: TreeNodeData[], strategy: CheckedStrategy) {
  if (strategy === 'all') return values
  const nodes = buildLookup(data)
  return values.filter((value) =>
    strategy === 'child'
      ? !nodes[value]?.children?.length
      : !!nodes[value]?.children?.length ||
        !Object.values(nodes).some(
          (node) =>
            node.children?.some((child) => child.value === value) && values.includes(node.value),
        ),
  )
}
