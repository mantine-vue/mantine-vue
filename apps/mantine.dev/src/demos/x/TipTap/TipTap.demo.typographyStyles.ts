import { defineComponent, h } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Link, RichTextEditor } from '@mantine-vue/tiptap'
import type { MantineDemo } from '@/demo'
import classes from './TipTap.demo.typographyStyles.module.css'

const cssCode = `.root {
  h2 {
    color: light-dark(var(--mantine-color-gray-6), var(--mantine-color-dark-2));
    font-size: var(--mantine-font-size-xl);
  }

  p {
    font-size: var(--mantine-font-size-lg);
  }

  a {
    color: var(--mantine-color-red-6);
  }
}`

const code = `
<script setup lang="ts">
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { RichTextEditor, Link } from '@mantine-vue/tiptap'
import classes from './Demo.module.css'

const editor = useEditor({
  extensions: [StarterKit.configure({ link: false }), Link],
  content: \`
    <h2>Heading 2</h2>
    <p>Paragraph with <a href="https://mantine.dev">link</a></p>
  \`,
})
</script>

<template>
  <RichTextEditor :editor="editor" :class-names="classes">
    <RichTextEditor.Content />
  </RichTextEditor>
</template>
`

const Demo = defineComponent({
  name: 'TipTapTypographyStylesDemo',
  setup() {
    const editor = useEditor({
      extensions: [StarterKit.configure({ link: false }), Link],
      content: `
    <h2>Heading 2</h2>
    <p>Paragraph with <a href="https://mantine.dev">link</a></p>
    `,
    })

    return () =>
      h(RichTextEditor, { editor: editor.value, classNames: classes }, () =>
        h(RichTextEditor.Content),
      )
  },
})

export const typographyStyles: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.module.css', code: cssCode, language: 'scss' },
    { fileName: 'Demo.vue', code, language: 'html' },
  ],
}
