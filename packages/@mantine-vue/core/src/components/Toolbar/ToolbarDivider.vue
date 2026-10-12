<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box } from '../../core'
import { useToolbarContext } from './Toolbar.context'
import type { ToolbarDividerProps } from './Toolbar.types'
defineOptions({ name: 'ToolbarDivider', inheritAttrs: false })
const props = defineProps<ToolbarDividerProps>()
const attrs = useAttrs()
const ctx = useToolbarContext()
</script>
<template>
  <Box
    v-bind="{
      ...attrs,
      ...ctx.getStyles('divider', {
        className: attrs.class,
        style: attrs.style,
        classNames: props.classNames,
        styles: props.styles,
      }),
    }"
    role="separator"
    :aria-orientation="
      attrs['aria-orientation'] ?? (ctx.orientation === 'horizontal' ? 'vertical' : 'horizontal')
    "
    :data-orientation="ctx.orientation"
  />
</template>
