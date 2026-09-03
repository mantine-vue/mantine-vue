import { defineComponent, h } from 'vue'
import { Details, DetailsContent, DetailsSummary } from '@tiptap/extension-details'
import StarterKit from '@tiptap/starter-kit'
import { useEditor } from '@tiptap/vue-3'
import { RichTextEditor } from '@mantine-vue/tiptap'
import type { MantineDemo } from '@/demo'

const Demo = defineComponent({
  name: 'TipTapDetailsDemo',
  setup() {
    const editor = useEditor({
      extensions: [StarterKit, Details, DetailsSummary, DetailsContent],
      content: `<details><summary>Shipping and delivery</summary><p>Orders are processed within 1–2 business days.</p></details>
<details><summary>Returns and refunds</summary><p>Return any item within 30 days for a refund.</p></details><p></p>`,
    })
    return () =>
      h(RichTextEditor, { editor: editor.value }, () => [
        h(RichTextEditor.Toolbar, { sticky: true }, () => [
          h(RichTextEditor.ControlsGroup, null, () => [
            h(RichTextEditor.Bold),
            h(RichTextEditor.Italic),
            h(RichTextEditor.Underline),
          ]),
          h(RichTextEditor.ControlsGroup, null, () => h(RichTextEditor.Details)),
        ]),
        h(RichTextEditor.Content),
      ])
  },
})

export const details: MantineDemo = {
  type: 'code',
  component: Demo,
  code: `<script setup lang="ts">
import { Details, DetailsContent, DetailsSummary } from '@tiptap/extension-details'
import StarterKit from '@tiptap/starter-kit'
import { useEditor } from '@tiptap/vue-3'
import { RichTextEditor } from '@mantine-vue/tiptap'
const editor = useEditor({ extensions: [StarterKit, Details, DetailsSummary, DetailsContent], content: '<details><summary>Shipping</summary><p>Details</p></details>' })
</script>
<template>
  <RichTextEditor :editor="editor">
    <RichTextEditor.Toolbar><RichTextEditor.ControlsGroup><RichTextEditor.Details /></RichTextEditor.ControlsGroup></RichTextEditor.Toolbar>
    <RichTextEditor.Content />
  </RichTextEditor>
</template>`,
}
