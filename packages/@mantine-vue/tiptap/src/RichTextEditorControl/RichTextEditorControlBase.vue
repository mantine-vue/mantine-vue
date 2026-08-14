<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useRichTextEditorContext } from '../RichTextEditor.context'
import RichTextEditorControlComponent from './RichTextEditorControl.vue'
import type { RichTextEditorControlBaseRuntimeProps } from './RichTextEditorControl.types'

defineOptions({ name: 'RichTextEditorControlBase', inheritAttrs: false })

const props = defineProps<RichTextEditorControlBaseRuntimeProps>()
const attrs = useAttrs()
const ctx = useRichTextEditorContext()
const controlProps = computed(() => ({ ...props, ...attrs }))
</script>

<template>
  <RichTextEditorControlComponent v-bind="controlProps">
    <component :is="props.icon" v-bind="ctx.getStyles('controlIcon')" />
  </RichTextEditorControlComponent>
</template>
