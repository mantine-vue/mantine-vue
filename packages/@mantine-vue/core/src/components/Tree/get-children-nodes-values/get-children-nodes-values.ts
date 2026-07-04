import type { TreeNodeData } from '../Tree'

export function findTreeNode(value: string, data: TreeNodeData[]): TreeNodeData | null {
  for (const node of data) {
    if (node.value === value) return node
    if (Array.isArray(node.children)) {
      const child = findTreeNode(value, node.children)
      if (child) return child
    }
  }
  return null
}

export function getChildrenNodesValues(
  value: string,
  data: TreeNodeData[],
  acc: string[] = [],
): string[] {
  const node = findTreeNode(value, data)
  if (!node) return acc
  if (!Array.isArray(node.children) || node.children.length === 0) return [node.value]

  node.children.forEach((child) => {
    if (Array.isArray(child.children) && child.children.length > 0) {
      getChildrenNodesValues(child.value, data, acc)
    } else {
      acc.push(child.value)
    }
  })
  return acc
}

export function getAllChildrenNodes(data: TreeNodeData[]): string[] {
  return data.reduce<string[]>((acc, node) => {
    if (Array.isArray(node.children) && node.children.length > 0)
      acc.push(...getAllChildrenNodes(node.children))
    else acc.push(node.value)
    return acc
  }, [])
}
