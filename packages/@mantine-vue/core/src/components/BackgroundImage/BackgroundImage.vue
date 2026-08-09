<script lang="ts">
import { createVarsResolver, getRadius } from '../../core'

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, { radius }) => ({
  root: { '--bi-radius': radius === undefined ? undefined : getRadius(radius) },
}))

export { varsResolver }
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import type { BackgroundImageOwnProps } from './BackgroundImage.types'
import classes from './BackgroundImage.module.css'
defineOptions({
  name: 'BackgroundImage',
  inheritAttrs: false,
})
const rawProps = withDefaults(defineProps<BackgroundImageOwnProps>(), {
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
const attrs = useAttrs()
const props = useProps('BackgroundImage', null, rawProps)

const getStyles = useStyles({
  name: 'BackgroundImage',
  props,
  classes,
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
    v-bind="{ ...attrs, ...getStyles('root', { style: { backgroundImage: `url(${props.src})` } }) }"
  >
    <slot />
  </Box>
</template>
