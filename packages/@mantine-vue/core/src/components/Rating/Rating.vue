<script lang="ts">
import { createVarsResolver, getSize, getThemeColor } from '../../core'

/** Rounds to the nearest multiple of `to`, keeping `to`'s decimal precision. */
function roundValueTo(value: number, to: number) {
  const rounded = Math.round(value / to) * to
  const precision = `${to}`.split('.')[1]?.length || 0
  return Number(rounded.toFixed(precision))
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/** `getSymbolLabel` is a function default, so it is resolved by `useProps`. */
const defaultProps = {
  size: 'sm',
  getSymbolLabel: (value: number) => `${value}`,
  count: 5,
  fractions: 1,
  color: 'yellow',
} as const

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((theme, { size, color }) => ({
  root: {
    '--rating-size': getSize(size, 'rating-size'),
    '--rating-color': getThemeColor(color, theme),
  },
}))

export { roundValueTo, clamp, defaultProps, varsResolver }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue'
import { useId, useUncontrolled } from '@mantine-vue/hooks'
import { Box, useDirection, useProps, useStyles } from '../../core'
import { provideRatingContext } from './Rating.context'
import { RatingItem } from './RatingItem/RatingItem'
import type { RatingOwnProps, RatingSlots } from './Rating.types'
import classes from './Rating.module.css'

defineOptions({
  name: 'Rating',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<RatingOwnProps>(), {
  modelValue: undefined,
  defaultValue: undefined,
  emptySymbol: undefined,
  fullSymbol: undefined,
  readOnly: false,
  allowClear: false,
  highlightSelectedOnly: false,
  unstyled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
  hover: [value: number]
}>()

defineSlots<RatingSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('Rating', defaultProps, rawProps)

const rootRef = ref<HTMLDivElement | null>(null)
const hovered = ref(-1)
const isOutside = ref(true)

const { dir } = useDirection()
const name = useId(props.name)
const id = useId(props.id)

const [currentValue, setCurrentValue] = useUncontrolled<number>({
  value: () => props.modelValue,
  defaultValue: props.defaultValue,
  finalValue: 0,
  onChange: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

const getStyles = useStyles({
  name: 'Rating',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

provideRatingContext({ getStyles })

/** A scoped slot is exposed to `RatingItem` as a function of the item value. The slot takes precedence over the prop. */
const emptySymbol = computed(
  () =>
    (slots.emptySymbol ? (value: number) => slots.emptySymbol!({ value }) : undefined) ??
    props.emptySymbol,
)
const fullSymbol = computed(
  () =>
    (slots.fullSymbol ? (value: number) => slots.fullSymbol!({ value }) : undefined) ??
    props.fullSymbol,
)

const count = computed(() => Math.max(0, Math.floor(props.count ?? defaultProps.count)))

const fractions = computed(() => {
  const value = Math.floor(props.fractions ?? defaultProps.fractions)

  if (value < 0) {
    throw new Error('Rating fractions cannot be negative')
  }

  return value
})

const decimalUnit = computed(() => 1 / Math.max(fractions.value, 1))
const stableValueRounded = computed(() => roundValueTo(currentValue.value, decimalUnit.value))

/** Hovering previews a value without committing it. */
const finalValue = computed(() => (hovered.value !== -1 ? hovered.value : stableValueRounded.value))

/**
 * One group per whole symbol. The first group carries an extra item for the zero
 * fraction, so a rating can be cleared by selecting the very start of the track.
 */
const groups = computed(() =>
  Array.from({ length: count.value }, (_, index) => {
    const integerValue = index + 1
    const fractionCount = index === 0 ? fractions.value + 1 : fractions.value

    return {
      integerValue,
      isGroupActive: !props.readOnly && Math.ceil(hovered.value) === integerValue,
      items: Array.from({ length: fractionCount }, (_unused, fractionIndex) => {
        const fractionValue = decimalUnit.value * (index === 0 ? fractionIndex : fractionIndex + 1)
        const symbolValue = roundValueTo(integerValue - 1 + fractionValue, decimalUnit.value)

        return {
          key: `${integerValue}-${symbolValue}`,
          fractionValue,
          symbolValue,
          id: `${id.value}-${index}-${fractionIndex}`,
        }
      }),
    }
  }),
)

function isFull(symbolValue: number) {
  return props.highlightSelectedOnly
    ? symbolValue === finalValue.value
    : symbolValue <= finalValue.value
}

function getRatingFromCoordinates(x: number) {
  if (!rootRef.value) {
    return 0
  }

  const { left, right, width } = rootRef.value.getBoundingClientRect()
  const symbolWidth = width / count.value
  const hoverPosition = dir.value === 'rtl' ? right - x : x - left
  const hoverValue = hoverPosition / symbolWidth

  return clamp(
    roundValueTo(hoverValue + decimalUnit.value / 2, decimalUnit.value),
    decimalUnit.value,
    count.value,
  )
}

function setRootRef(node: any) {
  rootRef.value = node?.$el ?? node ?? null
}

function onItemBlur() {
  // Only reset the preview if the pointer has already left the rating; otherwise the
  // hover state belongs to wherever the pointer currently is.
  if (isOutside.value) {
    hovered.value = -1
  }
}

function onInputChange(value: number) {
  if (!props.readOnly) {
    hovered.value = value
  }
}

function onChangeValue(value: number) {
  if (!props.readOnly) {
    setCurrentValue(props.allowClear && value === stableValueRounded.value ? 0 : value)
  }
}

function onMouseenter() {
  if (!props.readOnly) {
    isOutside.value = false
  }
}

function onMousemove(event: MouseEvent) {
  if (props.readOnly) {
    return
  }

  const rounded = getRatingFromCoordinates(event.clientX)

  if (rounded !== hovered.value) {
    hovered.value = rounded
    emit('hover', rounded)
  }
}

function onMouseleave() {
  if (props.readOnly) {
    return
  }

  const previous = hovered.value
  hovered.value = -1
  isOutside.value = true

  if (previous !== -1) {
    emit('hover', -1)
  }
}

function onTouchstart(event: TouchEvent) {
  if (!props.readOnly && event.touches.length === 1) {
    setCurrentValue(getRatingFromCoordinates(event.touches[0].clientX))
  }
}

/** Prevents the touch from being replayed as a click on the item underneath. */
function onTouchend(event: TouchEvent) {
  event.preventDefault()
}
</script>

<template>
  <Box
    :ref="setRootRef"
    v-bind="{
      ...attrs,
      ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
    }"
    :id="id"
    @mouseenter="onMouseenter"
    @mousemove="onMousemove"
    @mouseleave="onMouseleave"
    @touchstart="onTouchstart"
    @touchend="onTouchend"
  >
    <div
      v-for="group in groups"
      :key="group.integerValue"
      v-bind="getStyles('symbolGroup')"
      :data-active="group.isGroupActive ? true : undefined"
    >
      <RatingItem
        v-for="item in group.items"
        :key="item.key"
        :get-symbol-label="props.getSymbolLabel"
        :empty-icon="emptySymbol"
        :full-icon="fullSymbol"
        :full="isFull(item.symbolValue)"
        :active="item.symbolValue === finalValue"
        :checked="item.symbolValue === stableValueRounded"
        :read-only="props.readOnly"
        :fraction-value="item.fractionValue"
        :value="item.symbolValue"
        :name="name"
        :id="item.id"
        :on-item-blur="onItemBlur"
        :on-input-change="onInputChange"
        :on-change-value="onChangeValue"
      />
    </div>
  </Box>
</template>
