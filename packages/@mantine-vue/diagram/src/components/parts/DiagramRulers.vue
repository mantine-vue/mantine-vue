<script setup lang="ts">
import { computed } from 'vue'
import { niceStep, unionRects } from '../../core/geometry'
import { getNodeBounds } from '../../core/shapes'
import { unitToWorld } from '../../core/units'
import { useDiagramContext } from '../../vue/context'

defineOptions({ name: 'DiagramRulers' })

const props = defineProps<{ size: number }>()
const emit = defineEmits<{ createGuide: [payload: { axis: 'x' | 'y'; event: PointerEvent }] }>()

const { controller, getStyles } = useDiagramContext()
const { editor } = controller

/** World length of one display unit, and the step between labelled ticks in display units. */
const scaleInfo = computed(() => {
  void controller.settings.value
  const scale = editor.scale
  const unitLength = unitToWorld(1, scale.unit === 'ft-in' ? { ...scale, unit: 'ft' } : scale)
  const zoom = controller.viewport.value.zoom
  const step = niceStep(64 / Math.max(unitLength * zoom, 1e-9))

  return { unitLength, step, zoom }
})

function ticks(axis: 'x' | 'y') {
  const { unitLength, step, zoom } = scaleInfo.value
  const viewport = controller.viewport.value
  const size = controller.viewportSize.value
  const length = axis === 'x' ? size.width : size.height
  const origin = axis === 'x' ? viewport.x : viewport.y
  const startUnit = -origin / zoom / unitLength
  const endUnit = (length - origin) / zoom / unitLength
  const minor = step / 5
  const result: { position: number; major: boolean; label: string }[] = []
  const first = Math.floor(startUnit / minor) * minor

  for (let value = first, guard = 0; value <= endUnit && guard < 1000; value += minor, guard += 1) {
    const rounded = Math.round(value / minor) * minor
    const major = Math.abs(rounded / step - Math.round(rounded / step)) < 1e-6
    result.push({
      position: rounded * unitLength * zoom + origin,
      major,
      label: major ? String(Math.round(rounded * 1000) / 1000) : '',
    })
  }

  return result
}

const horizontal = computed(() => ticks('x'))
const vertical = computed(() => ticks('y'))

/** Extent of the selection on both axes, in screen coordinates. */
const highlight = computed(() => {
  const bounds = unionRects(
    controller.selection.value
      .map((id) => controller.nodeRef(id).value)
      .filter((node) => node !== undefined)
      .map((node) => getNodeBounds(node!)),
  )

  if (!bounds) {
    return null
  }

  const start = editor.worldToScreen({ x: bounds.x, y: bounds.y })
  const end = editor.worldToScreen({ x: bounds.x + bounds.width, y: bounds.y + bounds.height })

  return { x: start.x, y: start.y, width: end.x - start.x, height: end.y - start.y }
})

const unitLabel = computed(() => {
  void controller.settings.value
  const unit = editor.scale.unit

  return unit === 'ft-in' ? 'ft' : unit
})
</script>

<template>
  <div v-bind="getStyles('rulerCorner')" :title="unitLabel" aria-hidden="true" />
  <div
    v-bind="getStyles('ruler')"
    data-orientation="horizontal"
    aria-hidden="true"
    @pointerdown.stop.prevent="emit('createGuide', { axis: 'y', event: $event })"
  >
    <svg width="100%" :height="props.size">
      <rect
        v-if="highlight"
        v-bind="getStyles('rulerHighlight')"
        :x="highlight.x"
        y="0"
        :width="Math.max(highlight.width, 1)"
        :height="props.size"
      />
      <template v-for="tick in horizontal" :key="tick.position">
        <line
          :x1="Math.round(tick.position) + 0.5"
          :x2="Math.round(tick.position) + 0.5"
          :y1="tick.major ? 0 : props.size * 0.65"
          :y2="props.size"
        />
        <text v-if="tick.label" :x="tick.position + 3" y="10">{{ tick.label }}</text>
      </template>
    </svg>
  </div>
  <div
    v-bind="getStyles('ruler')"
    data-orientation="vertical"
    aria-hidden="true"
    @pointerdown.stop.prevent="emit('createGuide', { axis: 'x', event: $event })"
  >
    <svg :width="props.size" height="100%">
      <rect
        v-if="highlight"
        v-bind="getStyles('rulerHighlight')"
        x="0"
        :y="highlight.y"
        :width="props.size"
        :height="Math.max(highlight.height, 1)"
      />
      <template v-for="tick in vertical" :key="tick.position">
        <line
          :y1="Math.round(tick.position) + 0.5"
          :y2="Math.round(tick.position) + 0.5"
          :x1="tick.major ? 0 : props.size * 0.65"
          :x2="props.size"
        />
        <text
          v-if="tick.label"
          :x="10"
          :y="tick.position + 3"
          :transform="`rotate(-90 10 ${tick.position + 3})`"
          text-anchor="end"
        >
          {{ tick.label }}
        </text>
      </template>
    </svg>
  </div>
</template>
