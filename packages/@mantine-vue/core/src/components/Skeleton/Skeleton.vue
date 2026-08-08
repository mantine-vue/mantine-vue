<script lang="ts">
import { createVarsResolver, getRadius, rem } from '../../core'

/** Module scope: created once, not per component instance. */
const defaultProps = {
  visible: true,
  animate: true,
}
const varsResolver = createVarsResolver<any>((_, { width, height, radius, circle }) => ({
  root: {
    '--skeleton-height': rem(height),
    '--skeleton-width': circle ? rem(height) : rem(width),
    '--skeleton-radius': circle ? '1000px' : radius === undefined ? undefined : getRadius(radius),
  },
}))

export { defaultProps, varsResolver }
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import type { SkeletonOwnProps } from './Skeleton.types'
import classes from './Skeleton.module.css'
defineOptions({
  name: 'Skeleton',
  inheritAttrs: false,
})
const rawProps = withDefaults(defineProps<SkeletonOwnProps>(), {
  visible: undefined,
  circle: false,
  animate: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
const attrs = useAttrs()
const props = useProps('Skeleton', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'Skeleton',
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
</script>
<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('root') }"
    :mod="{ visible: props.visible, animate: props.animate }"
  >
    <slot />
  </Box>
</template>
