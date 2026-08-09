<script lang="ts">
import { rem } from '../../../core'

/** Checkerboard drawn under the gradient so transparency is visible. */
const CHECKERS = {
  backgroundImage:
    'linear-gradient(45deg,var(--slider-checkers) 25%,transparent 25%),linear-gradient(-45deg,var(--slider-checkers) 25%,transparent 25%),linear-gradient(45deg,transparent 75%,var(--slider-checkers) 75%)',
  backgroundSize: `${rem(8)} ${rem(8)}`,
}

const INSET_SHADOW = { boxShadow: `rgba(0,0,0,.1) 0 0 0 ${rem(1)} inset` }

export { CHECKERS, INSET_SHADOW }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { ColorSlider } from '../ColorSlider/ColorSlider'
import { round } from '../converters'
import type { AlphaSliderOwnProps } from './AlphaSlider.types'

defineOptions({
  name: 'AlphaSlider',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<AlphaSliderOwnProps>(), {
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

const overlays = computed(() => [
  CHECKERS,
  { backgroundImage: `linear-gradient(90deg, transparent, ${props.color})` },
  INSET_SHADOW,
])

/**
 * Bound as one object so the explicit handlers replace the ones spread from `props`.
 * `ColorSlider` declares `onChange` as a prop *and* emits `change`, so binding both a
 * spread value and a template listener would make Vue merge them into an array.
 *
 * Alpha is reported with two decimals; the raw track position has far more.
 */
const sliderProps = computed(() => ({
  ...attrs,
  ...props,
  __staticSelector: 'AlphaSlider',
  maxValue: 1,
  round: false,
  'data-alpha': '',
  overlays: overlays.value,
  'onUpdate:modelValue': (value: number) => emit('update:modelValue', round(value, 2)),
  onChange: (value: number) => emit('change', round(value, 2)),
  onChangeEnd: (value: number) => emit('change-end', round(value, 2)),
  onScrubStart: () => emit('scrub-start'),
  onScrubEnd: () => emit('scrub-end'),
}))
</script>

<template>
  <ColorSlider v-bind="sliderProps" />
</template>
