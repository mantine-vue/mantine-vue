<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { UnstyledButton, useProps } from '@mantine-vue/core'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import type {
  RichTextEditorControlRuntimeProps,
  RichTextEditorControlSlots,
} from './RichTextEditorControl.types'

defineOptions({ name: 'RichTextEditorControl', inheritAttrs: false })

const rawProps = withDefaults(defineProps<RichTextEditorControlRuntimeProps>(), {
  active: undefined,
  interactive: true,
  disabled: undefined,
  variant: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: undefined,
})

defineSlots<RichTextEditorControlSlots>()

const attrs = useAttrs()
const props = useProps('RichTextEditorControl', null, rawProps)
const ctx = useRichTextEditorContext()
const forwardedAttrs = computed(() => {
  const result = { ...attrs }
  delete result.onMousedown
  return result
})
const controlProps = computed(() => ({
  ...forwardedAttrs.value,
  ...ctx.getStyles('control', {
    className: attrs.class,
    style: attrs.style,
    classNames: props.classNames,
    styles: props.styles,
  }),
}))

function onMousedown(event: MouseEvent) {
  event.preventDefault()
  const handler = attrs.onMousedown
  if (typeof handler === 'function') {
    handler(event)
  }
}
</script>

<template>
  <UnstyledButton
    v-bind="controlProps"
    :disabled="props.disabled"
    data-rich-text-editor-control
    :tabindex="props.interactive ? 0 : -1"
    :data-interactive="props.interactive || undefined"
    :data-disabled="props.disabled || undefined"
    :data-active="props.active || undefined"
    :aria-pressed="props.active && props.interactive ? true : undefined"
    :aria-hidden="!props.interactive || undefined"
    :unstyled="ctx.unstyled"
    :variant="props.variant || ctx.variant || 'default'"
    @mousedown="onMousedown"
  >
    <slot />
  </UnstyledButton>
</template>
