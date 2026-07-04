import { defineComponent, h, ref } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { RichTextEditor } from '@mantine-vue/tiptap'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { RichTextEditor } from '@mantine-vue/tiptap'

const isSourceCodeModeActive = ref(false)

const editor = useEditor({
  extensions: [StarterKit],
  content:
    '<p>Source code control example</p><p>New line with <strong>bold text</strong></p><p>New line with <em>italic</em> <em>text</em></p>',
})
</script>

<template>
  <RichTextEditor
    :editor="editor"
    @source-code-text-switch="(active) => (isSourceCodeModeActive = active)"
  >
    <RichTextEditor.Toolbar>
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.SourceCode />
      </RichTextEditor.ControlsGroup>
      <RichTextEditor.ControlsGroup v-if="!isSourceCodeModeActive">
        <RichTextEditor.Blockquote />
        <RichTextEditor.Bold />
        <RichTextEditor.Italic />
        <RichTextEditor.Underline />
        <RichTextEditor.Strikethrough />
        <RichTextEditor.ClearFormatting />
        <RichTextEditor.Highlight />
      </RichTextEditor.ControlsGroup>
    </RichTextEditor.Toolbar>

    <RichTextEditor.Content />
  </RichTextEditor>
</template>
`

const Demo = defineComponent({
  name: 'TipTapSourceCodeSwitcherDemo',
  setup() {
    const isSourceCodeModeActive = ref(false)
    const editor = useEditor({
      extensions: [StarterKit],
      content:
        '<p>Source code control example</p><p>New line with <strong>bold text</strong></p><p>New line with <em>italic</em> <em>text</em></p>',
    })

    return () =>
      h(
        RichTextEditor,
        {
          editor: editor.value,
          onSourceCodeTextSwitch: (active: boolean) => {
            isSourceCodeModeActive.value = active
          },
        },
        () => [
          h(RichTextEditor.Toolbar, null, () => [
            h(RichTextEditor.ControlsGroup, null, () => h(RichTextEditor.SourceCode)),
            !isSourceCodeModeActive.value
              ? h(RichTextEditor.ControlsGroup, null, () => [
                  h(RichTextEditor.Blockquote),
                  h(RichTextEditor.Bold),
                  h(RichTextEditor.Italic),
                  h(RichTextEditor.Underline),
                  h(RichTextEditor.Strikethrough),
                  h(RichTextEditor.ClearFormatting),
                  h(RichTextEditor.Highlight),
                ])
              : null,
          ]),
          h(RichTextEditor.Content),
        ],
      )
  },
})

export const sourceCodeSwitcher: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
