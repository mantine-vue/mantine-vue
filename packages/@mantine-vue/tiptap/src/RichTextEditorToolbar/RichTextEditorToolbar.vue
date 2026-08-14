<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, rem, useProps } from '@mantine-vue/core'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import type {
  RichTextEditorToolbarRuntimeProps,
  RichTextEditorToolbarSlots,
} from './RichTextEditorToolbar.types'

defineOptions({ name: 'RichTextEditorToolbar', inheritAttrs: false })

const rawProps = withDefaults(defineProps<RichTextEditorToolbarRuntimeProps>(), {
  sticky: false,
  stickyOffset: undefined,
  mod: undefined,
  variant: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: undefined,
})

defineSlots<RichTextEditorToolbarSlots>()

const attrs = useAttrs()
const props = useProps('RichTextEditorToolbar', null, rawProps)
const ctx = useRichTextEditorContext()
const rootProps = computed(() => ({
  ...attrs,
  mod: [{ sticky: props.sticky }, props.mod],
  variant: props.variant || ctx.variant,
  ...ctx.getStyles('toolbar', {
    className: attrs.class,
    style: [attrs.style, { '--rte-sticky-offset': rem(props.stickyOffset) }],
    styles: props.styles,
    classNames: props.classNames,
  }),
}))
</script>

<template>
  <Box v-bind="rootProps">
    <slot />
  </Box>
</template>
