import { defineComponent, h } from 'vue'
import { TableKit } from '@tiptap/extension-table'
import StarterKit from '@tiptap/starter-kit'
import { useEditor } from '@tiptap/vue-3'
import { RichTextEditor } from '@mantine-vue/tiptap'
import type { MantineDemo } from '@/demo'

const content = `<table><tbody>
<tr><th><p>Framework</p></th><th><p>Language</p></th></tr>
<tr><td><p>Mantine</p></td><td><p>TypeScript</p></td></tr>
<tr><td><p>Tiptap</p></td><td><p>TypeScript</p></td></tr>
</tbody></table><p></p>`

const Demo = defineComponent({
  name: 'TipTapTableDemo',
  setup() {
    const editor = useEditor({ extensions: [StarterKit, TableKit], content })
    const group = (...controls: any[]) => h(RichTextEditor.ControlsGroup, null, () => controls)
    return () =>
      h(RichTextEditor, { editor: editor.value }, () => [
        h(RichTextEditor.Toolbar, { sticky: true }, () => [
          group(h(RichTextEditor.TableInsert), h(RichTextEditor.TableDelete)),
          group(
            h(RichTextEditor.TableColumnBefore),
            h(RichTextEditor.TableColumnAfter),
            h(RichTextEditor.TableColumnDelete),
          ),
          group(
            h(RichTextEditor.TableRowBefore),
            h(RichTextEditor.TableRowAfter),
            h(RichTextEditor.TableRowDelete),
          ),
          group(
            h(RichTextEditor.TableToggleHeaderRow),
            h(RichTextEditor.TableToggleHeaderColumn),
            h(RichTextEditor.TableMergeCells),
            h(RichTextEditor.TableSplitCell),
          ),
        ]),
        h(RichTextEditor.Content),
      ])
  },
})

export const table: MantineDemo = {
  type: 'code',
  component: Demo,
  code: `<script setup lang="ts">
import { TableKit } from '@tiptap/extension-table'
import StarterKit from '@tiptap/starter-kit'
import { useEditor } from '@tiptap/vue-3'
import { RichTextEditor } from '@mantine-vue/tiptap'
const editor = useEditor({ extensions: [StarterKit, TableKit], content: '<table>...</table>' })
</script>
<template>
  <RichTextEditor :editor="editor">
    <RichTextEditor.Toolbar sticky>
      <RichTextEditor.ControlsGroup><RichTextEditor.TableInsert /><RichTextEditor.TableDelete /></RichTextEditor.ControlsGroup>
      <RichTextEditor.ControlsGroup><RichTextEditor.TableColumnBefore /><RichTextEditor.TableColumnAfter /><RichTextEditor.TableColumnDelete /></RichTextEditor.ControlsGroup>
      <RichTextEditor.ControlsGroup><RichTextEditor.TableRowBefore /><RichTextEditor.TableRowAfter /><RichTextEditor.TableRowDelete /></RichTextEditor.ControlsGroup>
      <RichTextEditor.ControlsGroup><RichTextEditor.TableToggleHeaderRow /><RichTextEditor.TableToggleHeaderColumn /><RichTextEditor.TableMergeCells /><RichTextEditor.TableSplitCell /></RichTextEditor.ControlsGroup>
    </RichTextEditor.Toolbar>
    <RichTextEditor.Content />
  </RichTextEditor>
</template>`,
}
