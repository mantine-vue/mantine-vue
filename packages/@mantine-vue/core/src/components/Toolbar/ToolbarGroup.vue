<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box } from '../../core'
import { useToolbarContext } from './Toolbar.context'
import type { ToolbarGroupProps } from './Toolbar.types'
defineOptions({ name: 'ToolbarGroup', inheritAttrs: false })
const props = defineProps<ToolbarGroupProps>()
const attrs = useAttrs()
const ctx = useToolbarContext()
</script>
<template>
  <Box
    v-bind="{
      ...attrs,
      ...ctx.getStyles('group', {
        className: attrs.class,
        style: attrs.style,
        classNames: props.classNames,
        styles: props.styles,
      }),
    }"
    role="group"
    :data-orientation="ctx.orientation"
    ><slot
  /></Box>
</template>
