<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { IconDetails } from '../icons/Icons'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import RichTextEditorControlBaseComponent from './RichTextEditorControlBase.vue'
import type { RichTextEditorControlBaseRuntimeProps } from './RichTextEditorControl.types'
import { isSafeEditor, useEditorSelector } from './use-editor-selector'

defineOptions({ name: 'RichTextEditorDetailsControl', inheritAttrs: false })
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
    const commands = safeEditor.can() as any
    const canSet = Boolean(commands.setDetails?.())
    const canUnset = Boolean(commands.unsetDetails?.())
    return { active: canUnset, disabled: !canSet && !canUnset }
  },
)
const active = computed(() => props.active ?? state.value.active)
const disabled = computed(() => props.disabled || state.value.disabled)

function toggle() {
  if (!isSafeEditor(ctx.editor)) return
  const chain = (ctx.editor as any).chain().focus()
  if ((ctx.editor.can() as any).unsetDetails?.()) chain.unsetDetails().run()
  else chain.setDetails().run()
}
</script>

<template>
  <RichTextEditorControlBaseComponent
    v-bind="attrs"
    :active="active"
    :disabled="disabled"
    :interactive="props.interactive"
    :variant="props.variant ?? ctx.variant"
    :aria-label="ctx.labels.detailsControlLabel"
    :title="ctx.labels.detailsControlLabel"
    @click="toggle"
  >
    <template #icon="iconProps">
      <slot name="icon" v-bind="iconProps">
        <component :is="props.icon ?? IconDetails" v-bind="iconProps" />
      </slot>
    </template>
  </RichTextEditorControlBaseComponent>
</template>
