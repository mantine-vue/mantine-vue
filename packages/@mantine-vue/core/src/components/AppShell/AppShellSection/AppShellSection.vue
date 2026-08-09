<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box } from '../../../core'
import { useAppShellContext } from '../AppShell.context'
import type { AppShellSectionOwnProps, AppShellSectionSlots } from './AppShellSection.types'

defineOptions({ name: 'AppShellSection', inheritAttrs: false })
const props = withDefaults(defineProps<AppShellSectionOwnProps>(), {
  component: 'div',
  mod: undefined,
})
defineSlots<AppShellSectionSlots>()
const attrs = useAttrs()
const ctx = useAppShellContext()
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...ctx.getStyles('section', { className: attrs.class, style: attrs.style }),
    }"
    :component="props.component"
    :mod="[{ grow: props.grow }, props.mod]"
    ><slot
  /></Box>
</template>
