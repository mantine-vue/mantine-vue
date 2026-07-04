import { defineComponent, h } from 'vue'
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TaskItem from '@tiptap/extension-task-item'
import TipTapTaskList from '@tiptap/extension-task-list'
import { getTaskListExtension, RichTextEditor } from '@mantine-vue/tiptap'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TaskItem from '@tiptap/extension-task-item'
import TipTapTaskList from '@tiptap/extension-task-list'
import { RichTextEditor, getTaskListExtension } from '@mantine-vue/tiptap'

const editor = useEditor({
  extensions: [
    StarterKit,
    getTaskListExtension(TipTapTaskList),
    TaskItem.configure({
      nested: true,
      HTMLAttributes: {
        class: 'test-item',
      },
    }),
  ],
  content: \`
    <ul data-type="taskList">
      <li data-type="taskItem" data-checked="true">A list item</li>
      <li data-type="taskItem" data-checked="false">And another one</li>
    </ul>
    <p></p>
  \`,
})
</script>

<template>
  <RichTextEditor :editor="editor">
    <RichTextEditor.Toolbar>
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.TaskList />
        <RichTextEditor.TaskListLift />
        <RichTextEditor.TaskListSink />
      </RichTextEditor.ControlsGroup>
    </RichTextEditor.Toolbar>

    <RichTextEditor.Content />
  </RichTextEditor>
</template>
`

const Demo = defineComponent({
  name: 'TipTapTasksDemo',
  setup() {
    const editor = useEditor({
      extensions: [
        StarterKit,
        getTaskListExtension(TipTapTaskList),
        TaskItem.configure({
          nested: true,
          HTMLAttributes: {
            class: 'test-item',
          },
        }),
      ],
      content: `
        <ul data-type="taskList">
          <li data-type="taskItem" data-checked="true">A list item</li>
          <li data-type="taskItem" data-checked="false">And another one</li>
        </ul>
        <p></p>
      `,
    })

    return () =>
      h(RichTextEditor, { editor: editor.value }, () => [
        h(RichTextEditor.Toolbar, null, () =>
          h(RichTextEditor.ControlsGroup, null, () => [
            h(RichTextEditor.TaskList),
            h(RichTextEditor.TaskListLift),
            h(RichTextEditor.TaskListSink),
          ]),
        ),
        h(RichTextEditor.Content),
      ])
  },
})

export const tasks: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
