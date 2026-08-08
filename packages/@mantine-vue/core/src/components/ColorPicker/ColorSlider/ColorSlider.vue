<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue'
import { clampUseMovePosition, useMove, useUncontrolled } from '@mantine-vue/hooks'
import { Box, useMantineTheme, useStyles } from '../../../core'
import { useColorPickerContext } from '../ColorPicker.context'
import { Thumb } from '../Thumb/Thumb'
import type { ColorSliderOwnProps } from './ColorSlider.types'
import classes from '../ColorPicker.module.css'

defineOptions({
  name: 'ColorSlider',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ColorSliderOwnProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  size: 'md',
  focusable: true,
  thumbColor: 'transparent',
  __staticSelector: 'ColorPicker',
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
const ctx = useColorPickerContext()
const theme = useMantineTheme()

const [value, setValue] = useUncontrolled<number>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: 0,
  onChange: (nextValue) => {
    emit('update:modelValue', nextValue)
    emit('change', nextValue)
  },
})

const position = ref({ x: value.value / props.maxValue, y: 0 })
const positionRef = ref(position.value)

const ownStyles = useStyles({
  name: props.__staticSelector,
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
})

/** Inside a `ColorPicker` the styles come from the picker so the selectors stay shared. */
const getStyles = ctx?.getStyles ?? ownStyles

function changeValue(next: number) {
  return props.round ? Math.round(next * props.maxValue) : next * props.maxValue
}

const move = useMove<HTMLDivElement>(
  ({ x, y }) => {
    positionRef.value = { x, y }
    position.value = { x, y: 0 }
    setValue(changeValue(x))
  },
  {
    onScrubStart: () => emit('scrub-start'),
    onScrubEnd: () => {
      emit('change-end', changeValue(positionRef.value.x))
      emit('scrub-end')
    },
  },
)

watch(value, (next) => {
  position.value = { x: next / props.maxValue, y: 0 }
})

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
    return
  }

  event.preventDefault()

  const next = clampUseMovePosition({
    x: position.value.x + (event.key === 'ArrowRight' ? 0.05 : -0.05),
    y: 0,
  })
  const nextValue = changeValue(next.x)

  setValue(nextValue)
  emit('change-end', nextValue)
}

function setSliderRef(node: any) {
  move.ref(node?.$el ?? node)
}

const sliderStyles = computed(() =>
  getStyles('slider', { className: attrs.class, style: attrs.style }),
)
const overlayStyles = computed(() => getStyles('sliderOverlay'))
const thumbStyles = computed(() => getStyles('thumb'))
</script>

<template>
  <Box
    :ref="setSliderRef"
    v-bind="{ ...attrs, ...sliderStyles }"
    role="slider"
    :aria-valuenow="value"
    :aria-valuemax="props.maxValue"
    :aria-valuemin="0"
    :tabindex="props.focusable ? 0 : -1"
    :data-focus-ring="theme.focusRing"
    :style="[
      sliderStyles.style,
      { '--cp-thumb-size': `var(--cp-thumb-size-${props.size})` },
      attrs.style,
    ]"
    @keydown="onKeydown"
  >
    <div
      v-for="(overlay, index) in props.overlays"
      :key="index"
      v-bind="overlayStyles"
      :style="[overlayStyles.style, overlay]"
    />

    <Thumb
      :position="position"
      v-bind="thumbStyles"
      :style="[thumbStyles.style, { top: '0.0625rem', background: props.thumbColor }]"
    />
  </Box>
</template>
