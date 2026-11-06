<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useResizeObserver } from '@mantine-vue/hooks'
import { distance, expandRect, midpoint, type Point } from '../../core/geometry'
import type {
  DiagramHitTarget,
  DiagramId,
  DiagramPointerEvent,
  DiagramResizeHandle,
} from '../../core/types'
import { zoomAtPoint } from '../../core/viewport'
import { createWheelController } from '../../core/wheel'
import { useDiagramContext } from '../../vue/context'
import { insertTemplate, TEMPLATE_MIME } from '../../vue/templates'
import type { DiagramGridOptions } from '../Diagram/Diagram.types'
import DiagramRulers from './DiagramRulers.vue'
import DiagramTextEditor from './DiagramTextEditor.vue'
import { DiagramEdgeView } from './DiagramEdgeView'
import { DiagramOverlayLayer, DiagramSelectionLayer } from './DiagramInteractionLayers'
import { DiagramNodeView } from './DiagramNodeView'

defineOptions({ name: 'DiagramCanvas' })

const props = defineProps<{
  grid: boolean | DiagramGridOptions
  rulers: boolean
  wheelMode: 'pan' | 'zoom'
  culling: number | false
  spacePressed: boolean
  fitView: boolean
}>()

const ctx = useDiagramContext()
const { controller, getStyles, elements, domId } = ctx
const { editor } = controller

const RULER_SIZE = 22

/* Size */

const { ref: observed, rect } = useResizeObserver<HTMLElement>()
let fitted = false

const setCanvas = (element: unknown) => {
  const node = (element as HTMLElement | null) ?? null
  observed.value = node
  elements.canvas.value = node
}

watch(
  () => [rect.value.width, rect.value.height, props.rulers] as const,
  ([width, height, rulers]) => {
    if (width <= 0 || height <= 0) {
      return
    }

    const offset = rulers ? RULER_SIZE : 0
    editor.setViewportSize({ width: width - offset, height: height - offset })

    if (props.fitView && !fitted) {
      fitted = true
      editor.fitView()
    }
  },
)

const offset = computed(() => (props.rulers ? RULER_SIZE : 0))

/* Rendering order and culling */

const layerIndex = computed(
  () => new Map(controller.layers.value.map((layer, index) => [layer.id, index])),
)

/** Visible nodes sorted by layer, then by their order. Recomputed on structural changes only. */
const orderedNodes = computed(() => {
  void controller.structureVersion.value
  const layers = layerIndex.value
  const ids = controller.nodeIds.value.filter((id) => {
    const node = editor.store.getNode(id)
    return node ? editor.isNodeVisible(node) : false
  })

  if (layers.size <= 1) {
    return ids
  }

  const index = (id: DiagramId) => layers.get(editor.store.getNode(id)?.layerId ?? '') ?? 0

  return ids
    .map((id, order) => ({ id, order, layer: index(id) }))
    .sort((a, b) => a.layer - b.layer || a.order - b.order)
    .map((item) => item.id)
})

const cullingActive = computed(
  () => props.culling !== false && orderedNodes.value.length >= props.culling,
)

let previousNodes: readonly DiagramId[] = []

const renderedNodes = computed(() => {
  let next: readonly DiagramId[] = orderedNodes.value

  if (cullingActive.value && controller.viewportSize.value.width > 0) {
    void controller.version.value
    void controller.viewport.value
    const visible = expandRect(editor.getVisibleRect(), 200 / controller.viewport.value.zoom)
    const inView = editor.queryNodes(visible)
    const selected = controller.selectionSet.value
    next = next.filter((id) => inView.has(id) || selected.has(id))
  }

  // Same ids, same array: the node list does not re-render.
  if (
    next.length === previousNodes.length &&
    next.every((id, index) => previousNodes[index] === id)
  ) {
    return previousNodes
  }

  previousNodes = next
  return next
})

let previousEdges: readonly DiagramId[] = []

