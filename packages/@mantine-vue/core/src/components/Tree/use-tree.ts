import { ref, shallowRef, type MaybeRefOrGetter, type Ref } from 'vue'
import { useUncontrolled } from '@mantine-vue/hooks'
import {
  getAllCheckedNodes,
  type CheckedNodeStatus,
} from './get-all-checked-nodes/get-all-checked-nodes'
import {
  findTreeNode,
  getAllChildrenNodes,
  getChildrenNodesValues,
} from './get-children-nodes-values/get-children-nodes-values'
import { isNodeChecked as getIsNodeChecked } from './is-node-checked/is-node-checked'
import { isNodeIndeterminate as getIsNodeIndeterminate } from './is-node-indeterminate/is-node-indeterminate'
import type { TreeNodeData } from './Tree'

export type TreeExpandedState = Record<string, boolean>

function getInitialTreeExpandedState(
  initial: TreeExpandedState,
  data: TreeNodeData[],
  value: string | string[] | undefined,
  acc: TreeExpandedState = {},
) {
  data.forEach((node) => {
    acc[node.value] = node.value in initial ? initial[node.value] : node.value === value
    if (Array.isArray(node.children))
      getInitialTreeExpandedState(initial, node.children, value, acc)
  })
  return acc
}

export function getTreeExpandedState(
  data: TreeNodeData[],
  values: string[] | '*',
): TreeExpandedState {
  const state = getInitialTreeExpandedState({}, data, [])
  if (values === '*') return Object.fromEntries(Object.keys(state).map((key) => [key, true]))
  values.forEach((value) => {
    state[value] = true
  })
  return state
}

function getInitialCheckedState(initial: string[], data: TreeNodeData[], strictly: boolean) {
  if (strictly) return initial
  return Array.from(new Set(initial.flatMap((node) => getChildrenNodesValues(node, data))))
}

function getAllNodeValues(data: TreeNodeData[]): string[] {
  return data.flatMap((node) => [
    node.value,
    ...(node.children?.length ? getAllNodeValues(node.children) : []),
  ])
}

export interface UseTreeInput {
  initialExpandedState?: TreeExpandedState
  expandedState?: MaybeRefOrGetter<TreeExpandedState | undefined>
  onExpandedStateChange?: (state: TreeExpandedState) => void
  initialSelectedState?: string[]
  selectedState?: MaybeRefOrGetter<string[] | undefined>
  onSelectedStateChange?: (state: string[]) => void
  initialCheckedState?: string[]
  checkedState?: MaybeRefOrGetter<string[] | undefined>
  onCheckedStateChange?: (state: string[]) => void
  multiple?: boolean
  onNodeExpand?: (value: string) => void
  onNodeCollapse?: (value: string) => void
  onLoadChildren?: (nodeValue: string) => Promise<void>
  checkStrictly?: boolean
}

export interface UseTreeReturnType {
  checkStrictly: boolean
  multiple: boolean
  expandedState: Readonly<Ref<TreeExpandedState>>
  selectedState: Readonly<Ref<string[]>>
  checkedState: Readonly<Ref<string[]>>
  anchorNode: Ref<string | null>
  initialize(data: TreeNodeData[]): void
  toggleExpanded(value: string): void
  collapse(value: string): void
  expand(value: string): void
  expandAllNodes(): void
  collapseAllNodes(): void
  setExpandedState(value: TreeExpandedState): void
  toggleSelected(value: string): string[]
  select(value: string): void
  deselect(value: string): void
  clearSelected(): void
  setSelectedState(value: string[]): void
  checkNode(value: string): void
  uncheckNode(value: string): void
  checkAllNodes(): void
  uncheckAllNodes(): void
  setCheckedState(value: string[]): void
  getCheckedNodes(): CheckedNodeStatus[]
  isNodeChecked(value: string): boolean
  isNodeIndeterminate(value: string): boolean
  isNodeLoading(value: string): boolean
  getNodeLoadError(value: string): Error | null
  loadNode(value: string): Promise<void>
  invalidateNode(value: string): void
}

