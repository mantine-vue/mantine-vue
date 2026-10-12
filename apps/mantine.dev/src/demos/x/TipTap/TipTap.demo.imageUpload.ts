import { defineComponent, h } from 'vue'
import TipTapImage from '@tiptap/extension-image'
import StarterKit from '@tiptap/starter-kit'
import { useEditor } from '@tiptap/vue-3'
import { notifications } from '@mantine-vue/notifications'
import {
  getUploadImageExtension,
  RichTextEditor,
  type ImageUploadResult,
} from '@mantine-vue/tiptap'
import type { MantineDemo } from '@/demo'

function editorDemo(options: { fail?: boolean; content: string }) {
  return defineComponent({
    setup() {
      const handleImageUpload = (file: File): Promise<ImageUploadResult> =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (options.fail) reject(new Error('Upload failed: server error'))
            else resolve({ src: URL.createObjectURL(file), alt: file.name })
          }, 3000)
        })

      const editor = useEditor({
        extensions: [
          StarterKit,
          getUploadImageExtension(TipTapImage, {
            onImageUpload: handleImageUpload,
            onImageUploadError: options.fail
              ? (_file, error) =>
                  notifications.show({
                    title: 'Image upload failed',
                    message: (error as Error).message,
                    color: 'red',
                  })
              : undefined,
          }),
        ],
        content: options.content,
      })

      return () =>
        h(RichTextEditor, { editor: editor.value }, () => [
          h(RichTextEditor.Toolbar, null, () => [
            h(RichTextEditor.ControlsGroup, null, () => [
              h(RichTextEditor.Bold),
              h(RichTextEditor.Italic),
            ]),
            h(RichTextEditor.ControlsGroup, null, () => h(RichTextEditor.ImageUpload)),
          ]),
          h(RichTextEditor.Content),
        ])
    },
  })
}

const sharedCode = (fail: boolean) => `<script setup lang="ts">
import TipTapImage from '@tiptap/extension-image'
import StarterKit from '@tiptap/starter-kit'
import { useEditor } from '@tiptap/vue-3'
${fail ? "import { notifications } from '@mantine-vue/notifications'\n" : ''}import { getUploadImageExtension, RichTextEditor } from '@mantine-vue/tiptap'

function handleImageUpload(file: File) {
  return new Promise((resolve${fail ? ', reject' : ''}) => {
    setTimeout(() => ${fail ? "reject(new Error('Upload failed: server error'))" : 'resolve({ src: URL.createObjectURL(file), alt: file.name })'}, 3000)
  })
}

const editor = useEditor({
  extensions: [StarterKit, getUploadImageExtension(TipTapImage, {
    onImageUpload: handleImageUpload,${fail ? "\n    onImageUploadError: (_file, error) => notifications.show({ title: 'Image upload failed', message: error.message, color: 'red' })," : ''}
  })],
  content: '${fail ? 'Try uploading an image – it will fail after 3 seconds and be removed from the editor.' : 'Click the image button in the toolbar, or drag & drop / paste an image into the editor.'}',
})
</script>

<template>
  <RichTextEditor :editor="editor">
    <RichTextEditor.Toolbar>
      <RichTextEditor.ControlsGroup><RichTextEditor.Bold /><RichTextEditor.Italic /></RichTextEditor.ControlsGroup>
      <RichTextEditor.ControlsGroup><RichTextEditor.ImageUpload /></RichTextEditor.ControlsGroup>
    </RichTextEditor.Toolbar>
    <RichTextEditor.Content />
  </RichTextEditor>
</template>`

export const imageUpload: MantineDemo = {
  type: 'code',
  component: editorDemo({
    content:
      '<p>Click the image button in the toolbar, or drag & drop / paste an image into the editor.</p>',
  }),
  code: sharedCode(false),
}

export const imageUploadError: MantineDemo = {
  type: 'code',
  component: editorDemo({
    fail: true,
    content:
      '<p>Try uploading an image – it will fail after 3 seconds and be removed from the editor.</p>',
  }),
  code: sharedCode(true),
}
