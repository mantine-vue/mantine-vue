<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
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
  rootRef: undefined,
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

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>
<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('root', { focusable: true }) }"
    :component="props.component"
    :variant="props.variant"
    :mod="props.mod"
    :type="attrs.type ?? (props.component === 'button' ? 'button' : undefined)"
    :rootRef="setRootRef"
    ref="elementRef"
    ><slot
  /></Box>
</template>
