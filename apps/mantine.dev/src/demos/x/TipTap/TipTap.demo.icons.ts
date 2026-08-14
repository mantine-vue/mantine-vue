import { defineComponent, h, type HTMLAttributes } from 'vue'
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

const editor = useEditor({
  extensions: [StarterKit],
  content: '<p>Customize icons with the icon slot</p>',
})
</script>

<template>
  <RichTextEditor :editor="editor">
    <RichTextEditor.Toolbar>
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Bold>
          <template #icon="iconProps">
            <PhTextB v-bind="iconProps" :size="16" />
          </template>
        </RichTextEditor.Bold>

        <RichTextEditor.Italic>
          <template #icon="iconProps">
            <PhTextItalic v-bind="iconProps" :size="16" />
          </template>
        </RichTextEditor.Italic>
      </RichTextEditor.ControlsGroup>
    </RichTextEditor.Toolbar>

    <RichTextEditor.Content />
  </RichTextEditor>
</template>
`

const Demo = defineComponent({
  name: 'TipTapIconsDemo',
  setup() {
    const editor = useEditor({
      extensions: [StarterKit],
      content: '<p>Customize icons with the icon slot</p>',
    })

    return () =>
      h(RichTextEditor, { editor: editor.value }, () => [
        h(RichTextEditor.Toolbar, null, () =>
          h(RichTextEditor.ControlsGroup, null, () => [
            h(RichTextEditor.Bold, null, {
              icon: (iconProps: HTMLAttributes) => h(PhTextB, { ...iconProps, size: 16 }),
            }),
            h(RichTextEditor.Italic, null, {
              icon: (iconProps: HTMLAttributes) => h(PhTextItalic, { ...iconProps, size: 16 }),
            }),
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
