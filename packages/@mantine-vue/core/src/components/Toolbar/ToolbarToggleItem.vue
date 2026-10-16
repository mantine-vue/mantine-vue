<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, omitAttrs } from '../../core'
import { useToolbarContext, useToolbarToggleGroupContext } from './Toolbar.context'
import type { ToolbarToggleItemProps } from './Toolbar.types'
defineOptions({ name: 'ToolbarToggleItem', inheritAttrs: false })
const props = withDefaults(defineProps<ToolbarToggleItemProps>(), {
  disabled: false,
  autoWidth: false,
})
const attrs = useAttrs()
const ctx = useToolbarContext()
const group = useToolbarToggleGroupContext()
const active = computed(() =>
  group.type === 'single'
    ? group.value === props.value
    : (group.value as string[]).includes(props.value),
)
const disabled = computed(() => props.disabled || group.disabled)
function onClick(event: MouseEvent) {
  if (disabled.value) {
    event.preventDefault()
    return
  }
  group.onChange(props.value)
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
    component="button"
    type="button"
    data-toolbar-toggle
    :data-active="active || undefined"
    :data-disabled="disabled || undefined"
    :data-auto-width="props.autoWidth || undefined"
    :disabled="disabled || undefined"
    :aria-pressed="active"
    :tabindex="disabled ? -1 : (attrs.tabindex ?? 0)"
    @click="onClick"
    ><slot
  /></Box>
</template>
