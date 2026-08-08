<script lang="ts">
import { rem } from '../../../core'

const OVERLAYS = [
  {
    backgroundImage:
      'linear-gradient(to right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(170,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%))',
  },
  {
    boxShadow: `rgba(0,0,0,.1) 0 0 0 ${rem(1)} inset, rgba(0,0,0,.15) 0 0 ${rem(4)} inset`,
  },
]

export { OVERLAYS }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue'
import { ColorSlider } from '../ColorSlider/ColorSlider'
import type { HueSliderOwnProps } from './HueSlider.types'

defineOptions({
  name: 'HueSlider',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<HueSliderOwnProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  size: 'md',
  focusable: true,
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
  'change-end': [value: number]
  'scrub-start': []
  'scrub-end': []
}>()

const attrs = useAttrs()

/**
 * Mirrors the hue so the thumb colour keeps up in uncontrolled mode. Reading the props
 * alone – as the previous render function did – left the thumb stuck on the initial
 * hue once the user started dragging, because the value then lives inside
 * `ColorSlider`.
 */
const lastEmitted = ref(props.modelValue ?? props.defaultValue ?? 0)

watch(
  () => props.modelValue,
  (next) => {
    if (next !== undefined) {
      lastEmitted.value = next
    }
  },
)

const thumbColor = computed(() => `hsl(${lastEmitted.value}, 100%, 50%)`)

/**
 * Bound as one object so the explicit handlers replace the ones spread from `props`.
 * `ColorSlider` declares `onChange` as a prop *and* emits `change`, so binding both a
 * spread value and a template listener would make Vue merge them into an array.
 */
const sliderProps = computed(() => ({
  ...attrs,
  ...props,
  __staticSelector: 'HueSlider',
  maxValue: 360,
  thumbColor: thumbColor.value,
  round: true,
  'data-hue': '',
  overlays: OVERLAYS,
  'onUpdate:modelValue': (next: number) => {
    lastEmitted.value = next
    emit('update:modelValue', next)
  },
  onChange: (next: number) => {
    lastEmitted.value = next
    emit('change', next)
  },
  onChangeEnd: (next: number) => emit('change-end', next),
  onScrubStart: () => emit('scrub-start'),
  onScrubEnd: () => emit('scrub-end'),
}))
</script>

<template>
  <ColorSlider v-bind="sliderProps" />
</template>
