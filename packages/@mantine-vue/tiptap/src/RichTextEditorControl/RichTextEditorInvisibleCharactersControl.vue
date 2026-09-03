<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { IconPilcrow } from '../icons/Icons'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import RichTextEditorControlBaseComponent from './RichTextEditorControlBase.vue'
import type { RichTextEditorControlBaseRuntimeProps } from './RichTextEditorControl.types'
import { isSafeEditor, useEditorSelector } from './use-editor-selector'

defineOptions({ name: 'RichTextEditorInvisibleCharactersControl', inheritAttrs: false })
const props = withDefaults(defineProps<RichTextEditorControlBaseRuntimeProps>(), {
  active: undefined,
  disabled: undefined,
  interactive: true,
  icon: undefined,
})
const attrs = useAttrs()
const ctx = useRichTextEditorContext()
const state = useEditorSelector(
  () => ctx.editor,
  (editor) => {
    const safeEditor = isSafeEditor(editor) ? editor : null
    if (!safeEditor) return { active: false, disabled: true }
    return {
      active: Boolean((safeEditor.storage as any).invisibleCharacters?.visibility?.()),
      disabled: !(safeEditor.can() as any).toggleInvisibleCharacters?.(),
    }
  },
)
const active = computed(() => props.active ?? state.value.active)
const disabled = computed(() => props.disabled || state.value.disabled)

function toggle() {
  if (isSafeEditor(ctx.editor)) {
    ;(ctx.editor as any).chain().focus().toggleInvisibleCharacters().run()
  }
}
</script>

<template>
  <RichTextEditorControlBaseComponent
    v-bind="attrs"
    :active="active"
    :disabled="disabled"
    :interactive="props.interactive"
    :variant="props.variant ?? ctx.variant"
    :aria-label="ctx.labels.invisibleCharactersControlLabel"
    :title="ctx.labels.invisibleCharactersControlLabel"
    @click="toggle"
  >
    <template #icon="iconProps">
      <slot name="icon" v-bind="iconProps">
        <component :is="props.icon ?? IconPilcrow" v-bind="iconProps" />
      </slot>
    </template>
  </RichTextEditorControlBaseComponent>
</template>
