<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box } from '../../../core'
import { useAppShellContext } from '../AppShell.context'
import type { AppShellMainOwnProps, AppShellMainSlots } from './AppShellMain.types'

defineOptions({ name: 'AppShellMain', inheritAttrs: false })
const props = withDefaults(defineProps<AppShellMainOwnProps>(), {
  rootRef: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<AppShellMainSlots>()

const attrs = useAttrs()
const ctx = useAppShellContext()

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
      ...ctx.getStyles('main', {
        className: attrs.class,
        style: attrs.style,
        classNames: props.classNames,
        styles: props.styles,
      }),
    }"
    component="main"
  >
    <slot />
  </Box>
</template>
