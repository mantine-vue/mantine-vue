<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, useStyles } from '../../../core'
import type { InputPlaceholderOwnProps, InputPlaceholderSlots } from './InputPlaceholder.types'
import classes from '../Input.module.css'

defineOptions({ name: 'InputPlaceholder', inheritAttrs: false })
const props = withDefaults(defineProps<InputPlaceholderOwnProps>(), {
  rootRef: undefined,
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

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <Box
    :rootRef="setRootRef"
    v-bind="{
      ...attrs,
      ...getStyles('placeholder', { className: attrs.class, style: attrs.style as any }),
    }"
    component="span"
    :mod="[{ error: Boolean(props.error) }, props.mod]"
    ><slot
  /></Box>
</template>