export function useTree(input: UseTreeInput = {}): UseTreeReturnType {
  const {
    initialSelectedState = [],
    initialCheckedState = [],
    initialExpandedState = {},
    multiple = false,
    checkStrictly = false,
  } = input
  const data = shallowRef<TreeNodeData[]>([])
  const [expandedState, setExpandedState] = useUncontrolled<TreeExpandedState>({
    value: input.expandedState,
    defaultValue: initialExpandedState,
    finalValue: {},
    onChange: input.onExpandedStateChange,
  })
  const [selectedState, setSelectedState] = useUncontrolled<string[]>({
    value: input.selectedState,
    defaultValue: initialSelectedState,
    finalValue: [],
    onChange: input.onSelectedStateChange,
  })
  const [checkedState, setCheckedState] = useUncontrolled<string[]>({
    value: input.checkedState,
    defaultValue: initialCheckedState,
    finalValue: [],
    onChange: input.onCheckedStateChange,
  })
  const anchorNode = ref<string | null>(null)
  const loadingNodes = ref(new Set<string>())
  const loadedNodes = new Set<string>()
  const loadErrors = ref<Record<string, Error>>({})

  const initialize = (nextData: TreeNodeData[]) => {
    setExpandedState(
      getInitialTreeExpandedState(expandedState.value, nextData, selectedState.value),
    )
    setCheckedState(getInitialCheckedState(checkedState.value, nextData, checkStrictly))
    data.value = nextData
  }

  const loadNode = async (value: string) => {
    if (!input.onLoadChildren || loadingNodes.value.has(value) || loadedNodes.has(value)) return
    loadingNodes.value = new Set(loadingNodes.value).add(value)
    if (value in loadErrors.value) {
      const next = { ...loadErrors.value }
      delete next[value]
      loadErrors.value = next
    }
    try {
      await input.onLoadChildren(value)
      loadedNodes.add(value)
    } catch (error) {
      loadErrors.value = {
        ...loadErrors.value,
        [value]: error instanceof Error ? error : new Error(String(error)),
      }
    } finally {
      const next = new Set(loadingNodes.value)
      next.delete(value)
      loadingNodes.value = next
    }
  }

  const tryLoadAsync = (value: string) => {
    const node = findTreeNode(value, data.value)
    if (node?.hasChildren && !Array.isArray(node.children)) void loadNode(value)
  }

  const toggleExpanded = (value: string) => {
    const next = { ...expandedState.value, [value]: !expandedState.value[value] }
    if (next[value]) input.onNodeExpand?.(value)
    else input.onNodeCollapse?.(value)
    if (next[value]) tryLoadAsync(value)
    setExpandedState(next)
  }
  const collapse = (value: string) => {
    if (expandedState.value[value] !== false) input.onNodeCollapse?.(value)
    setExpandedState({ ...expandedState.value, [value]: false })
  }
  const expand = (value: string) => {
    if (expandedState.value[value] !== true) input.onNodeExpand?.(value)
    tryLoadAsync(value)
    setExpandedState({ ...expandedState.value, [value]: true })
  }
  const expandAllNodes = () => {
    const next = { ...expandedState.value }
    Object.keys(next).forEach((key) => {
      next[key] = true
      tryLoadAsync(key)
    })
    setExpandedState(next)
  }
  const collapseAllNodes = () =>
    setExpandedState(
      Object.fromEntries(Object.keys(expandedState.value).map((key) => [key, false])),
    )

  const toggleSelected = (value: string) => {
    const included = selectedState.value.includes(value)
    const next = multiple
      ? included
        ? selectedState.value.filter((item) => item !== value)
        : [...selectedState.value, value]
      : included
        ? []
        : [value]
    anchorNode.value = included ? null : value
    setSelectedState(next)
    return next
  }
  const select = (value: string) => {
    anchorNode.value = value
    setSelectedState(
      multiple && !selectedState.value.includes(value) ? [...selectedState.value, value] : [value],
    )
  }
  const deselect = (value: string) => {
    if (anchorNode.value === value) anchorNode.value = null
    setSelectedState(selectedState.value.filter((item) => item !== value))
  }
  const clearSelected = () => {
    setSelectedState([])
    anchorNode.value = null
  }

  const checkNode = (value: string) => {
    const values = checkStrictly ? [value] : getChildrenNodesValues(value, data.value)
    setCheckedState(Array.from(new Set([...checkedState.value, ...values])))
  }
  const uncheckNode = (value: string) => {
    const values = checkStrictly ? [value] : getChildrenNodesValues(value, data.value)
    setCheckedState(checkedState.value.filter((item) => !values.includes(item)))
  }
  const getCheckedNodes = (): CheckedNodeStatus[] => {
    if (checkStrictly) {
      return checkedState.value.map((value): CheckedNodeStatus => {
        const node = findTreeNode(value, data.value)
        return {
          checked: true,
          indeterminate: false,
          value,
          hasChildren: !!node && ((node.children?.length ?? 0) > 0 || !!node.hasChildren),
        }
      })
    }

    return getAllCheckedNodes(data.value as TreeNodeData[], checkedState.value as string[]).result
  }

  const checkAllNodes = (): void => {
    const values: string[] = checkStrictly
      ? getAllNodeValues(data.value)
      : getAllChildrenNodes(data.value)
    setCheckedState(values)
  }

  return {
    checkStrictly,
    multiple,
    expandedState,
    selectedState,
    checkedState,
    anchorNode,
    initialize,
    toggleExpanded,
    collapse,
    expand,
    expandAllNodes,
    collapseAllNodes,
    setExpandedState,
    toggleSelected,
    select,
    deselect,
    clearSelected,
    setSelectedState,
    checkNode,
    uncheckNode,
    checkAllNodes,
    uncheckAllNodes: () => setCheckedState([]),
    setCheckedState,
    getCheckedNodes,
    isNodeChecked: (value: string): boolean =>
      checkStrictly
        ? checkedState.value.includes(value)
        : getIsNodeChecked(value, data.value, checkedState.value),
    isNodeIndeterminate: (value: string): boolean =>
      !checkStrictly && getIsNodeIndeterminate(value, data.value, checkedState.value),
    isNodeLoading: (value) => loadingNodes.value.has(value),
    getNodeLoadError: (value) => loadErrors.value[value] || null,
    loadNode,
    invalidateNode: (value) => {
      loadedNodes.delete(value)
      if (value in loadErrors.value) {
        const next = { ...loadErrors.value }
        delete next[value]
        loadErrors.value = next
      }
    },
  }
}

export type TreeController = ReturnType<typeof useTree>
