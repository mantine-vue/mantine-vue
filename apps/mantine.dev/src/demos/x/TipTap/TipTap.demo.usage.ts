import { defineComponent, h } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import SubScript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import { Link, RichTextEditor } from '@mantine-vue/tiptap'
import type { MantineDemo } from '@/demo'

const content =
  '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>'

const code = `
<script setup lang="ts">
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import SubScript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import { RichTextEditor, Link } from '@mantine-vue/tiptap'

const content =
  '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>'

const editor = useEditor({
  extensions: [
    StarterKit.configure({ link: false }),
    Link,
    Superscript,
    SubScript,
    Highlight,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
  ],
  content,
})
</script>

<template>
  <RichTextEditor :editor="editor">
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

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.H1 />
        <RichTextEditor.H2 />
        <RichTextEditor.H3 />
        <RichTextEditor.H4 />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Blockquote />
        <RichTextEditor.Hr />
        <RichTextEditor.BulletList />
        <RichTextEditor.OrderedList />
        <RichTextEditor.Subscript />
        <RichTextEditor.Superscript />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Link />
        <RichTextEditor.Unlink />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.AlignLeft />
        <RichTextEditor.AlignCenter />
        <RichTextEditor.AlignJustify />
        <RichTextEditor.AlignRight />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Undo />
        <RichTextEditor.Redo />
      </RichTextEditor.ControlsGroup>
    </RichTextEditor.Toolbar>

    <RichTextEditor.Content />
  </RichTextEditor>
</template>
`

const Demo = defineComponent({
  name: 'TipTapUsageDemo',
  setup() {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({ link: false }),
        Link,
        Superscript,
        SubScript,
        Highlight,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ],
      content,
    })

    return () =>
      h(RichTextEditor, { editor: editor.value }, () => [
        h(
          RichTextEditor.Toolbar,
          { sticky: true, stickyOffset: 'var(--docs-header-height)' },
          () => [
            h(RichTextEditor.ControlsGroup, null, () => [
              h(RichTextEditor.Bold),
              h(RichTextEditor.Italic),
              h(RichTextEditor.Underline),
              h(RichTextEditor.Strikethrough),
              h(RichTextEditor.ClearFormatting),
              h(RichTextEditor.Highlight),
              h(RichTextEditor.Code),
            ]),
            h(RichTextEditor.ControlsGroup, null, () => [
              h(RichTextEditor.H1),
              h(RichTextEditor.H2),
              h(RichTextEditor.H3),
              h(RichTextEditor.H4),
            ]),
            h(RichTextEditor.ControlsGroup, null, () => [
              h(RichTextEditor.Blockquote),
              h(RichTextEditor.Hr),
              h(RichTextEditor.BulletList),
              h(RichTextEditor.OrderedList),
              h(RichTextEditor.Subscript),
              h(RichTextEditor.Superscript),
            ]),
            h(RichTextEditor.ControlsGroup, null, () => [
              h(RichTextEditor.Link),
              h(RichTextEditor.Unlink),
            ]),
            h(RichTextEditor.ControlsGroup, null, () => [
              h(RichTextEditor.AlignLeft),
              h(RichTextEditor.AlignCenter),
              h(RichTextEditor.AlignJustify),
              h(RichTextEditor.AlignRight),
            ]),
            h(RichTextEditor.ControlsGroup, null, () => [
              h(RichTextEditor.Undo),
              h(RichTextEditor.Redo),
            ]),
          ],
        ),
        h(RichTextEditor.Content),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
