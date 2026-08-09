<script lang="ts">
import { createVarsResolver, getThemeColor, rem } from '../../core'

const defaultProps = {
  size: 200,
  thickness: 12,
  orientation: 'up',
  fillDirection: 'left-to-right',
  labelPosition: 'bottom',
} as const

function getRotation({
  orientation,
  fillDirection,
}: {
  orientation?: 'up' | 'down'
  fillDirection?: 'right-to-left' | 'left-to-right'
}) {
  if (orientation === 'down') {
    return fillDirection === 'right-to-left' ? 'rotate(180deg) rotateY(180deg)' : 'rotate(180deg)'
  }

  return fillDirection === 'left-to-right' ? 'rotateY(180deg)' : undefined
}

const varsResolver = createVarsResolver<any>(
  (
    theme,
    {
      filledSegmentColor,
      emptySegmentColor,
      orientation,
      fillDirection,
      transitionDuration,
      thickness,
    },
  ) => ({
    root: {
      '--scp-filled-segment-color': filledSegmentColor
        ? getThemeColor(filledSegmentColor, theme)
        : undefined,
      '--scp-empty-segment-color': emptySegmentColor
        ? getThemeColor(emptySegmentColor, theme)
        : undefined,
      '--scp-rotation': getRotation({ orientation, fillDirection }),
      '--scp-transition-duration': transitionDuration ? `${transitionDuration}ms` : undefined,
      '--scp-thickness': rem(thickness),
    },
  }),
)

export { varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { Box, hasNode, resolveNode, useProps, useStyles } from '../../core'
import type {
  SemiCircleProgressOwnProps,
  SemiCircleProgressSlots,
} from './SemiCircleProgress.types'
import classes from './SemiCircleProgress.module.css'

defineOptions({ name: 'SemiCircleProgress', inheritAttrs: false })

const rawProps = withDefaults(defineProps<SemiCircleProgressOwnProps>(), {
  size: undefined,
  thickness: undefined,
  orientation: undefined,
  fillDirection: undefined,
  filledSegmentColor: undefined,
  emptySegmentColor: undefined,
  transitionDuration: undefined,
  label: undefined,
  labelPosition: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<SemiCircleProgressSlots>()

const attrs = useAttrs()
const slots = useSlots()
const props = useProps('SemiCircleProgress', defaultProps, rawProps)
const getStyles = useStyles({
  name: 'SemiCircleProgress',
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

const size = computed(() => props.size ?? defaultProps.size)
const thickness = computed(() => props.thickness ?? defaultProps.thickness)
const coordinateForCircle = computed(() => size.value / 2)
const radius = computed(() => (size.value - 2 * thickness.value) / 2)
const circumference = computed(() => Math.PI * radius.value)
const semiCirclePercentage = computed(
  () => Math.min(100, Math.max(0, props.value)) * (circumference.value / 100),
)
const label = computed(() => resolveNode(props.label, slots.label))
const renderLabel = () => label.value
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
    }"
    :w="size"
  >
    <div
      v-if="hasNode(label)"
      v-bind="getStyles('label')"
      :data-position="props.labelPosition"
      :data-orientation="props.orientation"
    >
      <component :is="renderLabel" />
    </div>
    <svg
      :width="size"
      :height="size / 2"
      :viewBox="`0 0 ${size} ${size / 2}`"
      v-bind="getStyles('svg')"
    >
      <circle
        :cx="coordinateForCircle"
        :cy="coordinateForCircle"
        :r="radius"
        fill="none"
        stroke="var(--scp-empty-segment-color)"
        :stroke-width="thickness"
        :stroke-dasharray="circumference"
        v-bind="getStyles('emptySegment', { style: { strokeDashoffset: circumference } })"
      />
      <circle
        :cx="coordinateForCircle"
        :cy="coordinateForCircle"
        :r="radius"
        fill="none"
        stroke="var(--scp-filled-segment-color)"
        :stroke-width="thickness"
        :stroke-dasharray="circumference"
        v-bind="
          getStyles('filledSegment', {
            style: {
              strokeDashoffset: semiCirclePercentage,
              ...(semiCirclePercentage === 0 ? { strokeOpacity: 0 } : null),
            },
          })
        "
      />
    </svg>
  </Box>
</template>
