<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, useProps, useStyles } from '../../core'
import type { CenterOwnProps, CenterSlots } from './Center.types'
import classes from './Center.module.css'

defineOptions({
  name: 'Center',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<CenterOwnProps>(), {
  rootRef: undefined,
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

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('root') }"
    :component="props.component"
    :mod="[{ inline: props.inline }, (attrs as any).mod]"
    :rootRef="setRootRef"
  >
    <slot />
  </Box>
</template>
