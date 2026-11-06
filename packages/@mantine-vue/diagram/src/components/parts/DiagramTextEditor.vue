<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { boxCenter, pointAlongPolyline } from '../../core/geometry'
import { useDiagramContext } from '../../vue/context'

defineOptions({ name: 'DiagramTextEditor' })

const props = defineProps<{ offset: number }>()

const { controller, getStyles, labels, elements } = useDiagramContext()
const { editor } = controller
const textarea = ref<HTMLTextAreaElement | null>(null)
const value = ref('')

const target = computed(() => {
  const editing = controller.editing.value

  if (!editing) {
    return null
  }

  if (editing.kind === 'node') {
    const node = controller.nodeRef(editing.id).value
    return node ? { kind: 'node' as const, node } : null
  }

  const edge = controller.edgeRef(editing.id).value
  return edge ? { kind: 'edge' as const, edge } : null
})

watch(
  () => controller.editing.value,
  async (editing) => {
    if (!editing) {
      return
    }

    value.value =
      editing.kind === 'node'
        ? (editor.store.getNode(editing.id)?.label ?? '')
        : (editor.store.getEdge(editing.id)?.label ?? '')
    await nextTick()
    textarea.value?.focus()
    textarea.value?.select()
  },
)

const style = computed(() => {
  const current = target.value

  if (!current) {
    return undefined
  }

  const { zoom } = controller.viewport.value

  if (current.kind === 'node') {
    const { node } = current
    const center = editor.worldToScreen(boxCenter(node))
    const width = Math.max(node.width * zoom, 80)
    const height = Math.max(node.height * zoom, 32)

    return {
      left: `${center.x - width / 2 + props.offset}px`,
      top: `${center.y - height / 2 + props.offset}px`,
      width: `${width}px`,
      height: `${height}px`,
      fontSize: `${(node.style?.fontSize ?? 14) * zoom}px`,
      transform: node.rotation ? `rotate(${node.rotation}deg)` : undefined,
    }
  }

  void controller.version.value
  const route = editor.getEdgeRoute(current.edge)
  const point = editor.worldToScreen(pointAlongPolyline(route.points, 0.5).point)

  return {
    left: `${point.x - 80 + props.offset}px`,
    top: `${point.y - 16 + props.offset}px`,
    width: '160px',
    height: '32px',
    fontSize: `${(current.edge.style?.fontSize ?? 12) * zoom}px`,
  }
})

let finished = false

function commit() {
  if (finished) {
    return
  }

  finished = true
  editor.commitTextEdit(value.value)
  elements.root.value?.focus({ preventScroll: true })
}

function cancel() {
  finished = true
  editor.cancelTextEdit()
  elements.root.value?.focus({ preventScroll: true })
}

watch(target, (current, previous) => {
  if (current && current !== previous) {
    finished = false
  }
})

function onKeyDown(event: KeyboardEvent) {
  event.stopPropagation()

  if (event.key === 'Escape') {
    event.preventDefault()
    cancel()
  } else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey || !event.shiftKey)) {
    // Enter confirms, Shift + Enter adds a line break.
    event.preventDefault()
    commit()
  }
}
</script>

<template>
  <textarea
    v-if="target"
    ref="textarea"
    v-model="value"
    v-bind="getStyles('textEditor')"
    :style="style"
    :aria-label="labels.editText"
    @keydown="onKeyDown"
    @blur="commit"
    @pointerdown.stop
  />
</template>
