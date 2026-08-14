<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, useProps } from '@mantine-vue/core'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import type {
  RichTextEditorControlsGroupRuntimeProps,
  RichTextEditorControlsGroupSlots,
} from './RichTextEditorControlsGroup.types'

defineOptions({ name: 'RichTextEditorControlsGroup', inheritAttrs: false })

const rawProps = withDefaults(defineProps<RichTextEditorControlsGroupRuntimeProps>(), {
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: undefined,
  variant: undefined,
})

defineSlots<RichTextEditorControlsGroupSlots>()

const attrs = useAttrs()
const props = useProps('RichTextEditorControlsGroup', null, rawProps)
const ctx = useRichTextEditorContext()
const rootProps = computed(() => ({
  ...attrs,
  variant: props.variant || ctx.variant,
  ...ctx.getStyles('controlsGroup', {
    className: attrs.class,
    style: attrs.style,
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
