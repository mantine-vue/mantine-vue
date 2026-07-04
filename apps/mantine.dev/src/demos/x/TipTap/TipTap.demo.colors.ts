import { defineComponent, h } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { RichTextEditor } from '@mantine-vue/tiptap'
import { PhEyedropper } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { RichTextEditor } from '@mantine-vue/tiptap'
import { PhEyedropper } from '@phosphor-icons/vue'

const editor = useEditor({
  extensions: [StarterKit, TextStyle, Color],
  content: '<p>Apply some colors to this text</p>',
})
</script>

<template>
  <RichTextEditor :editor="editor">
    <RichTextEditor.Toolbar sticky sticky-offset="var(--docs-header-height)">
      <RichTextEditor.ColorPicker
        :colors="[
          '#25262b',
          '#868e96',
          '#fa5252',
          '#e64980',
          '#be4bdb',
          '#7950f2',
          '#4c6ef5',
          '#228be6',
          '#15aabf',
          '#12b886',
          '#40c057',
          '#82c91e',
          '#fab005',
          '#fd7e14',
        ]"
      />

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Control :interactive="false">
          <PhEyedropper :size="16" />
        </RichTextEditor.Control>
        <RichTextEditor.Color color="#F03E3E" />
        <RichTextEditor.Color color="#7048E8" />
        <RichTextEditor.Color color="#1098AD" />
        <RichTextEditor.Color color="#37B24D" />
        <RichTextEditor.Color color="#F59F00" />
      </RichTextEditor.ControlsGroup>

      <RichTextEditor.UnsetColor />
    </RichTextEditor.Toolbar>

    <RichTextEditor.Content />
  </RichTextEditor>
</template>
`

const Demo = defineComponent({
  name: 'TipTapColorsDemo',
  setup() {
    const editor = useEditor({
      extensions: [StarterKit, TextStyle, Color],
      content: '<p>Apply some colors to this text</p>',
    })

    return () =>
      h(RichTextEditor, { editor: editor.value }, () => [
        h(
          RichTextEditor.Toolbar,
          { sticky: true, stickyOffset: 'var(--docs-header-height)' },
          () => [
            h(RichTextEditor.ColorPicker, {
              colors: [
                '#25262b',
                '#868e96',
                '#fa5252',
                '#e64980',
                '#be4bdb',
                '#7950f2',
                '#4c6ef5',
                '#228be6',
                '#15aabf',
                '#12b886',
                '#40c057',
                '#82c91e',
                '#fab005',
                '#fd7e14',
              ],
            }),
            h(RichTextEditor.ControlsGroup, null, () => [
              h(RichTextEditor.Control, { interactive: false }, () =>
                h(PhEyedropper, { size: 16 }),
              ),
              h(RichTextEditor.Color, { color: '#F03E3E' }),
              h(RichTextEditor.Color, { color: '#7048E8' }),
              h(RichTextEditor.Color, { color: '#1098AD' }),
              h(RichTextEditor.Color, { color: '#37B24D' }),
              h(RichTextEditor.Color, { color: '#F59F00' }),
            ]),
            h(RichTextEditor.UnsetColor),
          ],
        ),
        h(RichTextEditor.Content),
      ])
  },
})

export const colors: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
