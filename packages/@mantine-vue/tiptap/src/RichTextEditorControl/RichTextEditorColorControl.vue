<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { ColorSwatch } from '@mantine-vue/core'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import RichTextEditorControlComponent from './RichTextEditorControl.vue'
import type { RichTextEditorColorControlOwnProps } from './RichTextEditorColorControl.types'
import { useEditorSelector } from './use-editor-selector'

defineOptions({ name: 'RichTextEditorColorControl', inheritAttrs: false })

const props = defineProps<RichTextEditorColorControlOwnProps>()
const attrs = useAttrs()
const ctx = useRichTextEditorContext()
const currentColor = useEditorSelector(
  () => ctx.editor,
  (editor) => String(editor?.getAttributes('textStyle').color || ''),
)
const label = computed(() => ctx.labels.colorControlLabel(props.color))

function setColor() {
  ;(ctx.editor?.chain() as any)?.focus().setColor(props.color).run()
}
</script>

<template>
  <RichTextEditorControlComponent
    v-bind="attrs"
    :variant="ctx.variant"
    :active="currentColor === props.color"
    :aria-label="label"
    :title="label"
    @click="setColor"
  >
    <ColorSwatch :color="props.color" :size="14" />
  </RichTextEditorControlComponent>
</template>
