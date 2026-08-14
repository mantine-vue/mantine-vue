<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import RichTextEditorControlBaseComponent from './RichTextEditorControlBase.vue'
import { isSafeEditor, useEditorSelector } from './use-editor-selector'
import type { RichTextEditorGeneratedControlRuntimeProps } from './RichTextEditorControl.types'

defineOptions({ name: 'RichTextEditorGeneratedControl', inheritAttrs: false })

const props = withDefaults(defineProps<RichTextEditorGeneratedControlRuntimeProps>(), {
  isActive: undefined,
  isDisabled: undefined,
  active: undefined,
  interactive: true,
  disabled: undefined,
  variant: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: undefined,
})

const attrs = useAttrs()
const ctx = useRichTextEditorContext()
const label = computed(() => ctx.labels[props.label] as string)
const editorState = useEditorSelector(
  () => ctx.editor,
  (editor) => {
    const safeEditor = isSafeEditor(editor) ? editor : null
    return {
      active:
        safeEditor && props.isActive?.name
          ? safeEditor.isActive(props.isActive.name, props.isActive.attributes as any)
          : false,
      disabled: safeEditor ? (props.isDisabled?.(safeEditor) ?? false) : true,
    }
  },
)

function runOperation() {
  if (!isSafeEditor(ctx.editor)) {
    return
  }

  ;(ctx.editor as any).chain().focus()[props.operation.name](props.operation.attributes).run()
}
</script>

<template>
  <RichTextEditorControlBaseComponent
    v-bind="attrs"
    :active="props.active ?? editorState.active"
    :interactive="props.interactive"
    :disabled="props.disabled ?? editorState.disabled"
    :variant="props.variant"
    :class-names="props.classNames"
    :styles="props.styles"
    :icon="props.icon"
    :aria-label="label"
    :title="label"
    @click="runOperation"
  />
</template>
