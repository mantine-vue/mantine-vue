<script lang="ts">
import { createVarsResolver, getSpacing } from '../../core'

/** Module scope: created once, not per component instance. */
const defaultProps = {
  gap: 'md',
  align: 'stretch',
  justify: 'flex-start',
} as const
const varsResolver = createVarsResolver<any>((_, { gap, align, justify }) => ({
  root: {
    '--stack-gap': getSpacing(gap),
    '--stack-align': align,
    '--stack-justify': justify,
  },
}))

export { defaultProps, varsResolver }
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import type { StackOwnProps } from './Stack.types'
import classes from './Stack.module.css'
defineOptions({
  name: 'Stack',
  inheritAttrs: false,
})
const rawProps = withDefaults(defineProps<StackOwnProps>(), {
  align: undefined,
  justify: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
const attrs = useAttrs()
const props = useProps('Stack', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'Stack',
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
  <Box v-bind="{ ...attrs, ...getStyles('root') }">
    <slot />
  </Box>
</template>
