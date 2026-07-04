import { defineComponent, h } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import StarterKit from '@tiptap/starter-kit'
import { Link, RichTextEditor } from '@mantine-vue/tiptap'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useEditor } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import StarterKit from '@tiptap/starter-kit'
import { RichTextEditor, Link } from '@mantine-vue/tiptap'

const editor = useEditor({
  extensions: [StarterKit.configure({ link: false }), Link],
  content: '<p>Select some text to see bubble menu</p>',
})
</script>

<template>
  <RichTextEditor :editor="editor">
    <BubbleMenu v-if="editor" :editor="editor">
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Bold />
        <RichTextEditor.Italic />
        <RichTextEditor.Link />
      </RichTextEditor.ControlsGroup>
    </BubbleMenu>

    <RichTextEditor.Content />
  </RichTextEditor>
</template>
`

const Demo = defineComponent({
  name: 'TipTapBubbleMenuDemo',
  setup() {
    const editor = useEditor({
      extensions: [StarterKit.configure({ link: false }), Link],
      content: '<p>Select some text to see bubble menu</p>',
    })

    return () =>
      h(RichTextEditor, { editor: editor.value }, () => [
        editor.value
          ? h(BubbleMenu, { editor: editor.value }, () =>
              h(RichTextEditor.ControlsGroup, null, () => [
                h(RichTextEditor.Bold),
                h(RichTextEditor.Italic),
                h(RichTextEditor.Link),
              ]),
            )
          : null,
        h(RichTextEditor.Content),
      ])
  },
})

export const bubbleMenu: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
