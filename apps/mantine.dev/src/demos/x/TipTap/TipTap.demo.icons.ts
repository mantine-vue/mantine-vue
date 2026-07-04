import { defineComponent, h } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { RichTextEditor } from '@mantine-vue/tiptap'
import { PhTextB, PhTextItalic } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { RichTextEditor } from '@mantine-vue/tiptap'
import { PhTextB, PhTextItalic } from '@phosphor-icons/vue'
import { h } from 'vue'

const BoldIcon = () => h(PhTextB, { size: 16 })
const ItalicIcon = () => h(PhTextItalic, { size: 16 })

const editor = useEditor({
  extensions: [StarterKit],
  content: '<p>Customize icons with icon prop</p>',
})
</script>

<template>
  <RichTextEditor :editor="editor">
    <RichTextEditor.Toolbar>
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Bold :icon="BoldIcon" />
        <RichTextEditor.Italic :icon="ItalicIcon" />
      </RichTextEditor.ControlsGroup>
    </RichTextEditor.Toolbar>

    <RichTextEditor.Content />
  </RichTextEditor>
</template>
`

const BoldIcon = () => h(PhTextB, { size: 16 })
const ItalicIcon = () => h(PhTextItalic, { size: 16 })

const Demo = defineComponent({
  name: 'TipTapIconsDemo',
  setup() {
    const editor = useEditor({
      extensions: [StarterKit],
      content: '<p>Customize icons with icon prop</p>',
    })

    return () =>
      h(RichTextEditor, { editor: editor.value }, () => [
        h(RichTextEditor.Toolbar, null, () =>
          h(RichTextEditor.ControlsGroup, null, () => [
            h(RichTextEditor.Bold, { icon: BoldIcon }),
            h(RichTextEditor.Italic, { icon: ItalicIcon }),
          ]),
        ),
        h(RichTextEditor.Content),
      ])
  },
})

export const icons: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
