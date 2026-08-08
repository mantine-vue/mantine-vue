<script lang="ts">
import { createVarsResolver } from '../../core'
import { getMarkColor } from './get-mark-color'

const defaultProps = {
  color: 'yellow',
}

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((theme, { color }) => ({
  root: {
    '--mark-bg-dark': getMarkColor({ color, theme, defaultShade: 5 }),
    '--mark-bg-light': getMarkColor({ color, theme, defaultShade: 2 }),
  },
}))

export { defaultProps, varsResolver }
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import type { MarkOwnProps, MarkSlots } from './Mark.types'
import classes from './Mark.module.css'

defineOptions({
  name: 'Mark',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<MarkOwnProps>(), {
  color: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<MarkSlots>()

const attrs = useAttrs()

const props = useProps('Mark', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'Mark',
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
  <Box v-bind="{ ...attrs, ...getStyles('root') }" component="mark">
    <slot />
  </Box>
</template>
