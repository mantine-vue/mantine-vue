import type { TreeNodeData } from '../Tree'
import type { TreeExpandedState } from '../use-tree'

export type FlatTreeLineState = 'continuing' | 'closing' | 'none'
export interface FlattenedTreeNodeData {
  node: TreeNodeData
  level: number
  parent: string | null
  hasChildren: boolean
  expanded: boolean
  linesPath: FlatTreeLineState[]
}

function flattenTo(
  acc: FlattenedTreeNodeData[],
  data: TreeNodeData[],
  state: TreeExpandedState,
  parent: string | null,
  level: number,
  ancestorIsLast: boolean[],
) {
  data.forEach((node, index) => {
    const isLast = index === data.length - 1
    const loaded = Array.isArray(node.children)
    const hasChildren = loaded || (!!node.hasChildren && !loaded)
    const expanded = state[node.value] || false
    const linesPath: FlatTreeLineState[] = []
    for (let current = 2; current <= level; current += 1) {
      linesPath.push(
        current === level
          ? isLast
            ? 'closing'
            : 'continuing'
          : ancestorIsLast[current - 1]
            ? 'none'
            : 'continuing',
      )
    }
    acc.push({ node, level, parent, hasChildren, expanded, linesPath })
    if (expanded && loaded)
      flattenTo(acc, node.children!, state, node.value, level + 1, [...ancestorIsLast, isLast])
  })
}

export function flattenTreeData(
  data: TreeNodeData[],
  expandedState: TreeExpandedState,
): FlattenedTreeNodeData[] {
  const result: FlattenedTreeNodeData[] = []
  flattenTo(result, data, expandedState, null, 1, [])
  return result
}
