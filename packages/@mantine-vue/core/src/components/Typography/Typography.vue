<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import type { TypographyOwnProps } from './Typography.types'
import classes from './Typography.module.css'
defineOptions({
  name: 'Typography',
  inheritAttrs: false,
})
const rawProps = withDefaults(defineProps<TypographyOwnProps>(), {
  classNames: undefined,
  styles: undefined,
  unstyled: false,
})
const attrs = useAttrs()
const props = useProps('Typography', null, rawProps)

const getStyles = useStyles({
  name: 'Typography',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
})
</script>
<template>
  <Box v-bind="{ ...attrs, ...getStyles('root') }">
    <slot />
  </Box>
</template>
