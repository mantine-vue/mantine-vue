<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { boxCorners, unionRects, type Rect } from '../../core/geometry'
import { canUseCanvas } from '../../core/text'
import type { DiagramNode } from '../../core/types'
import { useDiagramContext } from '../../vue/context'
import type { DiagramPanelPosition } from '../../vue/types'
import DiagramPanel from '../DiagramPanel/DiagramPanel.vue'

defineOptions({ name: 'DiagramMinimap' })

const props = withDefaults(
  defineProps<{
    /** Position over the canvas, `'static'` renders the minimap in place. Defaults to `'bottom-right'` inside a Diagram */
    position?: DiagramPanelPosition | 'static'
    /** Width in pixels */
    width?: number
    /** Height in pixels */
    height?: number
    /** Fill color of a node, a CSS color. Uses the node fill or the theme stroke color by default */
    nodeColor?: string | ((node: DiagramNode) => string | undefined)
  }>(),
  { position: undefined, width: 200, height: 140, nodeColor: undefined },
)

const { controller, labels, getStyles, inCanvas, resolveColor } = useDiagramContext()
const { editor } = controller
const canvas = ref<HTMLCanvasElement | null>(null)
let frame = 0
let themeObserver: MutationObserver | null = null

/** Canvas can only draw resolved colors: CSS variables are resolved with a probe element. */
const colorCache = new Map<string, string>()

function cssColor(color: string | undefined, fallback: string) {
  if (!color) {
    return fallback
  }

  let resolved = colorCache.get(color)

  if (resolved === undefined) {
    const element = canvas.value

    if (!element || typeof getComputedStyle !== 'function') {
      return fallback
    }

    element.style.color = color
    resolved = getComputedStyle(element).color || fallback
    element.style.color = ''
    colorCache.set(color, resolved)
  }

  return resolved
}

/** World area shown: the content and the visible area together. */
const world = computed<Rect>(() => {
  void controller.commitVersion.value
  void controller.version.value
  const visible = editor.getVisibleRect()
  const content = editor.getContentBounds()

  return unionRects([visible, ...(content ? [content] : [])]) ?? visible
})

const transform = computed(() => {
  const area = world.value
  const scale = Math.min(
    props.width / Math.max(area.width, 1),
    props.height / Math.max(area.height, 1),
  )
  const offsetX = (props.width - area.width * scale) / 2 - area.x * scale
  const offsetY = (props.height - area.height * scale) / 2 - area.y * scale

  return { scale, offsetX, offsetY }
})

function draw() {
  frame = 0
  const element = canvas.value
  const context = canUseCanvas() ? element?.getContext('2d') : null

  if (!element || !context) {
    return
  }

  const ratio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  element.width = props.width * ratio
  element.height = props.height * ratio
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  context.clearRect(0, 0, props.width, props.height)

  const { scale, offsetX, offsetY } = transform.value
  const toMap = (x: number, y: number): [number, number] => [
    x * scale + offsetX,
    y * scale + offsetY,
  ]
  const defaultColor = cssColor('var(--diagram-node-stroke)', '#868e96')

  for (const node of editor.store.getNodes()) {
    if (!editor.isNodeVisible(node) || editor.getBehavior(node.type).container) {
      continue
    }

    const custom = typeof props.nodeColor === 'function' ? props.nodeColor(node) : props.nodeColor
    const fill =
      node.style?.fill && node.style.fill !== 'transparent'
        ? resolveColor(node.style.fill)
        : undefined
    context.fillStyle = cssColor(custom ?? fill, defaultColor)
    context.globalAlpha = 0.85
    context.beginPath()
    boxCorners(node).forEach((corner, index) => {
      const [x, y] = toMap(corner.x, corner.y)

      if (index === 0) {
        context.moveTo(x, y)
      } else {
        context.lineTo(x, y)
      }
    })
    context.closePath()
    context.fill()
  }

  context.globalAlpha = 1
  const visible = editor.getVisibleRect()
  const [vx, vy] = toMap(visible.x, visible.y)
  context.strokeStyle = cssColor('var(--diagram-accent)', '#228be6')
  context.lineWidth = 1.5
  context.strokeRect(vx, vy, visible.width * scale, visible.height * scale)
}

function schedule() {
  if (frame || typeof requestAnimationFrame !== 'function') {
    return
  }

  frame = requestAnimationFrame(draw)
}

function refreshColors() {
  colorCache.clear()
  schedule()
}

watch(
  () => [
    controller.version.value,
    controller.viewport.value,
    controller.viewportSize.value,
    controller.structureVersion.value,
    props.width,
    props.height,
  ],
  schedule,
)
watch(() => props.nodeColor, refreshColors)

onMounted(() => {
  schedule()

  if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
    themeObserver = new MutationObserver(refreshColors)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-mantine-color-scheme'],
    })
  }
})
onBeforeUnmount(() => {
  themeObserver?.disconnect()
  themeObserver = null

  if (frame && typeof cancelAnimationFrame === 'function') {
    cancelAnimationFrame(frame)
  }
})

let dragging = false

function navigate(event: PointerEvent) {
  const box = canvas.value?.getBoundingClientRect()

  if (!box) {
    return
  }

  const { scale, offsetX, offsetY } = transform.value
  const x = (event.clientX - box.left - offsetX) / scale
  const y = (event.clientY - box.top - offsetY) / scale
  editor.centerOn({ x, y })
}

function onPointerDown(event: PointerEvent) {
  dragging = true
  ;(event.currentTarget as Element).setPointerCapture?.(event.pointerId)
  navigate(event)
}

function onPointerMove(event: PointerEvent) {
  if (dragging) {
    navigate(event)
  }
}

function onPointerUp() {
  dragging = false
}

function onKeyDown(event: KeyboardEvent) {
  const step = 60
  const moves: Record<string, [number, number]> = {
    ArrowLeft: [step, 0],
    ArrowRight: [-step, 0],
    ArrowUp: [0, step],
    ArrowDown: [0, -step],
  }

  if (moves[event.key]) {
    event.preventDefault()
    editor.panBy(...moves[event.key])
  } else if (event.key === '+' || event.key === '=') {
    event.preventDefault()
    editor.zoomIn()
  } else if (event.key === '-') {
    event.preventDefault()
    editor.zoomOut()
  }
}

const position = computed(() => props.position ?? (inCanvas ? 'bottom-right' : 'static'))
</script>

<template>
  <component
    :is="position === 'static' ? 'div' : DiagramPanel"
    v-bind="position === 'static' ? {} : { position }"
  >
    <div
      v-bind="getStyles('minimap')"
      :style="{ width: `${props.width}px`, height: `${props.height}px` }"
      tabindex="0"
      role="group"
      :aria-label="labels.minimap"
      @pointerdown.stop="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @keydown.stop="onKeyDown"
    >
      <canvas ref="canvas" v-bind="getStyles('minimapCanvas')" aria-hidden="true" />
    </div>
  </component>
</template>