const renderedEdges = computed(() => {
  void controller.structureVersion.value
  const rendered = cullingActive.value ? new Set(renderedNodes.value) : null
  const visible = controller.edgeIds.value.filter((id) => {
    const edge = editor.store.getEdge(id)

    if (!edge || !editor.isEdgeVisible(edge)) {
      return false
    }

    if (!rendered) {
      return true
    }

    return (
      (edge.source.nodeId && rendered.has(edge.source.nodeId)) ||
      (edge.target.nodeId && rendered.has(edge.target.nodeId)) ||
      controller.selectionSet.value.has(id)
    )
  })
  const layers = layerIndex.value
  const next =
    layers.size <= 1
      ? visible
      : visible
          .map((id, order) => ({
            id,
            order,
            layer: layers.get(editor.store.resolveLayerId(editor.store.getEdge(id)!)) ?? 0,
          }))
          .sort((a, b) => a.layer - b.layer || a.order - b.order)
          .map((item) => item.id)

  if (
    next.length === previousEdges.length &&
    next.every((id, index) => previousEdges[index] === id)
  ) {
    return previousEdges
  }

  previousEdges = next
  return next
})

const transform = computed(() => {
  const { x, y, zoom } = controller.viewport.value
  return `translate(${x} ${y}) scale(${zoom})`
})

/* Grid */

const gridOptions = computed<DiagramGridOptions | null>(() =>
  props.grid === false ? null : props.grid === true ? {} : props.grid,
)

const gridPattern = computed(() => {
  const options = gridOptions.value
  // The grid size comes from the document or the editor options.
  void controller.settings.value
  void controller.optionsVersion.value

  if (!options) {
    return null
  }

  const { x, y, zoom } = controller.viewport.value
  const base = editor.gridSize * zoom
  // Zoomed far out, a dense grid is noise: show every 5th (25th, ...) line instead.
  const factor = base > 0 && base < 8 ? 5 ** Math.ceil(Math.log(8 / base) / Math.log(5)) : 1
  const size = base * factor

  const majorEvery = options.majorEvery ?? 5
  const major = majorEvery > 0 && factor === 1 ? size * majorEvery : 0

  return {
    size,
    major,
    x: x % (major || size),
    y: y % (major || size),
    type: options.type ?? 'lines',
  }
})

const patternId = computed(() => domId('grid'))
const majorPatternId = computed(() => domId('grid-major'))

/* Page */

const bounds = computed(() => controller.settings.value.bounds)

/* Pointer input */

const pointers = new Map<number, Point>()
let pinch: { distance: number; center: Point; viewport: typeof editor.viewport } | null = null
let longPress: ReturnType<typeof setTimeout> | null = null
let guideDrag: { id: string; axis: 'x' | 'y'; pointerId: number } | null = null
const panning = ref(false)

function localPoint(event: { clientX: number; clientY: number }): Point {
  const canvas = elements.canvas.value
  const box = canvas?.getBoundingClientRect()

  return {
    x: event.clientX - (box?.left ?? 0) - offset.value,
    y: event.clientY - (box?.top ?? 0) - offset.value,
  }
}

/** Reads the hit target from the `data-diagram-hit` attributes of the element under the pointer. */
function resolveTarget(target: EventTarget | null): DiagramHitTarget | null {
  const element = target instanceof Element ? target : null

  if (!element) {
    return { kind: 'canvas' }
  }

  // Interactive content of HTML nodes handles its own events.
  if (
    element.closest('[data-diagram-no-pointer], input, textarea, select, button, a[href]') &&
    element.closest('foreignObject')
  ) {
    return null
  }

  const hit = element.closest<HTMLElement | SVGElement>('[data-diagram-hit]')
  const data = hit?.dataset

  switch (data?.diagramHit) {
    case 'node':
      return { kind: 'node', id: data.id! }
    case 'edge':
      return { kind: 'edge', id: data.id! }
    case 'resize':
      return { kind: 'resize', handle: data.handle as DiagramResizeHandle }
    case 'rotate':
      return { kind: 'rotate' }
    case 'port':
      return { kind: 'port', nodeId: data.id!, portId: data.port! }
    case 'edge-end':
      return { kind: 'edge-end', edgeId: data.id!, end: data.end as 'source' | 'target' }
    case 'waypoint':
      return { kind: 'waypoint', edgeId: data.id!, index: Number(data.index) }
    case 'segment':
      return { kind: 'segment', edgeId: data.id!, index: Number(data.index) }
    case 'vertex':
      return { kind: 'vertex', nodeId: data.id!, index: Number(data.index) }
    case 'guide':
      return { kind: 'guide', id: data.id! }
    default:
      return { kind: 'canvas' }
  }
}

