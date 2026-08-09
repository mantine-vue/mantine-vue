<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import type { VisuallyHiddenOwnProps } from './VisuallyHidden.types'
import classes from './VisuallyHidden.module.css'
defineOptions({
  name: 'VisuallyHidden',
  inheritAttrs: false,
})
const rawProps = withDefaults(defineProps<VisuallyHiddenOwnProps>(), {
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
const attrs = useAttrs()
const props = useProps('VisuallyHidden', null, rawProps)

const getStyles = useStyles({
  name: 'VisuallyHidden',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  unstyled: props.unstyled,
})
</script>
<template>
  <Box v-bind="{ ...attrs, ...getStyles('root') }" component="span">
    <slot />
  </Box>
</template>
