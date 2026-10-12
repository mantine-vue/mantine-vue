<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, omitAttrs } from '../../core'
import { useToolbarContext } from './Toolbar.context'
import type { ToolbarToggleProps } from './Toolbar.types'
defineOptions({ name: 'ToolbarToggle', inheritAttrs: false })
const props = withDefaults(defineProps<ToolbarToggleProps>(), {
  component: 'button',
  disabled: false,
  active: false,
  autoWidth: false,
})
const attrs = useAttrs()
const ctx = useToolbarContext()
function onClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  const handler = (attrs as any).onClick
  if (Array.isArray(handler)) handler.forEach((item) => item?.(event))
  else handler?.(event)
}
</script>
<template>
  <Box
    v-bind="{
      ...omitAttrs(attrs, ['onClick']),
      ...ctx.getStyles('toggle', {
        className: attrs.class,
        style: attrs.style,
        classNames: props.classNames,
        styles: props.styles,
        focusable: true,
      }),
    }"
    :component="props.component"
    :type="attrs.type ?? (props.component === 'button' ? 'button' : undefined)"
    data-toolbar-toggle
    :data-active="props.active || undefined"
    :data-disabled="props.disabled || undefined"
    :data-auto-width="props.autoWidth || undefined"
    :disabled="props.disabled || undefined"
    :aria-disabled="props.disabled || undefined"
    :aria-pressed="props.active"
    :tabindex="props.disabled ? -1 : (attrs.tabindex ?? 0)"
    @click="onClick"
    ><slot
  /></Box>
</template>