function toEvent(event: PointerEvent | MouseEvent, target: DiagramHitTarget): DiagramPointerEvent {
  const screen = localPoint(event)

  return {
    world: editor.screenToWorld(screen),
    screen,
    target,
    button: event.button,
    pointerId: 'pointerId' in event ? event.pointerId : 1,
    pointerType: 'pointerType' in event ? event.pointerType : 'mouse',
    shiftKey: event.shiftKey,
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    detail: event.detail,
  }
}

function clearLongPress() {
  if (longPress) {
    clearTimeout(longPress)
    longPress = null
  }
}

function cancelGuideDrag() {
  if (!guideDrag) {
    return
  }

  if (editor.store.inTransaction) {
    editor.store.rollback()
  }

  guideDrag = null
}

function onPointerDown(event: PointerEvent) {
  const target = resolveTarget(event.target)

  if (!target || event.button === 2) {
    return
  }

  elements.root.value?.focus({ preventScroll: true })
  pointers.set(event.pointerId, localPoint(event))
  ;(event.currentTarget as Element).setPointerCapture?.(event.pointerId)

  // A second finger turns the gesture into a pinch.
  if (pointers.size === 2) {
    clearLongPress()
    cancelGuideDrag()
    editor.cancelInteraction()
    const [a, b] = [...pointers.values()]
    pinch = { distance: distance(a, b), center: midpoint(a, b), viewport: editor.viewport }
    return
  }

  if (pointers.size > 2) {
    return
  }

  if (target.kind === 'guide') {
    const guide = editor.settings.guides?.find((item) => item.id === target.id)

    if (guide) {
      editor.store.begin('Move guide')
      guideDrag = { id: guide.id, axis: guide.axis, pointerId: event.pointerId }
    }

    return
  }

  const diagramEvent = toEvent(event, target)
  const touchPan =
    event.pointerType === 'touch' && target.kind === 'canvas' && editor.activeTool === 'select'
  const pan = props.spacePressed || touchPan

  if (event.pointerType === 'touch') {
    longPress = setTimeout(() => {
      longPress = null
      editor.cancelInteraction()
      openMenu(event.clientX, event.clientY, target)
    }, 550)
  }

  editor.pointerDown(diagramEvent, { pan })
  panning.value = editor.isPanning

  if (event.button === 1) {
    event.preventDefault()
  }
}

function onPointerMove(event: PointerEvent) {
  if (pointers.has(event.pointerId)) {
    const previous = pointers.get(event.pointerId)!
    const current = localPoint(event)
    pointers.set(event.pointerId, current)

    if (distance(previous, current) > 4) {
      clearLongPress()
    }
  }

  if (pinch && pointers.size >= 2) {
    const [a, b] = [...pointers.values()]
    const center = midpoint(a, b)
    const zoom = pinch.viewport.zoom * (distance(a, b) / Math.max(pinch.distance, 1))
    const zoomed = zoomAtPoint(
      pinch.viewport,
      pinch.center,
      Math.min(editor.options.maxZoom, Math.max(editor.options.minZoom, zoom)),
    )
    editor.setViewport({
      ...zoomed,
      x: zoomed.x + center.x - pinch.center.x,
      y: zoomed.y + center.y - pinch.center.y,
    })
    return
  }

  if (guideDrag) {
    if (event.pointerId === guideDrag.pointerId) {
      const world = editor.screenToWorld(localPoint(event))
      const value = guideDrag.axis === 'x' ? world.x : world.y
      const guides = (editor.settings.guides ?? []).map((guide) =>
        guide.id === guideDrag!.id ? { ...guide, value: Math.round(value * 100) / 100 } : guide,
      )
      editor.store.updateSettings({ guides })
    }

    return
  }

  const target =
    pointers.size > 0
      ? ({ kind: 'canvas' } as const)
      : (resolveTarget(event.target) ?? { kind: 'canvas' as const })
  editor.pointerMove(toEvent(event, target))
}

