<script lang="ts">
import { createVarsResolver, getRadius, getSize, getThemeColor, rem } from '../../../core'

/**
 * `label` and `scale` default to functions. They are resolved by `useProps`, never by
 * `withDefaults`, which would treat a function default as a prop *factory* and call it.
 */
const defaultProps = {
  min: 0,
  max: 100,
  step: 1,
  minRange: 10,
  maxRange: Infinity,
  pushOnOverlap: true,
  marks: [],
  label: (value: number) => value,
  showLabelOnHover: true,
  scale: (value: number) => value,
  size: 'md',
  radius: 'xl',
  orientation: 'horizontal',
} as const

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((theme, { size, color, thumbSize, radius }) => ({
  root: {
    '--slider-size': getSize(size, 'slider-size'),
    '--slider-color': color ? getThemeColor(color, theme) : undefined,
    '--slider-radius': radius === undefined ? undefined : getRadius(radius),
    '--slider-thumb-size':
      thumbSize !== undefined ? rem(thumbSize) : 'calc(var(--slider-size) * 2)',
  },
}))

export { defaultProps, varsResolver }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs, useSlots, watch } from 'vue'
import { useMove, useUncontrolled } from '@mantine-vue/hooks'
import { useDirection, useProps, useStyles } from '../../../core'
import { provideSliderContext } from '../Slider.context'
import type { SliderMark } from '../SliderMark'
import { SliderRoot } from '../SliderRoot/SliderRoot'
import { Thumb } from '../Thumb/Thumb'
import { Track } from '../Track/Track'
import {
  clamp,
  findClosest,
  getChangeValue,
  getFloatingValue,
  getNextMarkValue,
  getPosition,
  getPrecision,
  getPreviousMarkValue,
} from '../utils/slider-utils'
import type {
  RangeSliderEmits,
  RangeSliderOwnProps,
  RangeSliderSlots,
  RangeSliderValue,
} from './RangeSlider.types'
import classes from '../Slider.module.css'

defineOptions({
  name: 'RangeSlider',
  inheritAttrs: false,
})

// Intentionally undefined to preserve downstream defaults.
const rawProps = withDefaults(defineProps<RangeSliderOwnProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  label: undefined,
  labelAlwaysOn: false,
  showLabelOnHover: undefined,
  pushOnOverlap: undefined,
  disabled: false,
  inverted: false,
  restrictToMarks: false,
  unstyled: false,
})

const emit = defineEmits<RangeSliderEmits>()

defineSlots<RangeSliderSlots>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('RangeSlider', defaultProps as any, rawProps) as any

const direction = useDirection()
const activeThumb = ref(0)
const focused = ref(0)
const hovered = ref(false)

const [current, setCurrent] = useUncontrolled<RangeSliderValue>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: [props.min, props.max],
  onChange: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

/** Read synchronously by `onScrubEnd`, which runs outside the reactive update. */
const valueRef = ref<RangeSliderValue>([...current.value])
watch(current, (value) => {
  valueRef.value = [...value]
})

const precision = computed(() => props.precision ?? getPrecision(props.step))
const domain = computed(() => props.domain ?? ([props.min, props.max] as RangeSliderValue))

const getStyles = useStyles({
  name: 'RangeSlider',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  unstyled: props.unstyled,
  varsResolver,
})

provideSliderContext({ getStyles })

function setAt(raw: number, index: number, end = false) {
  if (props.disabled) {
    return
  }

  const next = [...valueRef.value] as RangeSliderValue
  let value = getChangeValue({
    value: raw,
    min: domain.value[0],
    max: domain.value[1],
    step: props.step,
    precision: precision.value,
  })

  if (props.restrictToMarks) {
    value = findClosest(
      value,
      props.marks.map((mark: SliderMark) => mark.value),
    )
  }

  value = clamp(value, props.min, props.max)

  const other = index === 0 ? 1 : 0

  // `pushOnOverlap` moves the other thumb out of the way; otherwise this one stops.
  if (index === 0 && value > next[1] - props.minRange) {
    if (props.pushOnOverlap) next[1] = clamp(value + props.minRange, props.min, props.max)
    else value = next[0]
  }

  if (index === 1 && value < next[0] + props.minRange) {
    if (props.pushOnOverlap) next[0] = clamp(value - props.minRange, props.min, props.max)
    else value = next[1]
  }

  if (Math.abs(value - next[other]) > props.maxRange) {
    if (props.pushOnOverlap) next[other] = value + (index === 0 ? props.maxRange : -props.maxRange)
    else value = next[index]
  }

  next[index] = getFloatingValue(value, precision.value)
  next.sort((a, b) => a - b)

  setCurrent(next)
  valueRef.value = next

  if (end) {
    emit('change-end', next)
  }
}

