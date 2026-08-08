<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useStyles } from '../../../core'
import type { InputPlaceholderOwnProps, InputPlaceholderSlots } from './InputPlaceholder.types'
import classes from '../Input.module.css'

defineOptions({ name: 'InputPlaceholder', inheritAttrs: false })
const props = withDefaults(defineProps<InputPlaceholderOwnProps>(), {
  error: undefined,
  mod: undefined,
  classNames: undefined,
  styles: undefined,
})
defineSlots<InputPlaceholderSlots>()
const attrs = useAttrs()
const getStyles = useStyles({
  name: 'InputPlaceholder',
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
  <Box
    v-bind="{
      ...attrs,
      ...getStyles('placeholder', { className: attrs.class, style: attrs.style as any }),
    }"
    component="span"
    :mod="[{ error: Boolean(props.error) }, props.mod]"
    ><slot
  /></Box>
</template>
