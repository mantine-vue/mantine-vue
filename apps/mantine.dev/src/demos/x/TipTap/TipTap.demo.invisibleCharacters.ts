import { defineComponent, h } from 'vue'
import InvisibleCharacters from '@tiptap/extension-invisible-characters'
import StarterKit from '@tiptap/starter-kit'
import { useEditor } from '@tiptap/vue-3'
import { RichTextEditor } from '@mantine-vue/tiptap'
import type { MantineDemo } from '@/demo'

const Demo = defineComponent({
  name: 'TipTapInvisibleCharactersDemo',
  setup() {
    const editor = useEditor({
      extensions: [StarterKit, InvisibleCharacters.configure({ visible: false })],
      content:
        '<p>Toggle the control to reveal spaces and paragraph breaks.</p><p>Every paragraph ends with a pilcrow.</p>',
    })
    return () =>
      h(RichTextEditor, { editor: editor.value }, () => [
        h(RichTextEditor.Toolbar, { sticky: true }, () => [
          h(RichTextEditor.ControlsGroup, null, () => [
            h(RichTextEditor.Bold),
            h(RichTextEditor.Italic),
            h(RichTextEditor.Underline),
          ]),
          h(RichTextEditor.ControlsGroup, null, () => h(RichTextEditor.InvisibleCharacters)),
        ]),
        h(RichTextEditor.Content),
      ])
  },
})

export const invisibleCharacters: MantineDemo = {
  type: 'code',
  component: Demo,
  code: `<script setup lang="ts">
import InvisibleCharacters from '@tiptap/extension-invisible-characters'
import StarterKit from '@tiptap/starter-kit'
import { useEditor } from '@tiptap/vue-3'
import { RichTextEditor } from '@mantine-vue/tiptap'
const editor = useEditor({ extensions: [StarterKit, InvisibleCharacters.configure({ visible: false })] })
</script>
<template>
  <RichTextEditor :editor="editor">
    <RichTextEditor.Toolbar><RichTextEditor.ControlsGroup><RichTextEditor.InvisibleCharacters /></RichTextEditor.ControlsGroup></RichTextEditor.Toolbar>
    <RichTextEditor.Content />
  </RichTextEditor>
</template>`,
}
