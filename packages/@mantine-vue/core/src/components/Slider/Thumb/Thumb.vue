<script lang="ts">
import type { VNodeChild } from 'vue'

/**
 * The label is arbitrary renderable content or a function returning it, so it is
 * rendered as a child rather than interpolated. Declared at module scope so the
 * component identity is stable across renders.
 */
const ThumbLabel = (props: { label: any }): VNodeChild =>
  typeof props.label === 'function' ? props.label() : props.label

ThumbLabel.props = ['label']

export { ThumbLabel }
</script>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { Box } from '../../../core'
import { useSliderContext } from '../Slider.context'
import type { SliderThumbOwnProps, SliderThumbSlots } from './Thumb.types'

defineOptions({
  name: 'SliderThumb',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SliderThumbOwnProps>(), {
  dragging: false,
  label: undefined,
  thumbValueText: undefined,
  labelTransitionProps: undefined,
  labelAlwaysOn: false,
  thumbLabel: undefined,
  showLabelOnHover: true,
  isHovered: false,
  disabled: false,
  orientation: 'horizontal',
})

const emit = defineEmits<{
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  mousedown: [event: MouseEvent | TouchEvent]
}>()

defineSlots<SliderThumbSlots>()

const attrs = useAttrs()
const ctx = useSliderContext()
const focused = ref(false)

const labelVisible = computed(
  () =>
    props.label != null &&
    (props.labelAlwaysOn ||
      props.dragging ||
      focused.value ||
      (props.showLabelOnHover && props.isHovered)),
)

const valueText = computed(() =>
  typeof props.thumbValueText === 'function'
    ? props.thumbValueText(props.value)
    : props.thumbValueText,
)

const thumbStyles = computed(() =>
  ctx.getStyles('thumb', { className: attrs.class, style: attrs.style }),
)

function onFocus(event: FocusEvent) {
  focused.value = true
  emit('focus', event)
}

function onBlur(event: FocusEvent) {
  focused.value = false
  emit('blur', event)
}

/** A click on the thumb must not reach the track, which would move the value. */
function onClick(event: MouseEvent) {
  event.stopPropagation()
}
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...thumbStyles }"
    :tabindex="props.disabled ? -1 : 0"
    role="slider"
    :aria-label="props.thumbLabel"
    :aria-valuemax="props.max"
    :aria-valuemin="props.min"
    :aria-valuenow="props.value"
    :aria-valuetext="valueText"
    :aria-disabled="props.disabled || undefined"
    :aria-orientation="props.orientation"
    :mod="{ dragging: props.dragging, disabled: props.disabled }"
    :style="[thumbStyles.style, { '--slider-thumb-offset': `${props.position}%` }, attrs.style]"
    @focus="onFocus"
    @blur="onBlur"
    @mousedown="emit('mousedown', $event)"
    @touchstart="emit('mousedown', $event)"
    @click="onClick"
  >
    <slot />

    <div v-if="labelVisible" v-bind="ctx.getStyles('label')">
      <ThumbLabel :label="props.label" />
    </div>
  </Box>
</template>
