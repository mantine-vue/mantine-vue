<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import {
  getImageFiles,
  getUploadImageExtensionOptions,
  insertImageFilesWithUpload,
} from '../extensions/UploadImage'
import { IconPhoto } from '../icons/Icons'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import RichTextEditorControlBase from './RichTextEditorControlBase.vue'
import type { RichTextEditorImageUploadControlRuntimeProps } from './RichTextEditorImageUploadControl.types'
defineOptions({ name: 'RichTextEditorImageUploadControl', inheritAttrs: false })
const props = withDefaults(defineProps<RichTextEditorImageUploadControlRuntimeProps>(), {
  accept: 'image/*',
  disabled: false,
})
const attrs = useAttrs()
const ctx = useRichTextEditorContext()
const input = ref<HTMLInputElement | null>(null)
const usable = computed(() => !!ctx.editor && !ctx.editor.isDestroyed && ctx.editor.isEditable)
const disabled = computed(() => !usable.value || props.disabled)
function open(event: MouseEvent) {
  const handler = (attrs as any).onClick
  if (Array.isArray(handler)) handler.forEach((item) => item?.(event))
  else handler?.(event)
  if (!event.defaultPrevented) input.value?.click()
}
function change(event: Event) {
  const target = event.currentTarget as HTMLInputElement
  const files = getImageFiles(target.files)
  if (!files.length || !ctx.editor || !usable.value) return
  const extension = getUploadImageExtensionOptions(ctx.editor)
  const onImageUpload = ctx.onImageUpload ?? extension.onImageUpload
  if (!onImageUpload) return
  const { view } = ctx.editor
  insertImageFilesWithUpload(view, files, view.state.selection.from, {
    onImageUpload,
    onImageUploadError: ctx.onImageUploadError ?? extension.onImageUploadError,
  })
  target.value = ''
}
</script>
<template>
  <RichTextEditorControlBase
    v-bind="attrs"
    :icon="props.icon || IconPhoto"
    :disabled="disabled"
    :interactive="true"
    :variant="ctx.variant"
    :aria-label="ctx.labels.imageUploadControlLabel"
    :title="ctx.labels.imageUploadControlLabel"
    @click="open"
  />
  <input ref="input" type="file" :accept="props.accept" multiple hidden @change="change" />
</template>
