<script lang="ts">
import type { VNodeChild } from 'vue'
import { createVarsResolver, rem } from '../../core'

const defaultProps = {
  size: 120,
  thickness: 12,
  startAngle: 270,
} as const

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>(
  (_, { size, thickness, transitionDuration, startAngle }) => ({
    root: {
      '--rp-size': rem(size),
      '--rp-label-offset': rem((thickness ?? defaultProps.thickness) * 2),
      '--rp-transition-duration': transitionDuration ? `${transitionDuration}ms` : undefined,
    },
    svg: {
      '--rp-start-angle': `${startAngle}deg`,
    },
  }),
)

/**
 * The label may be renderable content or a function returning it, so it is rendered as
 * a child rather than interpolated. Module scope keeps the identity stable.
 */
const RingLabel = (props: { label: any }): VNodeChild =>
  typeof props.label === 'function' ? props.label() : props.label

RingLabel.props = ['label']

/** A section can never be thicker than a quarter of the ring, or the arcs overlap. */
function getClampedThickness(thickness: number, size: number) {
  return Math.min(thickness || 12, (size || 120) / 4)
}

export { defaultProps, varsResolver, RingLabel, getClampedThickness }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import { Curve } from './Curve/Curve'
import { getCurves } from './get-curves/get-curves'
import type {
  RingProgressOwnProps,
  RingProgressSection,
  RingProgressSlots,
} from './RingProgress.types'
import classes from './RingProgress.module.css'

defineOptions({
  name: 'RingProgress',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<RingProgressOwnProps>(), {
  label: undefined,
  roundCaps: false,
  unstyled: false,
})

defineSlots<RingProgressSlots>()

const slots = useSlots()
const attrs = useAttrs()
const props = useProps('RingProgress', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'RingProgress',
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

const clampedThickness = computed(() => getClampedThickness(thickness.value, size.value))

const label = computed(() => slots.label?.() ?? props.label)

/**
 * `getCurves` turns the sections into arc geometry, including the background ring and
 * the extra caps that rounded ends need.
 */
const curves = computed(() =>
  getCurves({
    size: size.value,
    thickness: clampedThickness.value,
    sections: props.sections,
    renderRoundedLineCaps: props.roundCaps,
    rootColor: props.rootColor,
    sectionGap: props.sectionGap,
  }).map(({ data, sum, root, lineRoundCaps, offset }, index) => {
    const { value, color, tooltip, ...sectionAttrs } = data as RingProgressSection

    return {
      key: index,
      sectionAttrs,
      sum,
      offset,
      value,
      color,
      root,
      lineRoundCaps,
      ariaLabel: typeof tooltip === 'string' ? tooltip : undefined,
    }
  }),
)

const rootStyles = computed(() =>
  getStyles('root', { className: attrs.class, style: attrs.style as any }),
)
</script>

<template>
  <Box v-bind="{ ...attrs, ...rootStyles }" :size="size">
    <svg v-bind="getStyles('svg')" :viewBox="`0 0 ${size} ${size}`">
      <Curve
        v-for="curve in curves"
        :key="curve.key"
        v-bind="curve.sectionAttrs"
        :size="size"
        :thickness="clampedThickness"
        :sum="curve.sum"
        :offset="curve.offset"
        :value="curve.value"
        :color="curve.color"
        :root="curve.root"
        :line-round-caps="curve.lineRoundCaps"
        :get-styles="getStyles"
        :aria-label="curve.ariaLabel"
      />
    </svg>

    <div v-if="label" v-bind="getStyles('label')">
      <RingLabel :label="label" />
    </div>
  </Box>
</template>
