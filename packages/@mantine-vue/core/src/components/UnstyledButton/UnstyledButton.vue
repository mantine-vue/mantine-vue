<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { Box, useForwardedRef, useStyles } from '../../core'
import type { UnstyledButtonOwnProps, UnstyledButtonSlots } from './UnstyledButton.types'
import classes from './UnstyledButton.module.css'
defineOptions({ name: 'UnstyledButton', inheritAttrs: false })
const props = withDefaults(defineProps<UnstyledButtonOwnProps>(), {
  component: 'button',
  __staticSelector: undefined,
  variant: undefined,
  mod: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<UnstyledButtonSlots>()
const attrs = useAttrs()
const getStyles = useStyles({
  name: props.__staticSelector ?? 'UnstyledButton',
  classes,
  props,
  get className() {
    return attrs.class
  },
  get style() {
    return attrs.style as any
  },
  get classNames() {
    return props.classNames as any
  },
  get styles() {
    return props.styles as any
  },
  get vars() {
    return props.vars as any
  },
  get unstyled() {
    return props.unstyled
  },
})
const elementRef = ref<HTMLElement | null>(null)
useForwardedRef(elementRef)
</script>
<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('root', { focusable: true }) }"
    :component="props.component"
    :variant="props.variant"
    :mod="props.mod"
    :type="attrs.type ?? (props.component === 'button' ? 'button' : undefined)"
    ref="elementRef"
    ><slot
  /></Box>
</template>
