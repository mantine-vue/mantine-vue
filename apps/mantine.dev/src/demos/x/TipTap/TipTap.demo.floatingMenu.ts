import { defineComponent, h } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import { FloatingMenu } from '@tiptap/vue-3/menus'
import StarterKit from '@tiptap/starter-kit'
import { Link, RichTextEditor } from '@mantine-vue/tiptap'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useEditor } from '@tiptap/vue-3'
import { FloatingMenu } from '@tiptap/vue-3/menus'
import StarterKit from '@tiptap/starter-kit'
import { RichTextEditor, Link } from '@mantine-vue/tiptap'

const editor = useEditor({
  extensions: [StarterKit.configure({ link: false }), Link],
  content: '<p>Enter a new line to see floating menu</p>',
})
</script>

<template>
  <RichTextEditor :editor="editor">
    <FloatingMenu v-if="editor" :editor="editor">
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.H1 />
        <RichTextEditor.H2 />
        <RichTextEditor.BulletList />
      </RichTextEditor.ControlsGroup>
    </FloatingMenu>

    <RichTextEditor.Content />
  </RichTextEditor>
</template>
`

const Demo = defineComponent({
  name: 'TipTapFloatingMenuDemo',
  setup() {
    const editor = useEditor({
      extensions: [StarterKit.configure({ link: false }), Link],
      content: '<p>Enter a new line to see floating menu</p>',
    })

    return () =>
      h(RichTextEditor, { editor: editor.value }, () => [
        editor.value
          ? h(FloatingMenu, { editor: editor.value }, () =>
              h(RichTextEditor.ControlsGroup, null, () => [
                h(RichTextEditor.H1),
                h(RichTextEditor.H2),
                h(RichTextEditor.BulletList),
              ]),
            )
          : null,
        h(RichTextEditor.Content),
      ])
  },
})

export const floatingMenu: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
