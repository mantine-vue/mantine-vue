import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { findTreeNode } from './get-children-nodes-values/get-children-nodes-values'
import type { TreeDragDropPayload, TreeDragDropPosition } from './move-tree-node/move-tree-node'
import type { TreeDragState, TreeNodeData } from './Tree'

export type TreeAllowDrop = (payload: TreeDragDropPayload) => boolean
export interface TreeDragHandleProps {
  onMousedown: (event: MouseEvent) => void
}

interface Input {
  nodeValue: string
  hasChildren: () => boolean
  isExpanded: () => boolean
  data: () => TreeNodeData[]
  onDragDrop?: (payload: TreeDragDropPayload) => void
  dragState: Ref<TreeDragState>
  allowDrop?: TreeAllowDrop
  withDragHandle?: boolean
}

function isDescendantOf(
  data: TreeNodeData[],
  ancestorValue: string,
  descendantValue: string,
): boolean {
  const ancestor = findTreeNode(ancestorValue, data)
  const check = (nodes: TreeNodeData[]): boolean =>
    nodes.some(
      (node) => node.value === descendantValue || (!!node.children && check(node.children)),
    )
  return !!ancestor?.children && check(ancestor.children)
}

function getPosition(
  event: DragEvent,
  element: HTMLElement,
  hasChildren: boolean,
  expanded: boolean,
): TreeDragDropPosition {
  const rect = element.getBoundingClientRect()
  const ratio = rect.height ? (event.clientY - rect.top) / rect.height : 0
  if (hasChildren && expanded) return ratio < 0.5 ? 'before' : 'inside'
  if (hasChildren) return ratio < 0.25 ? 'before' : ratio > 0.75 ? 'after' : 'inside'
  return ratio < 0.5 ? 'before' : 'after'
}

export function useTreeNodeDragDrop(input: Input) {
  const handleActive = ref(false)
  const release = () => {
    handleActive.value = false
  }
  onMounted(() => window.addEventListener('mouseup', release))
  onBeforeUnmount(() => window.removeEventListener('mouseup', release))

  if (!input.onDragDrop) return { getElementProps: () => ({}), dragHandleProps: undefined }

  const dragStart = (event: DragEvent) => {
    if (input.withDragHandle && !handleActive.value) {
      event.preventDefault()
      return
    }
    event.stopPropagation()
    event.dataTransfer?.setData('text/plain', input.nodeValue)
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
    input.dragState.value.draggedValue = input.nodeValue
    const target = event.currentTarget as HTMLElement
    target.closest('[role=treeitem]')?.setAttribute('data-dragging', 'true')
    requestAnimationFrame(() => target.setAttribute('data-dragging', 'true'))
  }
  const dragOver = (event: DragEvent) => {
    const dragged = input.dragState.value.draggedValue
    const target = event.currentTarget as HTMLElement
    if (
      !dragged ||
      dragged === input.nodeValue ||
      isDescendantOf(input.data(), dragged, input.nodeValue)
    )
      return
    const position = getPosition(event, target, input.hasChildren(), input.isExpanded())
    const payload = { draggedNode: dragged, targetNode: input.nodeValue, position }
    if (input.allowDrop && !input.allowDrop(payload)) {
      input.dragState.value.currentDropTarget?.removeAttribute('data-drag-over')
      target.removeAttribute('data-drag-over')
      input.dragState.value.currentDropTarget = null
      return
    }
    event.preventDefault()
    event.stopPropagation()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
    if (input.dragState.value.currentDropTarget !== target)
      input.dragState.value.currentDropTarget?.removeAttribute('data-drag-over')
    target.setAttribute('data-drag-over', position)
    input.dragState.value.currentDropTarget = target
  }
  const dragLeave = (event: DragEvent) => {
    const target = event.currentTarget as HTMLElement
    if (event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) return
    target.removeAttribute('data-drag-over')
    if (input.dragState.value.currentDropTarget === target)
      input.dragState.value.currentDropTarget = null
  }
  const drop = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const target = event.currentTarget as HTMLElement
    const position = target.getAttribute('data-drag-over') as TreeDragDropPosition | null
    target.removeAttribute('data-drag-over')
    const dragged = input.dragState.value.draggedValue
    if (dragged && position && dragged !== input.nodeValue) {
      const payload = { draggedNode: dragged, targetNode: input.nodeValue, position }
      if (!input.allowDrop || input.allowDrop(payload)) input.onDragDrop?.(payload)
    }
    input.dragState.value = { draggedValue: null, currentDropTarget: null }
  }
  const dragEnd = (event: DragEvent) => {
    const target = event.currentTarget as HTMLElement
    target.removeAttribute('data-dragging')
    target.closest('[role=treeitem]')?.removeAttribute('data-dragging')
    input.dragState.value.currentDropTarget?.removeAttribute('data-drag-over')
    input.dragState.value = { draggedValue: null, currentDropTarget: null }
    handleActive.value = false
  }

  return {
    getElementProps: () => ({
      draggable: input.withDragHandle ? handleActive.value : true,
      onDragstart: dragStart,
      onDragover: dragOver,
      onDragleave: dragLeave,
      onDrop: drop,
      onDragend: dragEnd,
    }),
    dragHandleProps: input.withDragHandle
      ? {
          onMousedown: () => {
            handleActive.value = true
          },
        }
      : undefined,
  }
}
