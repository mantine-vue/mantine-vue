import { defineComponent, h } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import tsLanguageSyntax from 'highlight.js/lib/languages/typescript'
import { RichTextEditor } from '@mantine-vue/tiptap'
import type { MantineDemo } from '@/demo'

const lowlight = createLowlight()

// Register languages that you are planning to use
lowlight.register({ ts: tsLanguageSyntax })

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const codeExample =
  escapeHtml(`// Valid braces Kata – https://www.codewars.com/kata/5277c8a221e209d3f6000b56

const pairs: Record<string, string> = {
  '[': ']',
  '{': '}',
  '(': ')',
};

const openBraces = Object.keys(pairs);

export function validBraces(braces: string) {
  const opened: string[] = [];

  for (let i = 0; i < braces.length; i += 1) {
    const brace = braces[i];

    if (openBraces.includes(brace)) {
      opened.push(brace);
      continue;
    }

    if (pairs[opened[opened.length - 1]] !== brace) {
      return false
    }

    opened.pop();
  }

  return opened.length === 0;
}`)

const code = `
<script setup lang="ts">
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import ts from 'highlight.js/lib/languages/typescript'
import { RichTextEditor } from '@mantine-vue/tiptap'

const lowlight = createLowlight()

// register languages that you are planning to use
lowlight.register({ ts })

const editor = useEditor({
  extensions: [
    StarterKit.configure({ codeBlock: false }),
    CodeBlockLowlight.configure({ lowlight }),
  ],
  content: '<p>Regular paragraph</p><pre><code>...</code></pre>',
})
</script>

<template>
  <RichTextEditor :editor="editor">
    <RichTextEditor.Toolbar>
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.CodeBlock />
      </RichTextEditor.ControlsGroup>
    </RichTextEditor.Toolbar>

    <RichTextEditor.Content />
  </RichTextEditor>
</template>
`

const Demo = defineComponent({
  name: 'TipTapCodeHighlightDemo',
  setup() {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({ codeBlock: false }),
        CodeBlockLowlight.configure({ lowlight }),
      ],
      content: `<p>Regular paragraph</p><pre><code>${codeExample}</code></pre>`,
    })

    return () =>
      h(RichTextEditor, { editor: editor.value }, () => [
        h(RichTextEditor.Toolbar, null, () =>
          h(RichTextEditor.ControlsGroup, null, () => h(RichTextEditor.CodeBlock)),
        ),
        h(RichTextEditor.Content),
      ])
  },
})

export const codeHighlight: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
