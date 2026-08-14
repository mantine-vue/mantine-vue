<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { EditorContent } from '@tiptap/vue-3'
import { Box, Typography, useProps } from '@mantine-vue/core'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import type { RichTextEditorContentRuntimeProps } from './RichTextEditorContent.types'

defineOptions({ name: 'RichTextEditorContent', inheritAttrs: false })

const rawProps = withDefaults(defineProps<RichTextEditorContentRuntimeProps>(), {
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: undefined,
})

const attrs = useAttrs()
const props = useProps('RichTextEditorContent', null, rawProps)
const ctx = useRichTextEditorContext()
const contentProps = computed(() => {
  const forwarded = { ...attrs }
  delete forwarded.class
  delete forwarded.style
  return {
    ...ctx.getStyles('content', {
      classNames: props.classNames,
      styles: props.styles,
      className: ctx.withTypographyStyles ? undefined : attrs.class,
      style: ctx.withTypographyStyles ? undefined : attrs.style,
    }),
    ...forwarded,
  }
})
const typographyProps = computed(() =>
  ctx.getStyles('Typography', {
    className: attrs.class,
    style: attrs.style,
    styles: props.styles,
    classNames: props.classNames,
  }),
)
</script>

<template>
  <Typography v-if="ctx.withTypographyStyles" v-bind="typographyProps" :unstyled="ctx.unstyled">
    <Box :component="EditorContent" :editor="ctx.editor" v-bind="contentProps" />
  </Typography>
  <Box v-else :component="EditorContent" :editor="ctx.editor" v-bind="contentProps" />
</template>
