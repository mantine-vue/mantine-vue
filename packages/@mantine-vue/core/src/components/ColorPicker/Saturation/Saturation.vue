<script lang="ts">
/** Step applied to the normalised position by a single arrow key press. */
const KEYBOARD_STEP = 0.05

export { KEYBOARD_STEP }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue'
import { clampUseMovePosition, useMove } from '@mantine-vue/hooks'
import { Box } from '../../../core'
import { useColorPickerContext } from '../ColorPicker.context'
import { convertHsvaTo } from '../converters'
import { Thumb } from '../Thumb/Thumb'
import type { HsvaColor } from '../ColorPicker.types'
import type { SaturationOwnProps } from './Saturation.types'

defineOptions({
  name: 'Saturation',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SaturationOwnProps>(), {
  focusable: true,
})

const emit = defineEmits<{
  change: [color: Partial<HsvaColor>]
  'change-end': [color: Partial<HsvaColor>]
  'scrub-start': []
  'scrub-end': []
}>()

const attrs = useAttrs()
const ctx = useColorPickerContext()!

/** `y` is inverted: the top of the area is full brightness. */
const position = ref({ x: props.value.s / 100, y: 1 - props.value.v / 100 })
const positionRef = ref(position.value)

function toColor({ x, y }: { x: number; y: number }) {
  return { s: Math.round(x * 100), v: Math.round((1 - y) * 100) }
}

const move = useMove<HTMLDivElement>(
  ({ x, y }) => {
    position.value = { x, y }
    positionRef.value = { x, y }
    emit('change', toColor({ x, y }))
  },
  {
    onScrubStart: () => emit('scrub-start'),
    onScrubEnd: () => {
      emit('change-end', toColor(positionRef.value))
      emit('scrub-end')
    },
  },
)

watch(
  () => [props.value.s, props.value.v],
  () => {
    position.value = { x: props.value.s / 100, y: 1 - props.value.v / 100 }
  },
)

function onKeydown(event: KeyboardEvent) {
  let next = { ...position.value }

  if (event.key === 'ArrowUp') next.y -= KEYBOARD_STEP
  else if (event.key === 'ArrowDown') next.y += KEYBOARD_STEP
  else if (event.key === 'ArrowRight') next.x += KEYBOARD_STEP
  else if (event.key === 'ArrowLeft') next.x -= KEYBOARD_STEP
  else return

  event.preventDefault()
  next = clampUseMovePosition(next)

  const color = toColor(next)
  emit('change', color)
  emit('change-end', color)
}

function setAreaRef(node: any) {
  move.ref(node?.$el ?? node)
}

const hueOverlay = computed(() =>
  ctx.getStyles('saturationOverlay', {
    style: { backgroundColor: `hsl(${props.value.h}, 100%, 50%)` },
  }),
)
const whiteOverlay = computed(() =>
  ctx.getStyles('saturationOverlay', {
    style: { backgroundImage: 'linear-gradient(90deg,#fff,transparent)' },
  }),
)
const blackOverlay = computed(() =>
  ctx.getStyles('saturationOverlay', {
    style: { backgroundImage: 'linear-gradient(0deg,#000,transparent)' },
  }),
)
const thumbStyles = computed(() =>
  ctx.getStyles('thumb', { style: { backgroundColor: props.color } }),
)
</script>

<template>
  <Box
    :ref="setAreaRef"
    v-bind="{ ...attrs, ...ctx.getStyles('saturation') }"
    role="slider"
    :aria-label="props.saturationLabel"
    :aria-valuenow="position.x"
    :aria-valuetext="convertHsvaTo('rgba', props.value)"
    :tabindex="props.focusable ? 0 : -1"
    @keydown="onKeydown"
  >
    <div v-bind="hueOverlay" />
    <div v-bind="whiteOverlay" />
    <div v-bind="blackOverlay" />

    <Thumb :position="position" v-bind="thumbStyles" />
  </Box>
</template>
