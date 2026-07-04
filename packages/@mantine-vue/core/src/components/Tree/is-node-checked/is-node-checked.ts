import { getAllCheckedNodes } from '../get-all-checked-nodes/get-all-checked-nodes'
import type { TreeNodeData } from '../Tree'

export function isNodeChecked(
  value: string,
  data: TreeNodeData[],
  checkedState: string[],
): boolean {
  if (checkedState.length === 0) return false
  if (checkedState.includes(value)) return true
  return getAllCheckedNodes(data, checkedState).result.some(
    (node) => node.value === value && node.checked,
  )
}