const move = useMove<HTMLDivElement>(
  ({ x, y }) => setAt(props.orientation === 'vertical' ? 1 - y : x, activeThumb.value),
  { onScrubEnd: () => emit('change-end', valueRef.value) },
  direction.dir.value,
)

function onThumbKeydown(index: number, event: KeyboardEvent) {
  const increase = event.key === 'ArrowUp' || event.key === 'ArrowRight'
  const decrease = event.key === 'ArrowDown' || event.key === 'ArrowLeft'

  if (!increase && !decrease) {
    return
  }

  event.preventDefault()

  const currentValue = valueRef.value[index]
  const next = props.restrictToMarks
    ? increase
      ? getNextMarkValue(currentValue, props.marks)
      : getPreviousMarkValue(currentValue, props.marks)
    : currentValue + (increase ? props.step : -props.step)

  setAt((next - domain.value[0]) / (domain.value[1] - domain.value[0]), index, true)
}

const positions = computed(
  () =>
    current.value.map((value) =>
      getPosition({ value, min: domain.value[0], max: domain.value[1] }),
    ) as RangeSliderValue,
)

/** Picks the thumb nearest the press so dragging starts from the expected one. */
function onTrackMousedownCapture(event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const ratio =
    props.orientation === 'vertical'
      ? (rect.bottom - event.clientY) / rect.height
      : (event.clientX - rect.left) / rect.width
  const value = domain.value[0] + clamp(ratio, 0, 1) * (domain.value[1] - domain.value[0])

  activeThumb.value =
    Math.abs(current.value[0] - value) > Math.abs(current.value[1] - value) ? 1 : 0
}

const containerProps = computed(() => ({
  ref: (node: any) => move.ref(node?.$el ?? node),
  onMouseenter: () => {
    hovered.value = true
  },
  onMouseleave: () => {
    hovered.value = false
  },
  onMousedownCapture: onTrackMousedownCapture,
}))

function scaledAt(index: number) {
  return props.scale(current.value[index])
}

/**
 * An explicitly passed `label` wins; otherwise the scoped slot is tried before falling
 * back to the default `label` function. `rawProps` rather than `props` is what
 * distinguishes "set by the consumer" from "supplied by `defaultProps`".
 */
function labelAt(index: number) {
  const value = scaledAt(index)

  if (rawProps.label !== undefined) {
    return typeof props.label === 'function' ? props.label(value) : props.label
  }

  return (
    slots.label?.({ value, index }) ??
    (typeof props.label === 'function' ? props.label(value) : props.label)
  )
}

/** Stable functional component: thumb content is arbitrary renderable content. */
const renderThumbChildren = (index: number) => () =>
  props.thumbChildren !== undefined ? props.thumbChildren[index] : slots.thumbChildren?.({ index })
</script>

<template>
  <SliderRoot
    v-bind="attrs"
    :size="props.size"
    :disabled="props.disabled"
    :orientation="props.orientation"
  >
    <Track
      :offset="positions[0]"
      :marks-offset="current[0]"
      :filled="positions[1] - positions[0]"
      :marks="props.marks"
      :min="domain[0]"
      :max="domain[1]"
      :value="current[1]"
      :disabled="props.disabled"
      :inverted="props.inverted"
      :container-props="containerProps"
    >
      <Thumb
        v-for="index in [0, 1]"
        :key="index"
        v-bind="props.thumbProps?.(index)"
        :max="props.max"
        :min="props.min"
        :value="scaledAt(index)"
        :position="positions[index]"
        :dragging="move.active.value && activeThumb === index"
        :label="labelAt(index)"
        :label-always-on="props.labelAlwaysOn"
        :thumb-label="props.thumbLabel?.[index]"
        :thumb-value-text="props.thumbValueText"
        :show-label-on-hover="props.showLabelOnHover"
        :is-hovered="hovered"
        :disabled="props.disabled"
        :orientation="props.orientation"
        @mousedown="activeThumb = index"
        @focus="focused = index"
        @keydown="onThumbKeydown(index, $event)"
      >
        <component :is="renderThumbChildren(index)" />
      </Thumb>
    </Track>

    <template v-if="props.name">
      <input
        type="hidden"
        :name="`${props.name}_from`"
        :value="current[0]"
        v-bind="props.hiddenInputProps"
      />
      <input
        type="hidden"
        :name="`${props.name}_to`"
        :value="current[1]"
        v-bind="props.hiddenInputProps"
      />
    </template>
  </SliderRoot>
</template>
