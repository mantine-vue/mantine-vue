import { defineComponent, h } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { RichTextEditor } from '@mantine-vue/tiptap'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { RichTextEditor } from '@mantine-vue/tiptap'

const editor = useEditor({
  extensions: [StarterKit, Placeholder.configure({ placeholder: 'This is placeholder' })],
  content: '',
})
</script>

<template>
  <RichTextEditor :editor="editor">
    <RichTextEditor.Content />
  </RichTextEditor>
</template>
`

const Demo = defineComponent({
  name: 'TipTapPlaceholderDemo',
  setup() {
    const editor = useEditor({
      extensions: [StarterKit, Placeholder.configure({ placeholder: 'This is placeholder' })],
      content: '',
    })

    return () => h(RichTextEditor, { editor: editor.value }, () => h(RichTextEditor.Content))
  },
})

export const placeholder: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