function endPointer(event: PointerEvent, cancelled: boolean) {
  clearLongPress()
  const wasTracked = pointers.delete(event.pointerId)

  if (pinch) {
    if (pointers.size < 2) {
      pinch = null
    }

    return
  }

  if (guideDrag && event.pointerId === guideDrag.pointerId) {
    const point = localPoint(event)

    // Dropping a guide back on a ruler removes it.
    if (props.rulers && (point.x < 0 || point.y < 0)) {
      editor.store.updateSettings({
        guides: (editor.settings.guides ?? []).filter((guide) => guide.id !== guideDrag!.id),
      })
    }

    editor.store.commit()
    guideDrag = null
    return
  }

  if (!wasTracked && event.type !== 'pointerup') {
    return
  }

  if (cancelled) {
    editor.cancelInteraction()
  } else {
    editor.pointerUp(
      toEvent(
        event,
        resolveTarget(
          document.elementFromPoint?.(event.clientX, event.clientY) ?? event.target,
        ) ?? { kind: 'canvas' },
      ),
    )
  }

  panning.value = false
}

function onDoubleClick(event: MouseEvent) {
  const target = resolveTarget(event.target)

  if (target) {
    editor.doubleClick(toEvent(event, target))
  }
}

/* Wheel and trackpad */

// Batched to one viewport update per frame, mouse wheel zoom eases between notches.
const wheel = createWheelController(editor, { mode: () => props.wheelMode })

function onWheel(event: WheelEvent) {
  event.preventDefault()
  wheel.handle({
    deltaX: event.deltaX,
    deltaY: event.deltaY,
    deltaMode: event.deltaMode,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
    point: localPoint(event),
  })
}

/* Context menu */

function openMenu(clientX: number, clientY: number, target: DiagramHitTarget | null) {
  if (target?.kind === 'node') {
    const id = editor.resolveSelectionTarget(target.id)

    if (!editor.isSelected(id)) {
      editor.setSelection([id])
    }
  } else if (target?.kind === 'edge' && !editor.isSelected(target.id)) {
    editor.setSelection([target.id])
  } else if (target?.kind === 'canvas') {
    editor.clearSelection()
  }

  ctx.openContextMenu(
    { x: clientX, y: clientY },
    editor.selection.size > 0 ? 'selection' : 'canvas',
  )
}

function onContextMenu(event: MouseEvent) {
  const target = resolveTarget(event.target)

  if (!target) {
    return
  }

  event.preventDefault()
  openMenu(event.clientX, event.clientY, target)
}

/* Palette drops */

function onDragOver(event: DragEvent) {
  if (editor.canEdit && event.dataTransfer?.types.includes(TEMPLATE_MIME)) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }
}

function onDrop(event: DragEvent) {
  const id = event.dataTransfer?.getData(TEMPLATE_MIME)
  const template = controller.templates.value.find((item) => item.id === id)

  if (!template) {
    return
  }

  event.preventDefault()
  elements.root.value?.focus({ preventScroll: true })
  insertTemplate(controller, template, editor.screenToWorld(localPoint(event)))
}

/* Rulers create guides */

function onRulerGuide(payload: { axis: 'x' | 'y'; event: PointerEvent }) {
  if (!editor.canEdit) {
    return
  }

  const world = editor.screenToWorld(localPoint(payload.event))
  const id = editor.store.createId('guide')
  editor.store.begin('Add guide')
  editor.store.updateSettings({
    guides: [
      ...(editor.settings.guides ?? []),
      { id, axis: payload.axis, value: payload.axis === 'x' ? world.x : world.y },
    ],
  })
  guideDrag = { id, axis: payload.axis, pointerId: payload.event.pointerId }
  elements.canvas.value?.setPointerCapture?.(payload.event.pointerId)
}

const svgElement = shallowRef<SVGSVGElement | null>(null)
const contentElement = shallowRef<SVGGElement | null>(null)

watch(svgElement, (value) => (elements.svg.value = value), { immediate: true })
watch(contentElement, (value) => (elements.content.value = value), { immediate: true })

