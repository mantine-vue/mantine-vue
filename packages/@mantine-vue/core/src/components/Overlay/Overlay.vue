<script lang="ts">
import { createVarsResolver, getDefaultZIndex, getRadius, rem, rgba } from '../../core'

/** Module scope: created once, not per component instance. */
const defaultProps = {
  zIndex: getDefaultZIndex('modal'),
}
const varsResolver = createVarsResolver<any>(
  (_, { gradient, color, backgroundOpacity, blur, radius, zIndex }) => ({
    root: {
      '--overlay-bg':
        gradient ||
        ((color !== undefined || backgroundOpacity !== undefined) &&
          rgba(color || '#000', backgroundOpacity ?? 0.6)) ||
        undefined,
      '--overlay-filter': blur ? `blur(${rem(blur)})` : undefined,
      '--overlay-radius': radius === undefined ? undefined : getRadius(radius),
      '--overlay-z-index': zIndex?.toString(),
    },
  }),
)

export { defaultProps, varsResolver }
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import type { OverlayOwnProps } from './Overlay.types'
import classes from './Overlay.module.css'
defineOptions({
  name: 'Overlay',
  inheritAttrs: false,
})
const rawProps = withDefaults(defineProps<OverlayOwnProps>(), {
  component: 'div',
  backgroundOpacity: undefined,
  color: undefined,
  gradient: undefined,
  center: false,
  fixed: false,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
const attrs = useAttrs()
const props = useProps('Overlay', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'Overlay',
  classes,
  props,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  varsResolver,
  unstyled: props.unstyled,
})
</script>
<template>
  <Box
    v-bind="{
      ...attrs,
      ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
    }"
    :component="props.component"
    :mod="{ center: props.center, fixed: props.fixed }"
  >
    <slot />
  </Box>
</template>
