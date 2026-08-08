<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box } from '../../../core'
import { useAppShellContext } from '../AppShell.context'
import type { AppShellMainOwnProps, AppShellMainSlots } from './AppShellMain.types'

defineOptions({ name: 'AppShellMain', inheritAttrs: false })
const props = withDefaults(defineProps<AppShellMainOwnProps>(), {
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<AppShellMainSlots>()

const attrs = useAttrs()
const ctx = useAppShellContext()
</script>

<template>
  <Box
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
