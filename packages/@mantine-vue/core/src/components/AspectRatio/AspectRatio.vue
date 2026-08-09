<script lang="ts">
import { createVarsResolver } from '../../core'

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, { ratio }) => ({
  root: {
    '--ar-ratio': ratio?.toString(),
  },
}))

export { varsResolver }
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import type { AspectRatioOwnProps } from './AspectRatio.types'
import classes from './AspectRatio.module.css'
defineOptions({
  name: 'AspectRatio',
  inheritAttrs: false,
})
const rawProps = withDefaults(defineProps<AspectRatioOwnProps>(), {
  ratio: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
const attrs = useAttrs()
const props = useProps('AspectRatio', null, rawProps)

const getStyles = useStyles({
  name: 'AspectRatio',
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
