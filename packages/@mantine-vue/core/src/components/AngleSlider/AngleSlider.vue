<script lang="ts">
import { createVarsResolver, rem } from '../../core'

const defaultProps = {
  step: 1,
  withLabel: true,
} as const

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, { size, thumbSize }) => ({
  root: {
    '--slider-size': size === undefined ? undefined : rem(size),
    '--thumb-size': thumbSize === undefined ? undefined : rem(thumbSize),
  },
}))

export { defaultProps, varsResolver }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { normalizeRadialValue, useRadialMove, useUncontrolled } from '@mantine-vue/hooks'
import { Box, findClosestNumber, useProps, useStyles } from '../../core'
import type { AngleSliderOwnProps } from './AngleSlider.types'
import classes from './AngleSlider.module.css'

defineOptions({
  name: 'AngleSlider',
  inheritAttrs: false,
})

// Intentionally undefined to preserve downstream defaults.
const props_ = withDefaults(defineProps<AngleSliderOwnProps>(), {
  withLabel: undefined,
  disabled: false,
  restrictToMarks: false,
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
const props = useProps('AngleSlider', defaultProps, props_)

const rootRef = ref<HTMLDivElement | null>(null)

const [value, setValue] = useUncontrolled<number>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: 0,
  onChange: (next) => {
    emit('update:modelValue', next)
    emit('change', next)
  },
})

/** Snaps to the nearest mark when `restrictToMarks` is set. */
function resolveValue(nextValue: number) {
  return props.restrictToMarks && Array.isArray(props.marks)
    ? findClosestNumber(
        nextValue,
        props.marks.map((mark) => mark.value),
      )
    : nextValue
}

function update(nextValue: number) {
  if (!rootRef.value || props.disabled) {
    return
  }

  setValue(resolveValue(nextValue))
}

const radialMove = useRadialMove(update, {
  step: props.step,
  onChangeEnd: (next: number) => emit('change-end', next),
  onScrubStart: () => emit('scrub-start'),
  onScrubEnd: () => emit('scrub-end'),
})

const getStyles = useStyles({
  name: 'AngleSlider',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  varsResolver,
  unstyled: props.unstyled,
})

function setRootRef(node: any) {
  const element = node?.$el ?? node ?? null
  rootRef.value = element
  radialMove.ref(element)
}

/** Keyboard changes are committed immediately, so `onChangeEnd` fires per key press. */
function setKeyboardValue(nextValue: number) {
  const resolved = resolveValue(nextValue)
  setValue(resolved)
  emit('change-end', resolved)
}

function handleKeyDown(event: KeyboardEvent) {
  if (props.disabled) {
    return
  }

  const step = props.step ?? defaultProps.step
  let nextValue = value.value

  // The scale wraps around at 359/0 rather than clamping.
  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
    event.preventDefault()
    nextValue = value.value === 0 ? 359 : normalizeRadialValue(value.value - step, step)
  }

  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
    event.preventDefault()
    nextValue = value.value === 359 ? 0 : normalizeRadialValue(value.value + step, step)
  }

  if (event.key === 'Home') {
    nextValue = 0
  }

  if (event.key === 'End') {
    nextValue = 359
  }

  if (props.restrictToMarks && Array.isArray(props.marks)) {
    const markValues = props.marks.map((mark) => mark.value)
    const currentIndex = markValues.indexOf(value.value)

    // Already on a mark: step to the neighbouring mark instead of the nearest one,
    // which would otherwise be the mark the value is already on.
    if (currentIndex !== -1) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        nextValue = markValues[currentIndex === 0 ? markValues.length - 1 : currentIndex - 1]
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        nextValue = markValues[currentIndex === markValues.length - 1 ? 0 : currentIndex + 1]
      } else {
        nextValue = findClosestNumber(nextValue, markValues)
      }
    } else {
      nextValue = findClosestNumber(nextValue, markValues)
    }
  }

  setKeyboardValue(nextValue)
}

const rootStyles = computed(() =>
  getStyles('root', { className: attrs.class, style: attrs.style as any }),
)

const hasMarks = computed(() => Array.isArray(props.marks) && props.marks.length > 0)

const thumbStyles = computed(() =>
  getStyles('thumb', { style: { transform: `rotate(${value.value}deg)` } }),
)

const thumbTabindex = computed(
  () => (attrs.tabindex as number | string | undefined) ?? (props.disabled ? -1 : 0),
)

const thumbAriaLabel = computed(() => attrs['aria-label'] as string | undefined)

/** `formatLabel` may return a VNode, which cannot be interpolated as text. */
const renderLabel = () => (props.formatLabel ? props.formatLabel(value.value) : value.value)
</script>

<template>
  <Box :ref="setRootRef" v-bind="{ ...attrs, ...rootStyles }" :mod="{ disabled: props.disabled }">
    <div v-if="hasMarks" v-bind="getStyles('marks')">
      <div
        v-for="(mark, index) in props.marks"
        :key="index"
        v-bind="getStyles('mark', { style: { '--angle': `${mark.value}deg` } })"
        :data-label="mark.label || undefined"
      />
    </div>

    <div v-if="props.withLabel" v-bind="getStyles('label')">
      <component :is="renderLabel" />
    </div>

    <div
      v-bind="thumbStyles"
      :tabindex="thumbTabindex"
      role="slider"
      :aria-valuemax="360"
      :aria-valuemin="0"
      :aria-valuenow="value"
      :aria-label="thumbAriaLabel"
      @keydown="handleKeyDown"
    />

    <input v-bind="props.hiddenInputProps" type="hidden" :name="props.name" :value="value" />
  </Box>
</template>
