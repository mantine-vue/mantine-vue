<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import type { CenterOwnProps, CenterSlots } from './Center.types'
import classes from './Center.module.css'

defineOptions({
  name: 'Center',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<CenterOwnProps>(), {
  component: 'div',
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<CenterSlots>()

const attrs = useAttrs()

const props = useProps('Center', null, rawProps)

const getStyles = useStyles({
  name: 'Center',
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
  <Box
    v-bind="{ ...attrs, ...getStyles('root') }"
    :component="props.component"
    :mod="[{ inline: props.inline }, (attrs as any).mod]"
  >
    <slot />
  </Box>
</template>
