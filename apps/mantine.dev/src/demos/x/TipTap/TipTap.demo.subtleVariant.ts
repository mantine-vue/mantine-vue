import { defineComponent, h } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import { RichTextEditor } from '@mantine-vue/tiptap'
import type { MantineDemo } from '@/demo'

const content = '<p>Subtle rich text editor variant</p>'

const code = `
<script setup lang="ts">
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import { RichTextEditor } from '@mantine-vue/tiptap'

const content = '<p>Subtle rich text editor variant</p>'

const editor = useEditor({
  extensions: [StarterKit, Highlight],
  content,
})
</script>

<template>
  <RichTextEditor :editor="editor" variant="subtle">
    <RichTextEditor.Toolbar sticky sticky-offset="var(--docs-header-height)">
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Bold />
        <RichTextEditor.Italic />
        <RichTextEditor.Underline />
        <RichTextEditor.Strikethrough />
        <RichTextEditor.ClearFormatting />
        <RichTextEditor.Highlight />
        <RichTextEditor.Code />
      </RichTextEditor.ControlsGroup>
    </RichTextEditor.Toolbar>

    <RichTextEditor.Content />
  </RichTextEditor>
</template>
`

const Demo = defineComponent({
  name: 'TipTapSubtleVariantDemo',
  setup() {
    const editor = useEditor({
      extensions: [StarterKit, Highlight],
      content,
    })

    return () =>
      h(RichTextEditor, { editor: editor.value, variant: 'subtle' }, () => [
        h(RichTextEditor.Toolbar, { sticky: true, stickyOffset: 'var(--docs-header-height)' }, () =>
          h(RichTextEditor.ControlsGroup, null, () => [
            h(RichTextEditor.Bold),
            h(RichTextEditor.Italic),
            h(RichTextEditor.Underline),
            h(RichTextEditor.Strikethrough),
            h(RichTextEditor.ClearFormatting),
            h(RichTextEditor.Highlight),
            h(RichTextEditor.Code),
          ]),
        ),
        h(RichTextEditor.Content),
      ])
  },
})

export const subtleVariant: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