onMounted(() => {
  elements.canvas.value?.addEventListener('wheel', onWheel, { passive: false })
})

onBeforeUnmount(() => {
  clearLongPress()
  const element = elements.canvas.value
  const pointerIds = new Set(pointers.keys())

  if (guideDrag) {
    pointerIds.add(guideDrag.pointerId)
  }

  cancelGuideDrag()
  editor.cancelInteraction()
  pointers.clear()
  pinch = null
  panning.value = false

  for (const pointerId of pointerIds) {
    if (element?.hasPointerCapture?.(pointerId)) {
      element.releasePointerCapture(pointerId)
    }
  }
  elements.canvas.value?.removeEventListener('wheel', onWheel)
  wheel.dispose()
})

const toolCursor = computed(() => {
  if (props.spacePressed) {
    return 'grab'
  }

  return controller.mode.value === 'view'
    ? 'grab'
    : (editor.getTool(controller.tool.value)?.cursor ?? 'default')
})
</script>

<template>
  <div
    v-bind="getStyles('canvas')"
    :ref="setCanvas"
    :data-with-rulers="rulers || undefined"
    :data-panning="panning || undefined"
    :style="{ cursor: toolCursor }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="endPointer($event, false)"
    @pointercancel="endPointer($event, true)"
    @lostpointercapture="endPointer($event, false)"
    @dblclick="onDoubleClick"
    @contextmenu="onContextMenu"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <svg
      v-bind="getStyles('svg')"
      ref="svgElement"
      :style="
        offset
          ? {
              left: `${offset}px`,
              top: `${offset}px`,
              width: `calc(100% - ${offset}px)`,
              height: `calc(100% - ${offset}px)`,
            }
          : undefined
      "
      aria-hidden="false"
    >
      <defs v-if="gridPattern">
        <pattern
          :id="patternId"
          patternUnits="userSpaceOnUse"
          :width="gridPattern.size"
          :height="gridPattern.size"
          :x="gridPattern.x"
          :y="gridPattern.y"
        >
          <circle
            v-if="gridPattern.type === 'dots'"
            :cx="0.75"
            :cy="0.75"
            r="0.75"
            fill="var(--diagram-grid-major)"
          />
          <path
            v-else
            :d="`M ${gridPattern.size} 0 L 0 0 0 ${gridPattern.size}`"
            fill="none"
            stroke="var(--diagram-grid)"
            stroke-width="1"
          />
        </pattern>
        <pattern
          v-if="gridPattern.major && gridPattern.type === 'lines'"
          :id="majorPatternId"
          patternUnits="userSpaceOnUse"
          :width="gridPattern.major"
          :height="gridPattern.major"
          :x="gridPattern.x"
          :y="gridPattern.y"
        >
          <rect
            :width="gridPattern.major"
            :height="gridPattern.major"
            :fill="`url(#${patternId})`"
          />
          <path
            :d="`M ${gridPattern.major} 0 L 0 0 0 ${gridPattern.major}`"
            fill="none"
            stroke="var(--diagram-grid-major)"
            stroke-width="1"
          />
        </pattern>
      </defs>
      <rect
        v-if="gridPattern"
        width="100%"
        height="100%"
        :fill="`url(#${gridPattern.major && gridPattern.type === 'lines' ? majorPatternId : patternId})`"
        pointer-events="none"
      />
      <g ref="contentElement" :transform="transform" data-diagram-content>
        <rect
          v-if="bounds"
          v-bind="getStyles('page')"
          :x="bounds.x"
          :y="bounds.y"
          :width="bounds.width"
          :height="bounds.height"
        />
        <g>
          <component :is="DiagramEdgeView" v-for="id in renderedEdges" :id="id" :key="id" />
        </g>
        <g>
          <component :is="DiagramNodeView" v-for="id in renderedNodes" :id="id" :key="id" />
        </g>
      </g>
      <g :transform="transform">
        <component :is="DiagramOverlayLayer" />
        <component :is="DiagramSelectionLayer" />
      </g>
    </svg>
    <DiagramRulers v-if="rulers" :size="RULER_SIZE" @create-guide="onRulerGuide" />
    <DiagramTextEditor :offset="offset" />
  </div>
</template>
