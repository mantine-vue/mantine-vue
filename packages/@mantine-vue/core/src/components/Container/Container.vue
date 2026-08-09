<script lang="ts">
import { createVarsResolver, getSize } from '../../core'

/** Module scope: created once, not per component instance. */
const defaultProps = {
  strategy: 'block',
} as const
const varsResolver = createVarsResolver<any>((_, { size, fluid }) => ({
  root: {
    '--container-size': fluid ? undefined : getSize(size, 'container-size'),
  },
}))

export { defaultProps, varsResolver }
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import type { ContainerOwnProps } from './Container.types'
import classes from './Container.module.css'
defineOptions({
  name: 'Container',
  inheritAttrs: false,
})
const rawProps = withDefaults(defineProps<ContainerOwnProps>(), {
  fluid: false,
  strategy: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
const attrs = useAttrs()
const props = useProps('Container', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'Container',
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
    :mod="{ fluid: props.fluid, strategy: props.strategy }"
  >
    <slot />
  </Box>
</template>
