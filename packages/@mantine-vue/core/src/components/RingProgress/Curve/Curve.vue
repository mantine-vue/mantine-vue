<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, getThemeColor, useMantineTheme } from '../../../core'
import { getCurveProps } from './get-curve-props'
import type { RingProgressCurveOwnProps } from './Curve.types'

defineOptions({
  name: 'RingProgressCurve',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<RingProgressCurveOwnProps>(), {
  value: undefined,
  lineRoundCaps: undefined,
  root: false,
  color: undefined,
})

const attrs = useAttrs()
const theme = useMantineTheme()

const curveStyles = computed(() =>
  props.getStyles('curve', {
    style: { '--curve-color': props.color ? getThemeColor(props.color, theme.value) : undefined },
  }),
)

/** Arc geometry: radius, circumference and the dash offset that positions the segment. */
const curveGeometry = computed(() =>
  getCurveProps({
    sum: props.sum,
    size: props.size,
    thickness: props.thickness,
    value: props.value,
    offset: props.offset,
    root: props.root,
  }),
)
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...curveStyles, ...curveGeometry }"
    component="circle"
    fill="none"
    :stroke-linecap="props.lineRoundCaps ? 'round' : 'butt'"
  />
</template>
