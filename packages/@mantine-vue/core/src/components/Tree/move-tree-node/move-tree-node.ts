import { findTreeNode } from '../get-children-nodes-values/get-children-nodes-values'
import type { TreeNodeData } from '../Tree'

export type TreeDragDropPosition = 'before' | 'after' | 'inside'
export interface TreeDragDropPayload {
  draggedNode: string
  targetNode: string
  position: TreeDragDropPosition
}

function isDescendant(data: TreeNodeData[], ancestorValue: string, value: string): boolean {
  const ancestor = findTreeNode(ancestorValue, data)
  if (!ancestor?.children) return false
  return ancestor.children.some(
    (node) =>
      node.value === value || (node.children ? isDescendant([node], node.value, value) : false),
  )
}

function removeNode(
  data: TreeNodeData[],
  value: string,
): { data: TreeNodeData[]; removed: TreeNodeData | null } {
  let removed: TreeNodeData | null = null
  const next = data.reduce<TreeNodeData[]>((acc, node) => {
    if (node.value === value) {
      removed = { ...node }
    } else if (node.children) {
      const result = removeNode(node.children, value)
      if (result.removed) {
        removed = result.removed
        acc.push({ ...node, children: result.data })
      } else acc.push(node)
    } else acc.push(node)
    return acc
  }, [])
  return { data: next, removed }
}

function insertNode(
  data: TreeNodeData[],
  node: TreeNodeData,
  target: string,
  position: TreeDragDropPosition,
): TreeNodeData[] {
  if (position === 'inside') {
    return data.map((item) =>
      item.value === target
        ? { ...item, children: [...(item.children || []), node] }
        : item.children
          ? { ...item, children: insertNode(item.children, node, target, position) }
          : item,
    )
  }
  const index = data.findIndex((item) => item.value === target)
  if (index !== -1) {
    const result = [...data]
    result.splice(position === 'before' ? index : index + 1, 0, node)
    return result
  }
  return data.map((item) =>
    item.children ? { ...item, children: insertNode(item.children, node, target, position) } : item,
  )
}

export function moveTreeNode(data: TreeNodeData[], payload: TreeDragDropPayload): TreeNodeData[] {
  const { draggedNode, targetNode, position } = payload
  if (
    draggedNode === targetNode ||
    !findTreeNode(targetNode, data) ||
    isDescendant(data, draggedNode, targetNode)
  )
    return data
  const removed = removeNode(data, draggedNode)
  return removed.removed ? insertNode(removed.data, removed.removed, targetNode, position) : data
}
