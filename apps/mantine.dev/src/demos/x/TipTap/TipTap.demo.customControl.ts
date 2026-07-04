import { defineComponent, h } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { RichTextEditor, useRichTextEditorContext } from '@mantine-vue/tiptap'
import { PhStar } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { RichTextEditor, useRichTextEditorContext } from '@mantine-vue/tiptap'
import { PhStar } from '@phosphor-icons/vue'

const editor = useEditor({
  extensions: [StarterKit],
  content: '<p>Click control to insert star emoji</p>',
})
</script>

<script lang="ts">
function InsertStarControl() {
  const { editor } = useRichTextEditorContext()
  return h(
    RichTextEditor.Control,
    {
      onClick: () => editor?.commands.insertContent('⭐'),
      'aria-label': 'Insert star emoji',
      title: 'Insert star emoji',
    },
    () => h(PhStar, { size: 16 }),
  )
}
</script>

<template>
  <RichTextEditor :editor="editor">
    <RichTextEditor.Toolbar>
      <InsertStarControl />
    </RichTextEditor.Toolbar>

    <RichTextEditor.Content />
  </RichTextEditor>
</template>
`

const InsertStarControl = defineComponent({
  name: 'InsertStarControl',
  setup() {
    const ctx = useRichTextEditorContext()
    return () =>
      h(
        RichTextEditor.Control,
        {
          onClick: () => ctx.editor?.commands.insertContent('⭐'),
          'aria-label': 'Insert star emoji',
          title: 'Insert star emoji',
        },
        () => h(PhStar, { size: 16 }),
      )
  },
})

const Demo = defineComponent({
  name: 'TipTapCustomControlDemo',
  setup() {
    const editor = useEditor({
      extensions: [StarterKit],
      content: '<p>Click control to insert star emoji</p>',
    })

    return () =>
      h(RichTextEditor, { editor: editor.value }, () => [
        h(RichTextEditor.Toolbar, null, () => h(InsertStarControl)),
        h(RichTextEditor.Content),
      ])
  },
})

export const customControl: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
