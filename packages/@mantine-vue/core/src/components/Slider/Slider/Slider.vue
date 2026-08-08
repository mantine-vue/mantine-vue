<script lang="ts">
import { createVarsResolver, getRadius, getSize, getThemeColor, rem } from '../../../core'

/**
 * `label` and `scale` default to functions. They are resolved by `useProps`, never by
 * `withDefaults`, which would treat a function default as a prop *factory* and call it.
 */
const defaultProps = {
  radius: 'xl',
  min: 0,
  max: 100,
  step: 1,
  marks: [],
  label: (value: number) => value,
  thumbLabel: '',
  showLabelOnHover: true,
  scale: (value: number) => value,
  size: 'md',
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
import { resolveNode, useDirection, useProps, useStyles } from '../../../core'
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
import type { SliderEmits, SliderOwnProps, SliderSlots } from './Slider.types'
import classes from '../Slider.module.css'

defineOptions({
  name: 'Slider',
  inheritAttrs: false,
})

// Intentionally undefined to preserve downstream defaults.
const rawProps = withDefaults(defineProps<SliderOwnProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  label: undefined,
  thumbChildren: undefined,
  labelAlwaysOn: false,
  showLabelOnHover: undefined,
  disabled: false,
  inverted: false,
  restrictToMarks: false,
  unstyled: false,
})

const emit = defineEmits<SliderEmits>()

defineSlots<SliderSlots>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('Slider', defaultProps as any, rawProps) as any

const direction = useDirection()
const hovered = ref(false)
const thumb = ref<HTMLElement | null>(null)

const [current, setCurrent] = useUncontrolled<number>({
  value: () => {
    const controlledValue = props.modelValue
    return controlledValue === undefined ? undefined : clamp(controlledValue, props.min, props.max)
  },
  defaultValue:
    props.defaultValue === undefined ? undefined : clamp(props.defaultValue, props.min, props.max),
  finalValue: clamp(0, props.min, props.max),
  onChange: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

/** Read synchronously by `onScrubEnd`, which runs outside the reactive update. */
const valueRef = ref(current.value)
watch(current, (value) => {
  valueRef.value = value
})

const precision = computed(() => props.precision ?? getPrecision(props.step))
const domain = computed(() => props.domain ?? ([props.min, props.max] as [number, number]))

const getStyles = useStyles({
  name: 'Slider',
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

function update(raw: number, end = false) {
  if (props.disabled) {
    return
  }

  let next = getChangeValue({
    value: raw,
    min: domain.value[0],
    max: domain.value[1],
    step: props.step,
    precision: precision.value,
  })

  if (props.restrictToMarks) {
    next = findClosest(
      next,
      props.marks.map((mark: SliderMark) => mark.value),
    )
  }

  next = getFloatingValue(clamp(next, props.min, props.max), precision.value)
  setCurrent(next)
  valueRef.value = next

  if (end) {
    emit('change-end', next)
  }
}

const move = useMove<HTMLDivElement>(
  ({ x, y }) => update(props.orientation === 'vertical' ? 1 - y : x),
  { onScrubEnd: () => !props.disabled && emit('change-end', valueRef.value) },
  direction.dir.value,
)

function onKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    return
  }

  const increase =
    event.key === 'ArrowUp' ||
    (event.key === 'ArrowRight' && direction.dir.value === 'ltr') ||
    (event.key === 'ArrowLeft' && direction.dir.value === 'rtl')
  const decrease =
    event.key === 'ArrowDown' ||
    (event.key === 'ArrowLeft' && direction.dir.value === 'ltr') ||
    (event.key === 'ArrowRight' && direction.dir.value === 'rtl')

  if (!increase && !decrease) {
    return
  }

  event.preventDefault()

  const next = props.restrictToMarks
    ? increase
      ? getNextMarkValue(valueRef.value, props.marks)
      : getPreviousMarkValue(valueRef.value, props.marks)
    : valueRef.value + (increase ? props.step : -props.step)

  update(
    (clamp(next, domain.value[0], domain.value[1]) - domain.value[0]) /
      (domain.value[1] - domain.value[0]),
    true,
  )
}

const position = computed(() =>
  getPosition({ value: current.value, min: domain.value[0], max: domain.value[1] }),
)

const scaled = computed(() => props.scale(current.value))

/**
 * An explicitly passed `label` wins; otherwise the scoped slot is tried before falling
 * back to the default `label` function. `rawProps` rather than `props` is what
 * distinguishes "set by the consumer" from "supplied by `defaultProps`".
 */
const label = computed(() => {
  if (rawProps.label !== undefined) {
    return typeof props.label === 'function' ? props.label(scaled.value) : props.label
  }

  return (
    slots.label?.({ value: scaled.value }) ??
    (typeof props.label === 'function' ? props.label(scaled.value) : props.label)
  )
})

const start = computed(() =>
  typeof props.startPointValue === 'number' && !props.inverted
    ? getPosition({ value: props.startPointValue, min: domain.value[0], max: domain.value[1] })
    : 0,
)

const containerProps = computed(() => ({
  ref: (node: any) => move.ref(node?.$el ?? node),
  onMouseenter: () => {
    hovered.value = true
  },
  onMouseleave: () => {
    hovered.value = false
  },
}))

function setThumbRef(node: any) {
  thumb.value = node?.$el ?? node
}

const thumbChildren = computed(() => resolveNode(props.thumbChildren, slots.thumbChildren))
const renderThumbChildren = () => thumbChildren.value
</script>

<template>
  <SliderRoot
    v-bind="attrs"
    :size="props.size"
    :disabled="props.disabled"
    :orientation="props.orientation"
  >
    <Track
      :filled="Math.abs(position - start)"
      :offset="Math.min(position, start)"
      :marks="props.marks"
      :min="domain[0]"
      :max="domain[1]"
      :value="current"
      :disabled="props.disabled"
      :inverted="props.inverted"
      :start-point-value="props.startPointValue"
      :container-props="containerProps"
    >
      <Thumb
        :ref="setThumbRef"
        v-bind="props.thumbProps"
        :max="props.max"
        :min="props.min"
        :value="scaled"
        :position="position"
        :dragging="move.active.value"
        :label="label"
        :label-transition-props="props.labelTransitionProps"
        :label-always-on="props.labelAlwaysOn"
        :thumb-label="props.thumbLabel"
        :thumb-value-text="props.thumbValueText"
        :show-label-on-hover="props.showLabelOnHover"
        :is-hovered="hovered"
        :disabled="props.disabled"
        :orientation="props.orientation"
        @keydown="onKeydown"
      >
        <component :is="renderThumbChildren" />
      </Thumb>
    </Track>

    <input
      v-if="props.name"
      type="hidden"
      :name="props.name"
      :value="current"
      v-bind="props.hiddenInputProps"
    />
  </SliderRoot>
</template>
