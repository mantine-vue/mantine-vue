<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { rem } from '@mantine-vue/core'
import { IconBraces } from '../icons/Icons'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import RichTextEditorControlComponent from './RichTextEditorControl.vue'
import { isSafeEditor } from './use-editor-selector'

defineOptions({ name: 'RichTextEditorSourceCodeControl', inheritAttrs: false })

const attrs = useAttrs()
const ctx = useRichTextEditorContext()
const active = ref(false)

function toggleSourceCode() {
  if (!isSafeEditor(ctx.editor)) {
    return
  }

  if (active.value) {
    ctx.editor.commands.setContent(ctx.editor.getText(), { emitUpdate: true })
  } else {
    ctx.editor.commands.setContent(`<textarea>${ctx.editor.getHTML()}</textarea>`, {
      emitUpdate: false,
    })
  }

  active.value = !active.value
  ctx.onSourceCodeTextSwitch?.(active.value)
}
</script>

<template>
  <RichTextEditorControlComponent
    v-bind="attrs"
    :variant="ctx.variant"
    :active="active"
    :aria-label="ctx.labels.sourceCodeControlLabel"
    :title="ctx.labels.sourceCodeControlLabel"
    @click="toggleSourceCode"
  >
    <IconBraces :style="{ width: rem(16), height: rem(16) }" />
  </RichTextEditorControlComponent>
</template>
